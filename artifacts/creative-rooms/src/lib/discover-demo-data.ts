import type { Hook, Room } from "@workspace/api-client-react";
import heroCover from "@/assets/images/hero.png";
import heroBg from "@/assets/images/hero-bg.png";
import roomCover1 from "@/assets/images/room-cover-1.png";
import roomCover2 from "@/assets/images/room-cover-2.png";

const now = new Date().toISOString();

/** Focal points for demo room cover art (fallback when no per-room visual) */
export const DEMO_ROOM_COVER_POSITIONS = [
  "28% 42%",
  "58% 28%",
  "72% 58%",
  "38% 72%",
] as const;

export type DemoRoomVisual = {
  cover: string;
  objectPosition: string;
  coverFilter: string;
  tintClass: string;
  variantClass: string;
  coverScale?: number;
};

/** Per-room discover visuals — unique image, crop, and tint per room */
export const DEMO_ROOM_VISUALS: Record<number, DemoRoomVisual> = {
  9001: {
    cover: roomCover1,
    objectPosition: "52% 38%",
    coverFilter: "brightness(1.08) sepia(0.24) saturate(1.22) contrast(1.05)",
    tintClass: "cr-room-card-tint--lamp",
    variantClass: "cr-room-card--lamp",
    coverScale: 1.1,
  },
  9002: {
    cover: heroBg,
    objectPosition: "62% 42%",
    coverFilter: "brightness(0.9) saturate(0.84) hue-rotate(188deg) contrast(1.22)",
    tintClass: "cr-room-card-tint--lofi",
    variantClass: "cr-room-card--lofi",
    coverScale: 1.14,
  },
  9003: {
    cover: heroCover,
    objectPosition: "50% 36%",
    coverFilter: "brightness(1.18) saturate(1.16) contrast(1.04)",
    tintClass: "cr-room-card-tint--pop",
    variantClass: "cr-room-card--pop",
    coverScale: 1.08,
  },
  9004: {
    cover: roomCover2,
    objectPosition: "44% 52%",
    coverFilter: "brightness(1.06) saturate(1.12) contrast(1.06)",
    tintClass: "cr-room-card-tint--acoustic",
    variantClass: "cr-room-card--acoustic",
    coverScale: 1.1,
  },
};

/** Shown when API returns no rooms (guest / offline discover) */
export const DEMO_ROOMS: Room[] = [
  {
    id: 9001,
    name: "Late night songwriters",
    description: "Soft vocals and unfinished verses",
    vibe: "Intimate",
    genres: ["Songwriter", "Vocals"],
    maxMembers: 6,
    ownerId: 1,
    ownerName: "Lina",
    isActive: true,
    memberCount: 3,
    coverImageUrl: roomCover1,
    createdAt: now,
  },
  {
    id: 9002,
    name: "Lo-fi beats",
    description: "Dusty drums and warm chords",
    vibe: "Chill",
    genres: ["Producer", "Beats"],
    maxMembers: 8,
    ownerId: 2,
    ownerName: "Noah",
    isActive: true,
    memberCount: 5,
    coverImageUrl: heroBg,
    createdAt: now,
  },
  {
    id: 9003,
    name: "Pop hooks",
    description: "Catchy toplines and quick feedback",
    vibe: "Bright",
    genres: ["Pop", "Hooks"],
    maxMembers: 6,
    ownerId: 3,
    ownerName: "Ella",
    isActive: true,
    memberCount: 2,
    coverImageUrl: heroCover,
    createdAt: now,
  },
  {
    id: 9004,
    name: "Acoustic sessions",
    description: "Fingerpicked ideas by candlelight",
    vibe: "Warm",
    genres: ["Guitar", "Acoustic"],
    maxMembers: 5,
    ownerId: 4,
    ownerName: "Mika",
    isActive: true,
    memberCount: 4,
    coverImageUrl: roomCover2,
    createdAt: now,
  },
];

export const DEMO_ROOM_PRESENCE: Record<number, number> = {
  9001: 3,
  9002: 5,
  9003: 2,
  9004: 4,
};

export const DEMO_HOOK_ENGAGEMENT: Record<number, { likes: number; comments: number }> = {
  8001: { likes: 14, comments: 5 },
  8002: { likes: 22, comments: 8 },
  8003: { likes: 9, comments: 3 },
  8004: { likes: 17, comments: 6 },
};

export const DEMO_HOOKS: Hook[] = [
  {
    id: 8001,
    creatorId: 11,
    creatorName: "Lina",
    title: "Acoustic riff in Dm",
    description: "Looking for harmonies",
    audioUrl: "",
    vibe: "Dreamy",
    tags: ["Acoustic", "92 BPM"],
    lookingFor: ["vocals", "mix"],
    maxSeats: 4,
    seatsLeft: 2,
    isActive: true,
    createdAt: new Date(Date.now() - 12 * 60_000).toISOString(),
  },
  {
    id: 8002,
    creatorId: 12,
    creatorName: "johan.wav",
    title: "Late-night vocal chop",
    description: "Lo-fi pocket, open for topline",
    audioUrl: "",
    vibe: "Melancholic",
    tags: ["Lo-fi", "78 BPM"],
    lookingFor: ["producer"],
    maxSeats: 3,
    seatsLeft: 1,
    isActive: true,
    createdAt: new Date(Date.now() - 45 * 60_000).toISOString(),
  },
  {
    id: 8003,
    creatorId: 13,
    creatorName: "Ella",
    title: "Pop lift — chorus idea",
    description: "Pop lift with room for ad-libs",
    audioUrl: "",
    vibe: "Euphoric",
    tags: ["Pop", "110 BPM"],
    lookingFor: ["songwriter", "guitar"],
    maxSeats: 4,
    seatsLeft: 3,
    isActive: true,
    createdAt: new Date(Date.now() - 2 * 3600_000).toISOString(),
  },
  {
    id: 8004,
    creatorId: 14,
    creatorName: "Noah",
    title: "Fingerpicked porch loop",
    description: "Fingerpicked progression",
    audioUrl: "",
    vibe: "Nostalgic",
    tags: ["Acoustic", "84 BPM"],
    lookingFor: ["vocals"],
    maxSeats: 3,
    seatsLeft: 2,
    isActive: true,
    createdAt: new Date(Date.now() - 5 * 3600_000).toISOString(),
  },
];

export type DemoActivityItem = {
  user: string;
  avatar: string;
  avatarColor: string;
  action: string;
  time: string;
  type: "join" | "hook" | "upload" | "listen";
};

export const DEMO_ACTIVITY: DemoActivityItem[] = [
  {
    user: "Lina",
    avatar: "L",
    avatarColor: "#7c4a1e",
    action: "joined Late night songwriters",
    time: "2m ago",
    type: "join",
  },
  {
    user: "johan.wav",
    avatar: "J",
    avatarColor: "#1e3a5f",
    action: "dropped a new hook",
    time: "14m ago",
    type: "hook",
  },
  {
    user: "Ella",
    avatar: "E",
    avatarColor: "#4a1d6e",
    action: "uploaded a vocal idea",
    time: "31m ago",
    type: "upload",
  },
  {
    user: "Noah",
    avatar: "N",
    avatarColor: "#14532d",
    action: "is listening in Lo-fi beats",
    time: "1h ago",
    type: "listen",
  },
  {
    user: "Mika",
    avatar: "M",
    avatarColor: "#7f1d1d",
    action: "started Acoustic sessions",
    time: "2h ago",
    type: "join",
  },
];

export type DemoOnlineUser = {
  name: string;
  role: string;
  avatar: string;
  avatarColor: string;
  status: "creating" | "listening";
};

export const DEMO_ONLINE_USERS: DemoOnlineUser[] = [
  { name: "Lina", role: "Vocalist", avatar: "L", avatarColor: "#7c4a1e", status: "creating" },
  { name: "Noah", role: "Producer", avatar: "N", avatarColor: "#14532d", status: "creating" },
  { name: "Ella", role: "Guitar", avatar: "E", avatarColor: "#4a1d6e", status: "listening" },
  { name: "johan.wav", role: "Beats", avatar: "J", avatarColor: "#1e3a5f", status: "creating" },
  { name: "Mika", role: "Songwriter", avatar: "M", avatarColor: "#7f1d1d", status: "listening" },
];

export const DEMO_VIBE_CARDS = [
  { label: "Chill & cozy", sub: "12 rooms live", icon: "coffee" as const },
  { label: "Late nights", sub: "8 rooms live", icon: "moon" as const },
  { label: "Acoustic", sub: "6 rooms live", icon: "guitar" as const },
  { label: "Vocals", sub: "9 rooms live", icon: "mic" as const },
  { label: "Beats", sub: "11 rooms live", icon: "drum" as const },
  { label: "Keys", sub: "5 rooms live", icon: "piano" as const },
];

export function resolveRoomsForDisplay(
  rooms: Room[] | undefined,
  isLoading: boolean | undefined,
  limit: number,
): { list: Room[]; isDemo: boolean; showSkeleton: boolean } {
  if (isLoading) {
    return { list: [], isDemo: false, showSkeleton: true };
  }
  const api = Array.isArray(rooms) ? rooms : [];
  if (api.length > 0) {
    return { list: api.slice(0, limit), isDemo: false, showSkeleton: false };
  }
  return { list: DEMO_ROOMS.slice(0, limit), isDemo: true, showSkeleton: false };
}

export function resolveHooksForDisplay(
  hooks: Hook[] | undefined,
  isLoading: boolean | undefined,
  limit: number,
): { list: Hook[]; isDemo: boolean; showSkeleton: boolean } {
  if (isLoading) {
    return { list: [], isDemo: false, showSkeleton: true };
  }
  const api = Array.isArray(hooks) ? hooks : [];
  if (api.length > 0) {
    return { list: api.slice(0, limit), isDemo: false, showSkeleton: false };
  }
  return { list: DEMO_HOOKS.slice(0, limit), isDemo: true, showSkeleton: false };
}

export function mergePresenceWithDemo(
  presence: Record<number, number> | undefined,
  useDemoRooms: boolean,
): Record<number, number> {
  if (!useDemoRooms) return presence ?? {};
  return { ...DEMO_ROOM_PRESENCE, ...presence };
}
