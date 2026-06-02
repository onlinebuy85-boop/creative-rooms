import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";

export const STORAGE_BUCKETS = {
  avatars: "avatars",
  hooks: "hooks",
  roomImages: "room-images",
} as const;

export type StorageBucket = (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS];

function requireSupabase() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase storage requires VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY");
  }
  return getSupabase();
}

export function getPublicStorageUrl(bucket: StorageBucket, path: string): string {
  const { data } = requireSupabase().storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadAvatar(userId: string, file: File): Promise<string> {
  const supabase = requireSupabase();
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${userId}/avatar.${ext}`;
  const { error } = await supabase.storage.from(STORAGE_BUCKETS.avatars).upload(path, file, {
    upsert: true,
    contentType: file.type,
  });
  if (error) throw error;
  return getPublicStorageUrl(STORAGE_BUCKETS.avatars, path);
}

export async function uploadHookAudio(
  userId: string,
  hookId: number,
  file: File,
): Promise<string> {
  const supabase = requireSupabase();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${userId}/hooks/${hookId}/${Date.now()}-${safeName}`;
  const { error } = await supabase.storage.from(STORAGE_BUCKETS.hooks).upload(path, file, {
    upsert: false,
    contentType: file.type || "audio/mpeg",
  });
  if (error) throw error;
  const { data } = supabase.storage.from(STORAGE_BUCKETS.hooks).getPublicUrl(path);
  return data.publicUrl;
}

/** Signed URL for private hook audio playback. */
export async function getHookAudioSignedUrl(path: string, expiresIn = 3600): Promise<string> {
  const supabase = requireSupabase();
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKETS.hooks)
    .createSignedUrl(path, expiresIn);
  if (error) throw error;
  return data.signedUrl;
}

export async function uploadRoomImage(
  userId: string,
  roomId: number,
  file: File,
): Promise<string> {
  const supabase = requireSupabase();
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${userId}/rooms/${roomId}/cover.${ext}`;
  const { error } = await supabase.storage.from(STORAGE_BUCKETS.roomImages).upload(path, file, {
    upsert: true,
    contentType: file.type,
  });
  if (error) throw error;
  return getPublicStorageUrl(STORAGE_BUCKETS.roomImages, path);
}
