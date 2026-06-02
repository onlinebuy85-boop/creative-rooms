import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseAnonKey, getSupabaseUrl, isSupabaseConfigured } from "@/lib/supabase/env";

let client: SupabaseClient | null = null;

function createSupabaseClient(): SupabaseClient {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();

  if (!url || !key) {
    throw new Error(
      "Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in artifacts/creative-rooms/.env",
    );
  }

  return createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: typeof window !== "undefined" ? window.localStorage : undefined,
    },
  });
}

/** Singleton browser client. Safe to import when env is unset (use isSupabaseConfigured first). */
export function getSupabase(): SupabaseClient {
  if (!client) {
    client = createSupabaseClient();
  }
  return client;
}

/** Eager client for modules that require configuration. */
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    if (!isSupabaseConfigured()) {
      throw new Error(
        "Supabase client accessed without VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY",
      );
    }
    const value = getSupabase()[prop as keyof SupabaseClient];
    return typeof value === "function" ? value.bind(getSupabase()) : value;
  },
});

export { isSupabaseConfigured };
