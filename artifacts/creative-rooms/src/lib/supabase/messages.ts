import { getSupabase } from "@/lib/supabase/client";
import type { CreateMessageInput, DbMessageWithSender } from "@/lib/supabase/types";

export async function fetchRoomMessages(roomId: number): Promise<DbMessageWithSender[]> {
  const { data, error } = await getSupabase()
    .from("messages_with_sender")
    .select("*")
    .eq("room_id", roomId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data as DbMessageWithSender[];
}

export async function sendMessage(
  profileId: number,
  input: CreateMessageInput,
): Promise<DbMessageWithSender> {
  const { data, error } = await getSupabase()
    .from("messages")
    .insert({
      room_id: input.room_id,
      profile_id: profileId,
      content: input.content,
    })
    .select("id")
    .single();
  if (error) throw error;

  const { data: enriched, error: viewError } = await getSupabase()
    .from("messages_with_sender")
    .select("*")
    .eq("id", data.id)
    .single();
  if (viewError) throw viewError;
  return enriched as DbMessageWithSender;
}
