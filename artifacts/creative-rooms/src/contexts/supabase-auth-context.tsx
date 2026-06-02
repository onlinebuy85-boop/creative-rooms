/**
 * PAUSED — not mounted in App.tsx. Supabase auth UI/route work is on hold.
 * Use Clerk (prod) and dev login bypass until this provider is re-enabled.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import {
  getCurrentUser,
  getSession,
  onAuthStateChange,
  signInWithEmail,
  signOut as supabaseSignOut,
  signUpWithEmail,
  resetPasswordForEmail,
} from "@/lib/supabase/auth";
import { ensureProfileForCurrentUser } from "@/lib/supabase/profiles";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { DbProfile } from "@/lib/supabase/types";

type SupabaseAuthContextValue = {
  configured: boolean;
  isLoading: boolean;
  session: Session | null;
  user: User | null;
  profile: DbProfile | null;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<string | null>;
  refreshProfile: () => Promise<void>;
};

const SupabaseAuthContext = createContext<SupabaseAuthContextValue | null>(null);

async function loadProfile(user: User | null): Promise<DbProfile | null> {
  if (!user || !isSupabaseConfigured()) return null;
  try {
    return await ensureProfileForCurrentUser(
      user.id,
      user.user_metadata?.display_name ?? user.email?.split("@")[0],
    );
  } catch {
    return null;
  }
}

export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const configured = isSupabaseConfigured();
  const [isLoading, setIsLoading] = useState(configured);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<DbProfile | null>(null);

  const refreshProfile = useCallback(async () => {
    const current = await getCurrentUser();
    setUser(current);
    setProfile(await loadProfile(current));
  }, []);

  useEffect(() => {
    if (!configured) {
      setIsLoading(false);
      return;
    }

    let mounted = true;

    (async () => {
      const initialSession = await getSession();
      if (!mounted) return;
      setSession(initialSession);
      const initialUser = initialSession?.user ?? (await getCurrentUser());
      setUser(initialUser);
      setProfile(await loadProfile(initialUser));
      setIsLoading(false);
    })();

    const unsubscribe = onAuthStateChange(async (nextSession) => {
      setSession(nextSession);
      const nextUser = nextSession?.user ?? null;
      setUser(nextUser);
      setProfile(await loadProfile(nextUser));
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [configured]);

  const signIn = useCallback(async (email: string, password: string) => {
    const result = await signInWithEmail(email, password);
    if (result.error) return result.error.message;
    await refreshProfile();
    return null;
  }, [refreshProfile]);

  const signUp = useCallback(async (email: string, password: string) => {
    const result = await signUpWithEmail(email, password);
    if (result.error) return result.error.message;
    await refreshProfile();
    return null;
  }, [refreshProfile]);

  const signOut = useCallback(async () => {
    await supabaseSignOut();
    setSession(null);
    setUser(null);
    setProfile(null);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const result = await resetPasswordForEmail(email);
    return result.error?.message ?? null;
  }, []);

  const value = useMemo(
    () => ({
      configured,
      isLoading,
      session,
      user,
      profile,
      signIn,
      signUp,
      signOut,
      resetPassword,
      refreshProfile,
    }),
    [
      configured,
      isLoading,
      session,
      user,
      profile,
      signIn,
      signUp,
      signOut,
      resetPassword,
      refreshProfile,
    ],
  );

  return (
    <SupabaseAuthContext.Provider value={value}>{children}</SupabaseAuthContext.Provider>
  );
}

export function useSupabaseAuth(): SupabaseAuthContextValue {
  const ctx = useContext(SupabaseAuthContext);
  if (!ctx) {
    throw new Error("useSupabaseAuth must be used within SupabaseAuthProvider");
  }
  return ctx;
}

export function useOptionalSupabaseAuth(): SupabaseAuthContextValue | null {
  return useContext(SupabaseAuthContext);
}
