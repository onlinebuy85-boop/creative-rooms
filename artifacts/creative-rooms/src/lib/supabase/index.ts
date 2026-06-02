export { getSupabase, supabase, isSupabaseConfigured } from "@/lib/supabase/client";
export { getSupabaseUrl, getSupabaseAnonKey } from "@/lib/supabase/env";
// Auth helpers exist in ./auth.ts but are not wired to login/routes (paused).
export * from "@/lib/supabase/storage";
export * from "@/lib/supabase/profiles";
export * from "@/lib/supabase/rooms";
export * from "@/lib/supabase/hooks";
export * from "@/lib/supabase/messages";
export * from "@/lib/supabase/room-mappers";
export type * from "@/lib/supabase/types";
