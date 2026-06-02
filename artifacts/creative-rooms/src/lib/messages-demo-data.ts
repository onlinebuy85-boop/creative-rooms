import roomCover1 from "@/assets/images/room-cover-1.png";
import roomCover2 from "@/assets/images/room-cover-2.png";
import heroCover from "@/assets/images/hero.png";

export type MessageTab = "All" | "Unread" | "Rooms" | "Requests";

export type ConversationKind = "room" | "dm";

export type DemoConversation = {
  id: string;
  kind: ConversationKind;
  title: string;
  preview: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
  isActive?: boolean;
  avatarImage?: string;
  avatarInitials?: string[];
  memberCount?: number;
  hasWaveform?: boolean;
  waveSeed?: number;
};

export type AudioMeta = {
  title: string;
  duration: string;
  instrument?: string;
  mood?: string;
  bpm?: number;
  key?: string;
  waveVariant: "amber" | "lavender" | "sage";
};

export type DemoMessage =
  | {
      id: string;
      type: "text";
      incoming: boolean;
      body: string;
      time?: string;
      reactions?: string[];
      replyCount?: number;
      replyAvatars?: string[];
      seenBy?: number;
      seenAvatars?: string[];
    }
  | {
      id: string;
      type: "audio";
      incoming: boolean;
      audio: AudioMeta;
      time?: string;
      replyCount?: number;
      replyAvatars?: string[];
    };

export type DemoMember = {
  id: string;
  name: string;
  role?: string;
  initials: string;
  hue: number;
  online: boolean;
};

export type SharedInChat = {
  id: string;
  title: string;
  meta: string;
  duration: string;
  waveVariant: "amber" | "lavender" | "sage";
  waveSeed: number;
};

export type ConversationDetail = {
  aboutImage: string;
  description: string;
  createdMeta: string;
  members: DemoMember[];
  shared: SharedInChat[];
};

export const MESSAGE_TABS: MessageTab[] = ["All", "Unread", "Rooms", "Requests"];

export const DEMO_CONVERSATIONS: DemoConversation[] = [
  {
    id: "late-night",
    kind: "room",
    title: "Late night songwriters",
    preview: "Lina: Just dropped a new idea",
    timestamp: "2m",
    unreadCount: 2,
    isOnline: true,
    isActive: true,
    avatarImage: roomCover1,
    memberCount: 8,
    hasWaveform: true,
    waveSeed: 1,
  },
  {
    id: "lofi-beats",
    kind: "room",
    title: "Lo-fi beats",
    preview: "Noah: Added a dusty drum loop",
    timestamp: "15m",
    unreadCount: 0,
    isOnline: true,
    avatarImage: roomCover2,
    memberCount: 5,
    hasWaveform: true,
    waveSeed: 2,
  },
  {
    id: "pop-hooks",
    kind: "room",
    title: "Pop hooks",
    preview: "Ella: Anyone want to try a chorus?",
    timestamp: "1h",
    unreadCount: 1,
    isOnline: false,
    avatarInitials: ["E", "M", "K"],
    memberCount: 6,
  },
  {
    id: "lina-dm",
    kind: "dm",
    title: "Lina",
    preview: "Sent you a voice note about the bridge",
    timestamp: "3h",
    unreadCount: 0,
    isOnline: true,
    avatarInitials: ["L"],
    hasWaveform: true,
    waveSeed: 3,
  },
  {
    id: "acoustic",
    kind: "room",
    title: "Acoustic sessions",
    preview: "Mika: This chord progression feels right",
    timestamp: "Yesterday",
    unreadCount: 0,
    isOnline: false,
    avatarImage: heroCover,
    memberCount: 4,
  },
  {
    id: "johan-dm",
    kind: "dm",
    title: "johan.wav",
    preview: "Let's jump in the room later",
    timestamp: "Yesterday",
    unreadCount: 0,
    isOnline: false,
    avatarInitials: ["J"],
  },
  {
    id: "invite-1",
    kind: "dm",
    title: "Kai invited you",
    preview: "Join House loop lab?",
    timestamp: "2d",
    unreadCount: 1,
    isOnline: false,
    avatarInitials: ["K"],
  },
];

export const DEMO_MESSAGES: Record<string, DemoMessage[]> = {
  "late-night": [
    {
      id: "m1",
      type: "audio",
      incoming: true,
      audio: {
        title: "Late night melody",
        duration: "0:28",
        instrument: "Piano",
        mood: "Melodic",
        bpm: 90,
        key: "A minor",
        waveVariant: "amber",
      },
      replyCount: 3,
      replyAvatars: ["L", "N", "E"],
    },
    {
      id: "m2",
      type: "text",
      incoming: true,
      body: "Love the vibe on this — feels unfinished in the best way.",
      reactions: ["🔥"],
    },
    {
      id: "m3",
      type: "text",
      incoming: false,
      body: "This is beautiful. Let's build on this in the room later tonight?",
      seenBy: 6,
      seenAvatars: ["L", "N", "E", "M", "J", "K"],
    },
  ],
  "lofi-beats": [
    {
      id: "m1",
      type: "text",
      incoming: true,
      body: "Dropped a rough beat — needs texture on the hi-hats.",
    },
    {
      id: "m2",
      type: "audio",
      incoming: true,
      audio: {
        title: "Dusty loop",
        duration: "0:16",
        instrument: "Drums",
        mood: "Chill",
        bpm: 78,
        key: "Am",
        waveVariant: "lavender",
      },
    },
  ],
};

export const DEMO_DETAILS: Record<string, ConversationDetail> = {
  "late-night": {
    aboutImage: roomCover1,
    description: "A space for late nights, soft vocals, and unfinished verses.",
    createdMeta: "Created by Lina · Nov 12, 2023",
    members: [
      { id: "1", name: "Lina", role: "Admin", initials: "L", hue: 32, online: true },
      { id: "2", name: "Noah", initials: "N", hue: 210, online: true },
      { id: "3", name: "Ella", initials: "E", hue: 280, online: false },
      { id: "4", name: "Mika", initials: "M", hue: 145, online: true },
      { id: "5", name: "johan.wav", initials: "J", hue: 38, online: false },
    ],
    shared: [
      {
        id: "s1",
        title: "Vocal idea",
        meta: "Vocal · 92 BPM · A minor",
        duration: "0:18",
        waveVariant: "amber",
        waveSeed: 11,
      },
      {
        id: "s2",
        title: "Piano sketch",
        meta: "Piano · 88 BPM · C major",
        duration: "0:24",
        waveVariant: "lavender",
        waveSeed: 12,
      },
      {
        id: "s3",
        title: "Ambient pad",
        meta: "Synth · 72 BPM · Dm",
        duration: "0:31",
        waveVariant: "sage",
        waveSeed: 13,
      },
    ],
  },
};

export function getDefaultConversationId(): string {
  return DEMO_CONVERSATIONS.find((c) => c.isActive)?.id ?? DEMO_CONVERSATIONS[0].id;
}

export function filterConversations(
  list: DemoConversation[],
  tab: MessageTab,
  search: string,
): DemoConversation[] {
  let out = list;
  if (tab === "Unread") out = out.filter((c) => c.unreadCount > 0);
  if (tab === "Rooms") out = out.filter((c) => c.kind === "room");
  if (tab === "Requests") out = out.filter((c) => c.id.includes("invite"));
  if (search.trim()) {
    const q = search.toLowerCase();
    out = out.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.preview.toLowerCase().includes(q),
    );
  }
  return out;
}

export const WAVE_COLORS = {
  amber: "#d8aa72",
  lavender: "#a89bc4",
  sage: "#8fa88a",
} as const;
