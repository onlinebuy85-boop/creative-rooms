import type { LucideIcon } from "lucide-react";
import {
  Volume2,
  Smartphone,
  User,
  Bell,
  Palette,
  UserCircle,
  Shield,
} from "lucide-react";

export type SettingsTab =
  | "Audio"
  | "Devices"
  | "Profile"
  | "Notifications"
  | "Appearance"
  | "Account"
  | "Privacy";

export type MeterStatus = "Good" | "Low" | "High";

export const SETTINGS_TABS: { id: SettingsTab; icon: LucideIcon }[] = [
  { id: "Audio", icon: Volume2 },
  { id: "Devices", icon: Smartphone },
  { id: "Profile", icon: User },
  { id: "Notifications", icon: Bell },
  { id: "Appearance", icon: Palette },
  { id: "Account", icon: UserCircle },
  { id: "Privacy", icon: Shield },
];

export const INPUT_DEVICES = [
  "Scarlett Solo USB",
  "MacBook Pro Microphone",
  "AirPods Pro",
  "Built-in Microphone",
] as const;

export const OUTPUT_DEVICES = [
  "Scarlett Solo USB",
  "MacBook Pro Speakers",
  "AirPods Pro",
  "External Headphones",
] as const;

export const SAMPLE_RATES = ["44.1 kHz", "48.0 kHz", "96.0 kHz"] as const;

export const BUFFER_SIZES = [
  "128 samples (2.7 ms)",
  "256 samples (5.3 ms)",
  "512 samples (10.7 ms)",
  "1024 samples (21.3 ms)",
] as const;

export const RECORDING_QUALITIES = [
  "Balanced (recommended)",
  "High quality",
  "Lightweight",
] as const;

export type AudioPreference = {
  id: string;
  title: string;
  description: string;
  type: "toggle" | "slider";
  defaultOn?: boolean;
  defaultSlider?: number;
};

export const AUDIO_PREFERENCES: AudioPreference[] = [
  {
    id: "noise",
    title: "Noise suppression",
    description: "Reduce background noise in your mic.",
    type: "toggle",
    defaultOn: true,
  },
  {
    id: "echo",
    title: "Echo cancellation",
    description: "Remove echo from your mic input.",
    type: "toggle",
    defaultOn: true,
  },
  {
    id: "gain",
    title: "Auto gain",
    description: "Automatically adjust mic volume.",
    type: "toggle",
    defaultOn: false,
  },
  {
    id: "monitor",
    title: "Mic monitoring",
    description: "Hear yourself while speaking or recording.",
    type: "slider",
    defaultSlider: 35,
  },
];

export type RoomAudioOption = {
  id: string;
  title: string;
  description: string;
  type: "toggle" | "select";
  defaultOn?: boolean;
  defaultSelect?: string;
};

export const ROOM_AUDIO_OPTIONS: RoomAudioOption[] = [
  {
    id: "autoJoin",
    title: "Auto join room audio",
    description: "Automatically connect to audio when joining a room.",
    type: "toggle",
    defaultOn: true,
  },
  {
    id: "muteNotif",
    title: "Mute notification sounds",
    description: "Keep the vibe clean while you create.",
    type: "toggle",
    defaultOn: false,
  },
  {
    id: "roomMonitor",
    title: "Enable room monitoring",
    description: "Hear the room mix while you work on your part.",
    type: "toggle",
    defaultOn: true,
  },
  {
    id: "recQuality",
    title: "Default recording quality",
    description: "How rich your takes sound when saved to a room.",
    type: "select",
    defaultSelect: RECORDING_QUALITIES[0],
  },
];

export const QUICK_ACTIONS = [
  {
    id: "calibrate",
    title: "Calibrate input",
    description: "Let us help you set the best levels.",
  },
  {
    id: "test",
    title: "Run audio test",
    description: "Check your setup in under a minute.",
  },
  {
    id: "reset",
    title: "Reset audio settings",
    description: "Return to warm, balanced defaults.",
  },
] as const;

export const HELP_LINKS = [
  {
    id: "troubleshoot",
    title: "Audio troubleshooting guide",
    description: "Step-by-step help articles.",
    href: "/about",
  },
  {
    id: "community",
    title: "Join our community",
    description: "Ask questions and get help.",
    href: "/about",
  },
  {
    id: "support",
    title: "Contact support",
    description: "We're here for you.",
    href: "/about",
  },
] as const;

export const DEFAULT_AUDIO_STATE = {
  inputDevice: INPUT_DEVICES[0],
  outputDevice: OUTPUT_DEVICES[0],
  sampleRate: SAMPLE_RATES[1],
  bufferSize: BUFFER_SIZES[1],
  inputLevel: 0.72,
  outputLevel: 0.68,
  inputStatus: "Good" as MeterStatus,
  outputStatus: "Good" as MeterStatus,
};
