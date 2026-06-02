import type { AuthError, Session, User } from "@supabase/supabase-js";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";

export type AuthResult<T> = { data: T; error: null } | { data: null; error: AuthError | Error };

function notConfigured(): AuthResult<never> {
  return {
    data: null,
    error: new Error("Supabase auth is not configured"),
  };
}

export async function getSession(): Promise<Session | null> {
  if (!isSupabaseConfigured()) return null;
  const { data } = await getSupabase().auth.getSession();
  return data.session;
}

export async function getCurrentUser(): Promise<User | null> {
  if (!isSupabaseConfigured()) return null;
  const { data } = await getSupabase().auth.getUser();
  return data.user;
}

export async function signInWithEmail(
  email: string,
  password: string,
): Promise<AuthResult<Session>> {
  if (!isSupabaseConfigured()) return notConfigured();
  const { data, error } = await getSupabase().auth.signInWithPassword({
    email,
    password,
  });
  if (error) return { data: null, error };
  if (!data.session) {
    return { data: null, error: new Error("Sign-in succeeded but no session was returned") };
  }
  return { data: data.session, error: null };
}

export async function signUpWithEmail(
  email: string,
  password: string,
  metadata?: { display_name?: string },
): Promise<AuthResult<Session | null>> {
  if (!isSupabaseConfigured()) return notConfigured();
  const { data, error } = await getSupabase().auth.signUp({
    email,
    password,
    options: metadata?.display_name
      ? { data: { display_name: metadata.display_name } }
      : undefined,
  });
  if (error) return { data: null, error };
  return { data: data.session, error: null };
}

export async function signOut(): Promise<AuthResult<void>> {
  if (!isSupabaseConfigured()) return { data: undefined, error: null };
  const { error } = await getSupabase().auth.signOut();
  if (error) return { data: null, error };
  return { data: undefined, error: null };
}

export async function resetPasswordForEmail(email: string): Promise<AuthResult<void>> {
  if (!isSupabaseConfigured()) return notConfigured();
  const redirectTo =
    typeof window !== "undefined"
      ? `${window.location.origin}${import.meta.env.BASE_URL.replace(/\/$/, "")}/login`
      : undefined;
  const { error } = await getSupabase().auth.resetPasswordForEmail(email, { redirectTo });
  if (error) return { data: null, error };
  return { data: undefined, error: null };
}

export function onAuthStateChange(
  callback: (session: Session | null) => void,
): () => void {
  if (!isSupabaseConfigured()) {
    callback(null);
    return () => {};
  }
  const { data } = getSupabase().auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
  return () => data.subscription.unsubscribe();
}
