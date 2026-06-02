import type { Room } from "@workspace/api-client-react";
import {
  DEMO_ROOMS,
  DEMO_ROOM_VISUALS,
} from "@/lib/discover-demo-data";
import roomCover1 from "@/assets/images/room-cover-1.png";
import roomCover2 from "@/assets/images/room-cover-2.png";
import heroCover from "@/assets/images/hero.png";
import heroBg from "@/assets/images/hero-bg.png";

export type RoomCardStatus =
  | "live"
  | "just_started"
  | "looking_vocals"
  | "looking_guitar"
  | "in_progress";

export type RoomOverviewItem = {
  room: Room;
  status: RoomCardStatus;
  statusLabel: string;
  peopleCount: number;
  description: string;
  /** @deprecated use spaceGenre / spaceMood / spaceGoal */
  genreRow: string;
  spaceGenre: string;
  spaceMood: string;
  spaceGoal: string;
  moodTag: string;
  href: string;
  avatarInitials: string[];
  filterTags: string[];
};

export const ROOM_FILTER_TABS = [
  "All rooms",
  "Live now",
  "Just started",
  "Looking for",
  "Collab friendly",
  "My rooms",
  "Invites",
] as const;

export type RoomFilterTab = (typeof ROOM_FILTER_TABS)[number];

export const ROOM_GENRE_CHIPS = [
  "Hip Hop",
  "Pop",
  "R&B",
  "Lo-fi",
  "House",
  "Rock",
  "Ambient",
] as const;

export const ROOM_VIBE_CHIPS = [
  "Chill",
  "Energetic",
  "Dark",
  "Happy",
  "Experimental",
] as const;

export const ROOM_LOOKING_CHIPS = [
  "Vocals",
  "Guitar",
  "Beats",
  "Producers",
  "Lyrics",
  "Feedback",
] as const;

export const ROOM_PEOPLE_CHIPS = ["1–3", "4–7", "8+"] as const;

const EXTRA_ROOMS: Room[] = [
  {
    id: 9005,
    name: "Midnight R&B sketches",
    description: "Slow grooves and vocal stacks",
    vibe: "Dark",
    genres: ["R&B", "Vocals"],
    maxMembers: 6,
    ownerId: 5,
    ownerName: "Maya",
    isActive: true,
    memberCount: 2,
    coverImageUrl: heroBg,
    createdAt: new Date().toISOString(),
  },
  {
    id: 9006,
    name: "House loop lab",
    description: "Four-on-the-floor ideas only",
    vibe: "Energetic",
    genres: ["House", "Producer"],
    maxMembers: 8,
    ownerId: 6,
    ownerName: "Kai",
    isActive: true,
    memberCount: 6,
    coverImageUrl: roomCover2,
    createdAt: new Date().toISOString(),
  },
  {
    id: 9007,
    name: "Ambient textures",
    description: "Pads, drones, and space",
    vibe: "Chill",
    genres: ["Ambient", "Experimental"],
    maxMembers: 5,
    ownerId: 7,
    ownerName: "Iris",
    isActive: true,
    memberCount: 1,
    coverImageUrl: heroCover,
    createdAt: new Date().toISOString(),
  },
  {
    id: 9008,
    name: "Rock riffs open mic",
    description: "Distorted ideas welcome",
    vibe: "Energetic",
    genres: ["Rock", "Guitar"],
    maxMembers: 7,
    ownerId: 8,
    ownerName: "Theo",
    isActive: true,
    memberCount: 4,
    coverImageUrl: roomCover1,
    createdAt: new Date().toISOString(),
  },
];

const OVERVIEW_META: Record<
  number,
  Omit<RoomOverviewItem, "room">
> = {
  9001: {
    status: "live",
    statusLabel: "LIVE",
    peopleCount: 8,
    description: "Soft vocals and unfinished verses — pull up a chair.",
    genreRow: "Acoustic · Chill · Songwriting",
    spaceGenre: "Acoustic",
    spaceMood: "Chill",
    spaceGoal: "Songwriting",
    moodTag: "Chill",
    href: "/rooms/demo",
    avatarInitials: ["L", "J", "N", "E"],
    filterTags: ["live", "collab", "songwriter"],
  },
  9002: {
    status: "just_started",
    statusLabel: "JUST STARTED",
    peopleCount: 3,
    description: "Dusty drums and warm chords. Still finding the pocket.",
    genreRow: "Lo-fi · Beats · Collaboration",
    spaceGenre: "Lo-fi",
    spaceMood: "Beats",
    spaceGoal: "Collaboration",
    moodTag: "Lo-fi",
    href: "/rooms/demo",
    avatarInitials: ["N", "M"],
    filterTags: ["just_started", "beats", "lo-fi"],
  },
  9003: {
    status: "looking_vocals",
    statusLabel: "LOOKING FOR VOCALS",
    peopleCount: 5,
    description: "Catchy toplines need a voice — hop in when ready.",
    genreRow: "Pop · Topline · Vocal search",
    spaceGenre: "Pop",
    spaceMood: "Topline",
    spaceGoal: "Vocal search",
    moodTag: "Bright",
    href: "/rooms/demo",
    avatarInitials: ["E", "S", "K"],
    filterTags: ["looking", "pop", "vocals"],
  },
  9004: {
    status: "in_progress",
    statusLabel: "IN PROGRESS",
    peopleCount: 6,
    description: "Fingerpicked ideas by candlelight. Bridge still open.",
    genreRow: "Guitar · Warm · Jam session",
    spaceGenre: "Guitar",
    spaceMood: "Warm",
    spaceGoal: "Jam session",
    moodTag: "Warm",
    href: "/rooms/demo",
    avatarInitials: ["M", "T", "A", "L"],
    filterTags: ["collab", "acoustic", "guitar"],
  },
  9005: {
    status: "looking_guitar",
    statusLabel: "LOOKING FOR GUITAR",
    peopleCount: 2,
    description: "Vocal stacks laid down — need a rhythm guitarist.",
    genreRow: "R&B · Dark · Layering",
    spaceGenre: "R&B",
    spaceMood: "Dark",
    spaceGoal: "Layering",
    moodTag: "Dark",
    href: "/rooms/demo",
    avatarInitials: ["M", "Y"],
    filterTags: ["looking", "r&b", "guitar"],
  },
  9006: {
    status: "live",
    statusLabel: "LIVE",
    peopleCount: 7,
    description: "Looping house grooves — drop ideas in the chat.",
    genreRow: "House · Energetic · Collaboration",
    spaceGenre: "House",
    spaceMood: "Energetic",
    spaceGoal: "Collaboration",
    moodTag: "Energetic",
    href: "/rooms/demo",
    avatarInitials: ["K", "D", "R", "F"],
    filterTags: ["live", "house", "producer"],
  },
  9007: {
    status: "just_started",
    statusLabel: "JUST STARTED",
    peopleCount: 1,
    description: "Building a slow ambient bed. Quiet collaborators welcome.",
    genreRow: "Ambient · Experimental · Sound design",
    spaceGenre: "Ambient",
    spaceMood: "Experimental",
    spaceGoal: "Sound design",
    moodTag: "Experimental",
    href: "/rooms/demo",
    avatarInitials: ["I"],
    filterTags: ["just_started", "ambient", "chill"],
  },
  9008: {
    status: "in_progress",
    statusLabel: "IN PROGRESS",
    peopleCount: 4,
    description: "Heavy riffs and loose structure — no finished songs yet.",
    genreRow: "Rock · Raw · Open jam",
    spaceGenre: "Rock",
    spaceMood: "Raw",
    spaceGoal: "Open jam",
    moodTag: "Energetic",
    href: "/rooms/demo",
    avatarInitials: ["T", "B", "C"],
    filterTags: ["collab", "rock", "guitar"],
  },
};

export const ALL_DEMO_ROOMS_LIST: Room[] = [...DEMO_ROOMS, ...EXTRA_ROOMS];

export function buildRoomOverviewItems(): RoomOverviewItem[] {
  return ALL_DEMO_ROOMS_LIST.map((room) => {
    const meta = OVERVIEW_META[room.id];
    return {
      room,
      status: meta?.status ?? "in_progress",
      statusLabel: meta?.statusLabel ?? "IN PROGRESS",
      peopleCount: meta?.peopleCount ?? room.memberCount ?? 0,
      description: meta?.description ?? room.description ?? "",
      genreRow:
        meta?.genreRow ??
        `${room.genres?.[0] ?? "Ideas"} · ${room.vibe ?? "Open"} · Collaboration`,
      spaceGenre: meta?.spaceGenre ?? room.genres?.[0] ?? "Ideas",
      spaceMood: meta?.spaceMood ?? room.vibe ?? "Open",
      spaceGoal: meta?.spaceGoal ?? "Collaboration",
      moodTag: meta?.moodTag ?? room.vibe ?? "Chill",
      href: meta?.href ?? "/rooms/demo",
      avatarInitials: meta?.avatarInitials ?? ["?"],
      filterTags: meta?.filterTags ?? [],
    };
  });
}

export const DEMO_ROOMS_OVERVIEW = buildRoomOverviewItems();

export const DEMO_LIVE_NOW = DEMO_ROOMS_OVERVIEW.filter((r) => r.status === "live").slice(0, 4);

export const DEMO_ROOM_ACTIVITY = [
  {
    user: "Noah",
    action: "started a room",
    room: "Lo-fi beats",
    time: "2m ago",
    avatar: "N",
    color: "hsl(210 28% 24%)",
  },
  {
    user: "Maya",
    action: "joined",
    room: "Midnight R&B sketches",
    time: "14m ago",
    avatar: "M",
    color: "hsl(280 24% 24%)",
  },
  {
    user: "Ella",
    action: "started acoustic room",
    room: "Acoustic sessions",
    time: "1h ago",
    avatar: "E",
    color: "hsl(32 32% 26%)",
  },
  {
    user: "Kai",
    action: "opened collab session",
    room: "House loop lab",
    time: "2h ago",
    avatar: "K",
    color: "hsl(12 28% 22%)",
  },
];

export function getRoomVisualIndex(roomId: number): number {
  const ids = ALL_DEMO_ROOMS_LIST.map((r) => r.id);
  const idx = ids.indexOf(roomId);
  return idx >= 0 ? idx : 0;
}

export { DEMO_ROOM_VISUALS };

export function filterRoomOverview(
  items: RoomOverviewItem[],
  tab: RoomFilterTab,
  search: string,
): RoomOverviewItem[] {
  let list = items;

  if (tab === "Live now") {
    list = list.filter((r) => r.status === "live");
  } else if (tab === "Just started") {
    list = list.filter((r) => r.status === "just_started");
  } else if (tab === "Looking for") {
    list = list.filter(
      (r) => r.status === "looking_vocals" || r.status === "looking_guitar",
    );
  } else if (tab === "Collab friendly") {
    list = list.filter((r) => r.filterTags.includes("collab"));
  } else if (tab === "My rooms") {
    list = list.filter((_, i) => i % 3 === 0);
  } else if (tab === "Invites") {
    list = list.filter((_, i) => i % 4 === 1);
  }

  if (search.trim()) {
    const q = search.toLowerCase();
    list = list.filter(
      (r) =>
        r.room.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.genreRow.toLowerCase().includes(q) ||
        r.spaceGenre.toLowerCase().includes(q) ||
        r.spaceMood.toLowerCase().includes(q) ||
        r.spaceGoal.toLowerCase().includes(q) ||
        (r.room.genres ?? []).some((g) => g.toLowerCase().includes(q)),
    );
  }

  return list;
}
