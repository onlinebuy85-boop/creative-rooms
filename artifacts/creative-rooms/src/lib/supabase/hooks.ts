import type { Hook } from "@workspace/api-client-react";
import { getSupabase } from "@/lib/supabase/client";
import { uploadHookAudio } from "@/lib/supabase/storage";
import type { DbHookWithCreator } from "@/lib/supabase/types";

export function mapHookRow(row: DbHookWithCreator): Hook {
  return {
    id: row.id,
    creatorId: row.creator_id,
    creatorName: row.creator_name,
    creatorAvatarUrl: row.creator_avatar_url ?? undefined,
    title: row.title,
    description: row.description ?? undefined,
    audioUrl: row.audio_url,
    vibe: row.vibe ?? undefined,
    tags: row.tags ?? [],
    lookingFor: row.looking_for ?? [],
    maxSeats: row.max_seats,
    seatsLeft: row.seats_left,
    roomId: row.room_id ?? undefined,
    isActive: row.is_active,
    createdAt: row.created_at,
  };
}

export async function fetchHooks(activeOnly = true): Promise<Hook[]> {
  let query = getSupabase()
    .from("hooks_with_creator")
    .select("*")
    .order("created_at", { ascending: false });
  if (activeOnly) {
    query = query.eq("is_active", true);
  }
  const { data, error } = await query;
  if (error) throw error;
  return (data as DbHookWithCreator[]).map(mapHookRow);
}

export type UploadHookAudioInput = {
  userId: string;
  creatorProfileId: number;
  title: string;
  file: File;
  description?: string;
  vibe?: string;
  tags?: string[];
  lookingFor?: string[];
  maxSeats?: number;
  roomId?: number;
};

export async function uploadHookAudioAndCreate(
  input: UploadHookAudioInput,
): Promise<Hook> {
  const placeholderPath = `${input.userId}/hooks/pending/${Date.now()}-${input.file.name}`;
  const { data: hookRow, error: insertError } = await getSupabase()
    .from("hooks")
    .insert({
      creator_id: input.creatorProfileId,
      title: input.title,
      description: input.description ?? null,
      audio_url: placeholderPath,
      vibe: input.vibe ?? null,
      tags: input.tags ?? [],
      looking_for: input.lookingFor ?? [],
      max_seats: input.maxSeats ?? 3,
      room_id: input.roomId ?? null,
      is_active: true,
    })
    .select("id")
    .single();
  if (insertError) throw insertError;

  const audioUrl = await uploadHookAudio(input.userId, hookRow.id, input.file);

  const { data: updated, error: updateError } = await getSupabase()
    .from("hooks")
    .update({ audio_url: audioUrl })
    .eq("id", hookRow.id)
    .select("id")
    .single();
  if (updateError) throw updateError;

  const { data, error } = await getSupabase()
    .from("hooks_with_creator")
    .select("*")
    .eq("id", updated.id)
    .single();
  if (error) throw error;
  return mapHookRow(data as DbHookWithCreator);
}
