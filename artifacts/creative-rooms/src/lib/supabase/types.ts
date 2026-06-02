/** Supabase row shapes (public schema). */

export type DbProfile = {
  id: number;
  user_id: string;
  clerk_id: string | null;
  display_name: string;
  bio: string | null;
  musical_style: string | null;
  emotional_vibe: string | null;
  inspirations: string | null;
  genres: string[];
  avatar_url: string | null;
  is_creator: boolean;
  created_at: string;
  updated_at: string;
};

export type DbRoom = {
  id: number;
  name: string;
  description: string | null;
  vibe: string | null;
  genres: string[];
  max_members: number;
  owner_id: number;
  is_active: boolean;
  cover_image_url: string | null;
  created_at: string;
  updated_at: string;
};

export type DbRoomWithStats = DbRoom & {
  owner_name: string;
  member_count: number;
};

export type DbHook = {
  id: number;
  creator_id: number;
  title: string;
  description: string | null;
  audio_url: string;
  vibe: string | null;
  tags: string[];
  looking_for: string[];
  max_seats: number;
  room_id: number | null;
  is_active: boolean;
  created_at: string;
};

export type DbHookWithCreator = DbHook & {
  creator_name: string;
  creator_avatar_url: string | null;
  seats_left: number;
};

export type DbMessage = {
  id: number;
  room_id: number;
  profile_id: number;
  content: string;
  created_at: string;
};

export type DbMessageWithSender = DbMessage & {
  sender_name: string;
  sender_avatar_url: string | null;
};

export type CreateProfileInput = {
  display_name: string;
  bio?: string | null;
  musical_style?: string | null;
  emotional_vibe?: string | null;
  inspirations?: string | null;
  genres?: string[];
  avatar_url?: string | null;
  is_creator?: boolean;
};

export type CreateRoomInput = {
  name: string;
  description?: string | null;
  vibe?: string | null;
  genres?: string[];
  max_members?: number;
  cover_image_url?: string | null;
};

export type CreateMessageInput = {
  room_id: number;
  content: string;
};
