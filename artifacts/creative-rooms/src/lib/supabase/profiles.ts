import { getSupabase } from "@/lib/supabase/client";
import type { CreateProfileInput, DbProfile } from "@/lib/supabase/types";

export async function getProfileByUserId(userId: string): Promise<DbProfile | null> {
  const { data, error } = await getSupabase()
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data as DbProfile | null;
}

export async function getProfileById(profileId: number): Promise<DbProfile | null> {
  const { data, error } = await getSupabase()
    .from("profiles")
    .select("*")
    .eq("id", profileId)
    .maybeSingle();
  if (error) throw error;
  return data as DbProfile | null;
}

export async function createProfile(
  userId: string,
  input: CreateProfileInput,
): Promise<DbProfile> {
  const { data, error } = await getSupabase()
    .from("profiles")
    .insert({
      user_id: userId,
      display_name: input.display_name,
      bio: input.bio ?? null,
      musical_style: input.musical_style ?? null,
      emotional_vibe: input.emotional_vibe ?? null,
      inspirations: input.inspirations ?? null,
      genres: input.genres ?? [],
      avatar_url: input.avatar_url ?? null,
      is_creator: input.is_creator ?? false,
    })
    .select()
    .single();
  if (error) throw error;
  return data as DbProfile;
}

export async function updateProfile(
  userId: string,
  patch: Partial<CreateProfileInput>,
): Promise<DbProfile> {
  const { data, error } = await getSupabase()
    .from("profiles")
    .update(patch)
    .eq("user_id", userId)
    .select()
    .single();
  if (error) throw error;
  return data as DbProfile;
}

export async function ensureProfileForCurrentUser(
  userId: string,
  fallbackName?: string,
): Promise<DbProfile> {
  const existing = await getProfileByUserId(userId);
  if (existing) return existing;
  return createProfile(userId, {
    display_name: fallbackName?.trim() || "Creator",
  });
}
