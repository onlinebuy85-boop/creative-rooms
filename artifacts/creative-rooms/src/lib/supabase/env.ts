/** Supabase env from artifacts/creative-rooms/.env (loaded by Vite from package root). */

export function getSupabaseUrl(): string {
  return (import.meta.env.VITE_SUPABASE_URL ?? "").trim();
}

export function getSupabaseAnonKey(): string {
  return (import.meta.env.VITE_SUPABASE_ANON_KEY ?? "").trim();
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseUrl().length > 0 && getSupabaseAnonKey().length > 0;
}
