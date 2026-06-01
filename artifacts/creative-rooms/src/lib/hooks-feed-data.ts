import type { Hook } from "@workspace/api-client-react";
import { DEMO_HOOKS } from "@/lib/discover-demo-data";
import roomCover1 from "@/assets/images/room-cover-1.png";
import roomCover2 from "@/assets/images/room-cover-2.png";
import heroCover from "@/assets/images/hero.png";

export type HookWaveVariant = "amber" | "lavender" | "sage" | "gold" | "rose";

export type HookFeedItem = {
  id: number;
  title: string;
  genre: string;
  bpm: number;
  key: string;
  duration: string;
  creatorName: string;
  creatorInitials: string;
  creatorHue: number;
  uploadedAgo: string;
  roomOrigin?: string;
  commentCount: number;
  moodTags: string[];
  waveVariant: HookWaveVariant;
  filterTags: string[];
  audioUrl: string;
  creatorId: number;
  thumbImage: string;
  wipStatus: string;
};

const WIP_STATUSES = ["Idea stage", "40% finished", "Demo version", "Almost done"] as const;

export const HOOK_FILTER_CHIPS = [
  "All",
  "Vocals",
  "Beats",
  "Acoustic",
  "EDM",
  "Pop",
  "Chill",
  "Songwriter",
  "Experimental",
] as const;

export type HookFilterChip = (typeof HOOK_FILTER_CHIPS)[number];

export const HOOK_FEED_TOGGLES = ["For you", "New", "Following", "Saved"] as const;
export type HookFeedToggle = (typeof HOOK_FEED_TOGGLES)[number];

const THUMB_IMAGES = [roomCover1, roomCover2, heroCover, roomCover1, roomCover2, heroCover];

export const DEMO_VIBE_FILTERS = [
  "All",
  "Singer",
  "Producer",
  "Guitarist",
  "Keys",
  "Drums",
] as const;

export const DEMO_VIBE_CARDS = [
  { label: "Chill & cozy", sub: "42 hooks", icon: "coffee" as const },
  { label: "Late nights", sub: "28 hooks", icon: "moon" as const },
  { label: "Acoustic", sub: "19 hooks", icon: "guitar" as const },
  { label: "Vocals first", sub: "31 hooks", icon: "mic" as const },
  { label: "Beat makers", sub: "24 hooks", icon: "drum" as const },
  { label: "Keys & pads", sub: "16 hooks", icon: "piano" as const },
];

export const DEMO_HOOK_ACTIVITY = [
  { user: "Lina", action: "uploaded a new hook", time: "2m ago", avatar: "L", avatarColor: "hsl(32 32% 26%)" },
  { user: "johan.wav", action: "left a voice note on your hook", time: "18m ago", avatar: "J", avatarColor: "hsl(210 28% 24%)" },
  { user: "Noah", action: "joined Late night songwriters", time: "1h ago", avatar: "N", avatarColor: "hsl(145 26% 22%)" },
  { user: "Ella", action: "saved a draft remix", time: "3h ago", avatar: "E", avatarColor: "hsl(280 24% 24%)" },
];

const WAVE_VARIANTS: HookWaveVariant[] = ["amber", "lavender", "sage", "gold", "rose"];

const FEED_META: Record<
  number,
  {
    genre: string;
    bpm: number;
    key: string;
    duration: string;
    roomOrigin?: string;
    comments: number;
    moodTags: string[];
    filterTags: string[];
    creatorHue: number;
    waveVariant: HookWaveVariant;
    wipStatus: string;
  }
> = {
  8001: {
    genre: "Acoustic",
    bpm: 85,
    key: "Dm",
    duration: "0:24",
    roomOrigin: "Late night songwriters",
    comments: 4,
    moodTags: ["Warm", "Melodic", "Late night"],
    filterTags: ["acoustic", "songwriter", "chill"],
    creatorHue: 32,
    waveVariant: "amber",
    wipStatus: "40% finished",
  },
  8002: {
    genre: "Lo-fi",
    bpm: 78,
    key: "Am",
    duration: "0:31",
    roomOrigin: "Lo-fi beats",
    comments: 7,
    moodTags: ["Chill", "Emotional", "Dark"],
    filterTags: ["beats", "chill", "vocals"],
    creatorHue: 210,
    waveVariant: "lavender",
    wipStatus: "Demo version",
  },
  8003: {
    genre: "Pop",
    bpm: 110,
    key: "G",
    duration: "0:18",
    comments: 2,
    moodTags: ["Summer", "Melodic", "Bright"],
    filterTags: ["pop", "songwriter", "vocals"],
    creatorHue: 280,
    waveVariant: "gold",
    wipStatus: "Idea stage",
  },
  8004: {
    genre: "Acoustic",
    bpm: 84,
    key: "C",
    duration: "0:42",
    roomOrigin: "Porch sessions",
    comments: 5,
    moodTags: ["Warm", "Nostalgic", "Melodic"],
    filterTags: ["acoustic", "songwriter"],
    creatorHue: 145,
    waveVariant: "sage",
    wipStatus: "Almost done",
  },
  8005: {
    genre: "EDM",
    bpm: 124,
    key: "Fm",
    duration: "0:16",
    comments: 3,
    moodTags: ["Dark", "Experimental"],
    filterTags: ["edm", "beats", "experimental"],
    creatorHue: 12,
    waveVariant: "rose",
    wipStatus: "Idea stage",
  },
  8006: {
    genre: "Songwriter",
    bpm: 92,
    key: "E",
    duration: "0:28",
    roomOrigin: "Late night songwriters",
    comments: 6,
    moodTags: ["Emotional", "Warm"],
    filterTags: ["songwriter", "acoustic", "chill"],
    creatorHue: 38,
    waveVariant: "amber",
    wipStatus: "40% finished",
  },
};

const EXTRA_DEMO_HOOKS: Hook[] = [
  {
    id: 8005,
    creatorId: 15,
    creatorName: "Mika",
    title: "Warehouse sub pulse",
    description: "Unfinished drop — needs texture",
    audioUrl: "",
    vibe: "Intense",
    tags: ["EDM", "124 BPM"],
    lookingFor: ["producer"],
    maxSeats: 4,
    seatsLeft: 2,
    isActive: true,
    createdAt: new Date(Date.now() - 20 * 60_000).toISOString(),
  },
  {
    id: 8006,
    creatorId: 16,
    creatorName: "Sara",
    title: "Voice memo chorus sketch",
    description: "Rough but honest",
    audioUrl: "",
    vibe: "Raw",
    tags: ["Songwriter", "92 BPM"],
    lookingFor: ["guitar", "vocals"],
    maxSeats: 3,
    seatsLeft: 3,
    isActive: true,
    createdAt: new Date(Date.now() - 3 * 3600_000).toISOString(),
  },
];

export const ALL_DEMO_HOOKS: Hook[] = [...DEMO_HOOKS, ...EXTRA_DEMO_HOOKS];

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function parseBpmFromTags(tags: string[] | null | undefined): number {
  const tag = tags?.find((t) => /bpm/i.test(t));
  const n = tag?.match(/(\d+)/);
  return n ? Number(n[1]) : 90;
}

function parseGenreFromHook(hook: Hook): string {
  const skip = /bpm/i;
  const tag = hook.tags?.find((t) => !skip.test(t));
  return tag ?? hook.vibe ?? "Ideas";
}

export function hookToFeedItem(hook: Hook, index: number): HookFeedItem {
  const meta = FEED_META[hook.id];
  const variant = meta?.waveVariant ?? WAVE_VARIANTS[index % WAVE_VARIANTS.length];

  return {
    id: hook.id,
    title: hook.title,
    genre: meta?.genre ?? parseGenreFromHook(hook),
    bpm: meta?.bpm ?? parseBpmFromTags(hook.tags),
    key: meta?.key ?? "—",
    duration: meta?.duration ?? "0:30",
    creatorName: hook.creatorName ?? "Creator",
    creatorInitials: hook.creatorName?.charAt(0).toUpperCase() ?? "?",
    creatorHue: meta?.creatorHue ?? (hook.creatorId * 47) % 360,
    uploadedAgo: timeAgo(hook.createdAt),
    roomOrigin: meta?.roomOrigin,
    commentCount: meta?.comments ?? 0,
    moodTags: meta?.moodTags ?? (hook.tags ?? []).filter((t) => !/bpm/i.test(t)).slice(0, 4),
    waveVariant: variant,
    filterTags: meta?.filterTags ?? (hook.lookingFor ?? []).map((t) => t.toLowerCase()),
    audioUrl: hook.audioUrl ?? "",
    creatorId: hook.creatorId,
    thumbImage: THUMB_IMAGES[index % THUMB_IMAGES.length],
    wipStatus: meta?.wipStatus ?? WIP_STATUSES[index % WIP_STATUSES.length],
  };
}

export function filterFeedItems(
  items: HookFeedItem[],
  chip: HookFilterChip,
  search: string,
  toggle: HookFeedToggle,
): HookFeedItem[] {
  let list = items;

  if (chip !== "All") {
    const q = chip.toLowerCase();
    list = list.filter(
      (h) =>
        h.filterTags.some((t) => t.includes(q)) ||
        h.genre.toLowerCase().includes(q) ||
        h.moodTags.some((m) => m.toLowerCase().includes(q)),
    );
  }

  if (search.trim()) {
    const q = search.toLowerCase();
    list = list.filter(
      (h) =>
        h.title.toLowerCase().includes(q) ||
        h.creatorName.toLowerCase().includes(q) ||
        h.moodTags.some((m) => m.toLowerCase().includes(q)) ||
        h.roomOrigin?.toLowerCase().includes(q),
    );
  }

  if (toggle === "New") {
    list = [...list].reverse();
  }

  if (toggle === "Following") {
    list = list.filter((_, i) => i % 2 === 0);
  }

  if (toggle === "Saved") {
    list = list.filter((_, i) => i % 3 === 0);
  }

  return list;
}

export type DraftHook = {
  id: string;
  title: string;
  ago: string;
};

export type RecentRecording = {
  id: string;
  title: string;
  ago: string;
};

export const DEMO_DRAFTS: DraftHook[] = [
  { id: "d1", title: "Untitled chorus — Dm", ago: "2h ago" },
  { id: "d2", title: "Porch loop take 3", ago: "Yesterday" },
];

export const DEMO_RECENT_RECORDINGS: RecentRecording[] = [
  { id: "r1", title: "Voice memo — bridge idea", ago: "45m ago" },
  { id: "r2", title: "Guitar scratch", ago: "3h ago" },
];

export const DEMO_OPEN_COLLABS: DraftHook[] = [
  { id: "c1", title: "Late night songwriters", ago: "Live now" },
];

export const DEMO_ACTIVE_CREATORS = [
  { initials: "L", hue: 32, name: "Lina" },
  { initials: "J", hue: 210, name: "johan.wav" },
  { initials: "N", hue: 145, name: "Noah" },
  { initials: "E", hue: 280, name: "Ella" },
  { initials: "M", hue: 12, name: "Mika" },
  { initials: "S", hue: 38, name: "Sara" },
];

export function resolveHooksFeed(
  hooks: Hook[] | undefined,
  isLoading: boolean,
): { items: HookFeedItem[]; isDemo: boolean } {
  if (isLoading) return { items: [], isDemo: false };
  const api = Array.isArray(hooks) && hooks.length > 0 ? hooks : ALL_DEMO_HOOKS;
  const isDemo = !hooks?.length;
  return {
    items: api.map((h, i) => hookToFeedItem(h, i)),
    isDemo,
  };
}
