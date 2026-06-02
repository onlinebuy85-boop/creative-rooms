import type { LucideIcon } from "lucide-react";
import {
  Music2,
  Mic2,
  Piano,
  Headphones,
  Sparkles,
} from "lucide-react";
import { DEMO_ROOMS_OVERVIEW } from "@/lib/rooms-demo-data";
import { ALL_DEMO_HOOKS, hookToFeedItem } from "@/lib/hooks-feed-data";
import roomCover1 from "@/assets/images/room-cover-1.png";
import roomCover2 from "@/assets/images/room-cover-2.png";
import heroCover from "@/assets/images/hero.png";

export type ProfileTab = "Overview" | "Hooks" | "Rooms" | "Activity" | "About";

export const PROFILE_TABS: ProfileTab[] = [
  "Overview",
  "Hooks",
  "Rooms",
  "Activity",
  "About",
];

export type ProfileSkill = {
  label: string;
  icon: LucideIcon;
};

export type ProfileCollaborator = {
  name: string;
  initials: string;
  hue: number;
  mutualRooms: number;
};

export type ProfileCurrentProject = {
  title: string;
  subtitle: string;
  active: boolean;
  waveSeed: number;
};

export type DemoProfile = {
  id: string;
  displayName: string;
  username: string;
  badge: string;
  bio: string;
  location: string;
  socialLabel: string;
  socialUrl: string;
  avatarUrl: string;
  coverAmbientUrl: string;
  online: boolean;
  stats: {
    roomsJoined: number;
    hooksCreated: number;
    collaborations: number;
  };
  about: string;
  skills: ProfileSkill[];
  software: ProfileSkill[];
  interests: string[];
  currentProject: ProfileCurrentProject;
  collaborators: ProfileCollaborator[];
  joinedDate: string;
};

export const DEMO_PROFILE: DemoProfile = {
  id: "lina",
  displayName: "Lina",
  username: "lina.wav",
  badge: "Creator",
  bio: "Melodies, late nights and good people.",
  location: "Stockholm, Sweden",
  socialLabel: "linktr.ee/lina.wav",
  socialUrl: "https://linktr.ee/lina.wav",
  avatarUrl: roomCover1,
  coverAmbientUrl: roomCover2,
  online: true,
  stats: {
    roomsJoined: 24,
    hooksCreated: 18,
    collaborations: 37,
  },
  about:
    "Songwriter and topline writer drawn to late-night sessions, warm chords, and rooms where everyone leaves with something unfinished in the best way.",
  skills: [
    { label: "Topline & melodies", icon: Sparkles },
    { label: "Piano", icon: Piano },
    { label: "Vocalist", icon: Mic2 },
  ],
  software: [
    { label: "Logic Pro", icon: Headphones },
    { label: "Ableton Live", icon: Music2 },
  ],
  interests: [
    "Songwriting",
    "Topline",
    "Piano",
    "Vocals",
    "Indie pop",
    "Late night sessions",
    "Collab",
    "Melodic",
  ],
  currentProject: {
    title: "Indie pop project",
    subtitle: "Bridge topline · with Noah & Ella",
    active: true,
    waveSeed: 12,
  },
  collaborators: [
    { name: "Noah", initials: "N", hue: 210, mutualRooms: 8 },
    { name: "Ella", initials: "E", hue: 280, mutualRooms: 6 },
    { name: "Mika", initials: "M", hue: 145, mutualRooms: 5 },
    { name: "Kai", initials: "K", hue: 12, mutualRooms: 4 },
  ],
  joinedDate: "Nov 12, 2023",
};

export const PROFILE_RECENT_ROOMS = DEMO_ROOMS_OVERVIEW.slice(0, 4);

export const PROFILE_RECENT_HOOKS = ALL_DEMO_HOOKS.slice(0, 3).map((hook, i) =>
  hookToFeedItem(hook, i),
);

/** Portrait-style cover fallback */
export const PROFILE_HERO_FALLBACK = heroCover;
