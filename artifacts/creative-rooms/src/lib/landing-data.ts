import type { LucideIcon } from "lucide-react";
import { AudioWaveform, Users, Music2, Heart, Lamp } from "lucide-react";
import roomCover1 from "@/assets/images/room-cover-1.png";
import roomCover2 from "@/assets/images/room-cover-2.png";
import heroCover from "@/assets/images/hero.png";
import heroBg from "@/assets/images/hero-bg.png";

export const LANDING_HERO_IMAGE = heroBg;

export const WHAT_HAPPENS_CARDS: {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    id: "drop",
    title: "Drop rough ideas",
    description: "Upload voice notes, hooks or unfinished demos.",
    icon: AudioWaveform,
  },
  {
    id: "rooms",
    title: "Sit in rooms",
    description: "Join sessions even if you have nothing finished.",
    icon: Users,
  },
  {
    id: "build",
    title: "Build together",
    description: "Sometimes collaboration starts with one line.",
    icon: Music2,
  },
  {
    id: "pressure",
    title: "No pressure",
    description: "No followers. No algorithms. Just creators.",
    icon: Heart,
  },
  {
    id: "late",
    title: "Late nights",
    description: "The best ideas rarely happen on schedule.",
    icon: Lamp,
  },
];

export const MEMORY_POLAROIDS = [
  {
    id: "m1",
    src: roomCover1,
    alt: "Late night studio",
    rotate: -4,
    offsetX: 0,
    offsetY: 0,
    width: 280,
    z: 2,
  },
  {
    id: "m2",
    src: heroCover,
    alt: "Notebook and lamp",
    rotate: 3,
    offsetX: 120,
    offsetY: 40,
    width: 260,
    z: 3,
  },
  {
    id: "m3",
    src: roomCover2,
    alt: "Piano corner",
    rotate: -2,
    offsetX: -80,
    offsetY: 120,
    width: 300,
    z: 1,
  },
  {
    id: "m4",
    src: heroBg,
    alt: "Creators gathered",
    rotate: 5,
    offsetX: 200,
    offsetY: 100,
    width: 270,
    z: 4,
  },
] as const;

export const MEMORY_VOICE_MEMOS = [
  {
    id: "vm1",
    label: "Voice memo",
    time: "2:17 AM",
    waveSeed: 4,
    rotate: -6,
    top: "8%",
    left: "12%",
  },
  {
    id: "vm2",
    label: "New loop idea",
    time: "8pm 7/8",
    waveSeed: 9,
    rotate: 4,
    top: "42%",
    left: "58%",
  },
] as const;

export const CREATOR_TYPES = [
  "Songwriter",
  "Producer",
  "Vocalist",
  "Instrumentalist",
  "Beat maker",
  "Mixing / mastering",
  "Just vibing",
] as const;
