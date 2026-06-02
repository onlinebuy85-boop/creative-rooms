import roomCover1 from "@/assets/images/room-cover-1.png";
import roomCover2 from "@/assets/images/room-cover-2.png";
import heroCover from "@/assets/images/hero.png";

export type NotificationTab =
  | "All"
  | "Room invites"
  | "Mentions"
  | "Replies"
  | "Collab requests"
  | "System";

export type NotificationKind =
  | "room_invite"
  | "reply"
  | "mention"
  | "reaction"
  | "collab_request"
  | "share"
  | "system";

export type NotificationPreview = {
  categoryLabel: string;
  senderName: string;
  senderInitials: string;
  senderHue: number;
  headline: string;
  liveBadge?: boolean;
  heroImage?: string;
  peopleCount?: number;
  memberAvatars: string[];
  extraMembers?: number;
  message?: string;
  primaryCta: { label: string; href: string; icon?: "headphones" | "arrow" };
  secondaryCta?: { label: string; href: string };
  hookMeta?: string;
};

export type DemoNotification = {
  id: string;
  kind: NotificationKind;
  title: string;
  subtitle: string;
  meta?: string;
  timestamp: string;
  unread: boolean;
  senderInitials: string;
  senderHue: number;
  senderAvatar?: string;
  iconKind: NotificationKind;
  previewImage?: string;
  hasWaveform?: boolean;
  waveSeed?: number;
  stackedAvatars?: string[];
  liveInSubtitle?: boolean;
  preview: NotificationPreview;
};

export const NOTIFICATION_TABS: NotificationTab[] = [
  "All",
  "Room invites",
  "Mentions",
  "Replies",
  "Collab requests",
  "System",
];

const ROOM_INVITE_PREVIEW: NotificationPreview = {
  categoryLabel: "Room invite",
  senderName: "Lina",
  senderInitials: "L",
  senderHue: 32,
  headline: "Invited you to join Late night songwriters",
  liveBadge: true,
  heroImage: roomCover1,
  peopleCount: 8,
  memberAvatars: ["L", "N", "E", "M"],
  extraMembers: 3,
  message:
    "We're working on some late night melodies. Join us if you're up for creating. ✨",
  primaryCta: { label: "Join room", href: "/rooms/demo", icon: "headphones" },
  secondaryCta: { label: "View room", href: "/rooms/demo" },
};

export const DEMO_NOTIFICATIONS: DemoNotification[] = [
  {
    id: "n1",
    kind: "room_invite",
    title: "Lina invited you to join a room",
    subtitle: "Late night songwriters",
    liveInSubtitle: true,
    meta: "8 people in the room",
    timestamp: "2m ago",
    unread: true,
    senderInitials: "L",
    senderHue: 32,
    previewImage: roomCover1,
    iconKind: "room_invite",
    preview: ROOM_INVITE_PREVIEW,
  },
  {
    id: "n2",
    kind: "reply",
    title: "Noah replied to your hook",
    subtitle: "Lo-fi loop sketch",
    meta: "Left a voice note",
    timestamp: "18m ago",
    unread: true,
    senderInitials: "N",
    senderHue: 210,
    hasWaveform: true,
    waveSeed: 2,
    iconKind: "reply",
    preview: {
      categoryLabel: "Reply",
      senderName: "Noah",
      senderInitials: "N",
      senderHue: 210,
      headline: "Replied to your hook",
      hookMeta: "Lo-fi loop sketch · 78 BPM · Am",
      heroImage: roomCover2,
      memberAvatars: ["N"],
      message: "This pocket is gorgeous — tried a counter-melody on the bridge.",
      primaryCta: { label: "Open hook", href: "/hooks" },
      secondaryCta: { label: "Reply", href: "/messages" },
    },
  },
  {
    id: "n3",
    kind: "mention",
    title: "Ella mentioned you in Pop hooks",
    subtitle: "@you in the room chat",
    timestamp: "1h ago",
    unread: true,
    senderInitials: "E",
    senderHue: 280,
    iconKind: "mention",
    preview: {
      categoryLabel: "Mention",
      senderName: "Ella",
      senderInitials: "E",
      senderHue: 280,
      headline: "Mentioned you in Pop hooks",
      heroImage: heroCover,
      peopleCount: 6,
      memberAvatars: ["E", "S", "K"],
      message: "@you — your topline idea from yesterday would sit perfectly here.",
      primaryCta: { label: "View room", href: "/rooms/demo" },
      secondaryCta: { label: "Reply", href: "/messages" },
    },
  },
  {
    id: "n4",
    kind: "reaction",
    title: "Mika reacted to your idea",
    subtitle: "🔥 on Late night melody",
    timestamp: "3h ago",
    unread: false,
    senderInitials: "M",
    senderHue: 145,
    iconKind: "reaction",
    preview: {
      categoryLabel: "Reaction",
      senderName: "Mika",
      senderInitials: "M",
      senderHue: 145,
      headline: "Reacted to your hook",
      hookMeta: "Late night melody · Piano",
      memberAvatars: ["M"],
      message: "🔥 — this feels unfinished in the best way.",
      primaryCta: { label: "Open hook", href: "/hooks" },
    },
  },
  {
    id: "n5",
    kind: "collab_request",
    title: "Kai wants to collaborate",
    subtitle: "House loop lab",
    meta: "Looking for a vocalist",
    timestamp: "5h ago",
    unread: true,
    senderInitials: "K",
    senderHue: 12,
    stackedAvatars: ["K", "D"],
    iconKind: "collab_request",
    preview: {
      categoryLabel: "Collab request",
      senderName: "Kai",
      senderInitials: "K",
      senderHue: 12,
      headline: "Wants to collaborate on House loop lab",
      heroImage: roomCover2,
      peopleCount: 7,
      memberAvatars: ["K", "D", "R"],
      message: "Got a four-on-the-floor loop — need a topline or vocal texture.",
      primaryCta: { label: "Join room", href: "/rooms/demo", icon: "headphones" },
      secondaryCta: { label: "Reply", href: "/messages" },
    },
  },
  {
    id: "n6",
    kind: "share",
    title: "johan.wav shared a hook with you",
    subtitle: "Warehouse sub pulse",
    timestamp: "Yesterday",
    unread: false,
    senderInitials: "J",
    senderHue: 38,
    hasWaveform: true,
    waveSeed: 6,
    iconKind: "share",
    preview: {
      categoryLabel: "Share",
      senderName: "johan.wav",
      senderInitials: "J",
      senderHue: 38,
      headline: "Shared a hook with you",
      hookMeta: "Warehouse sub pulse · EDM",
      memberAvatars: ["J"],
      primaryCta: { label: "Open hook", href: "/hooks" },
    },
  },
  {
    id: "n7",
    kind: "system",
    title: "Your room export is ready",
    subtitle: "Acoustic sessions · WAV pack",
    timestamp: "2d ago",
    unread: false,
    senderInitials: "CR",
    senderHue: 32,
    iconKind: "system",
    preview: {
      categoryLabel: "System",
      senderName: "Creative Room",
      senderInitials: "CR",
      senderHue: 32,
      headline: "Your export is ready",
      message: "Download your session stems before they expire in 7 days.",
      memberAvatars: [],
      primaryCta: { label: "Download", href: "/discover" },
    },
  },
];

export function getDefaultNotificationId(): string {
  return DEMO_NOTIFICATIONS.find((n) => n.unread)?.id ?? DEMO_NOTIFICATIONS[0].id;
}

export function tabUnreadCount(tab: NotificationTab, list: DemoNotification[]): number {
  if (tab === "All") return list.filter((n) => n.unread).length;
  if (tab === "Room invites") return list.filter((n) => n.kind === "room_invite" && n.unread).length;
  if (tab === "Mentions") return list.filter((n) => n.kind === "mention" && n.unread).length;
  if (tab === "Replies") return list.filter((n) => n.kind === "reply" && n.unread).length;
  if (tab === "Collab requests")
    return list.filter((n) => n.kind === "collab_request" && n.unread).length;
  if (tab === "System") return list.filter((n) => n.kind === "system" && n.unread).length;
  return 0;
}

export function filterNotifications(
  list: DemoNotification[],
  tab: NotificationTab,
): DemoNotification[] {
  if (tab === "All") return list;
  if (tab === "Room invites") return list.filter((n) => n.kind === "room_invite");
  if (tab === "Mentions") return list.filter((n) => n.kind === "mention");
  if (tab === "Replies") return list.filter((n) => n.kind === "reply");
  if (tab === "Collab requests") return list.filter((n) => n.kind === "collab_request");
  if (tab === "System") return list.filter((n) => n.kind === "system");
  return list;
}
