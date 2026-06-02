import type { Room } from "@workspace/api-client-react";
import { getSupabase } from "@/lib/supabase/client";
import type { CreateRoomInput, DbRoom, DbRoomWithStats } from "@/lib/supabase/types";

export function mapRoomRow(row: DbRoomWithStats): Room {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? undefined,
    vibe: row.vibe ?? undefined,
    genres: row.genres ?? [],
    maxMembers: row.max_members,
    ownerId: row.owner_id,
    ownerName: row.owner_name,
    isActive: row.is_active,
    memberCount: row.member_count,
    coverImageUrl: row.cover_image_url ?? undefined,
    createdAt: row.created_at,
  };
}

export async function fetchRooms(activeOnly = true): Promise<Room[]> {
  let query = getSupabase().from("rooms_with_stats").select("*").order("created_at", {
    ascending: false,
  });
  if (activeOnly) {
    query = query.eq("is_active", true);
  }
  const { data, error } = await query;
  if (error) throw error;
  return (data as DbRoomWithStats[]).map(mapRoomRow);
}

export async function fetchRoomById(roomId: number): Promise<Room | null> {
  const { data, error } = await getSupabase()
    .from("rooms_with_stats")
    .select("*")
    .eq("id", roomId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return mapRoomRow(data as DbRoomWithStats);
}

export async function createRoom(
  ownerProfileId: number,
  input: CreateRoomInput,
): Promise<DbRoom> {
  const { data, error } = await getSupabase()
    .from("rooms")
    .insert({
      name: input.name,
      description: input.description ?? null,
      vibe: input.vibe ?? null,
      genres: input.genres ?? [],
      max_members: input.max_members ?? 4,
      owner_id: ownerProfileId,
      cover_image_url: input.cover_image_url ?? null,
      is_active: true,
    })
    .select()
    .single();
  if (error) throw error;

  await getSupabase().from("room_members").insert({
    room_id: data.id,
    profile_id: ownerProfileId,
    role: "owner",
  });

  return data as DbRoom;
}
