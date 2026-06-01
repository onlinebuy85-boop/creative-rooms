import roomCover1 from "@/assets/images/room-cover-1.png";
import { seedWaveBars } from "@/components/ui/mini-waveform";

export type MockParticipant = {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
  initials: string;
  hue: number;
  isYou?: boolean;
  isRecording?: boolean;
  videoThumb?: string;
  micOn?: boolean;
};

export type MockChatMessage = {
  id: string;
  senderName: string;
  initials: string;
  hue: number;
  content: string;
  time: string;
  system?: boolean;
};

export type MockChannel = {
  id: string;
  label: string;
  instrument: string;
  gain: number;
  fader: number;
  muted: boolean;
  solo: boolean;
  level: number;
  inputActive: boolean;
  isYou?: boolean;
  isRecording?: boolean;
};

export const MOCK_ROOM = {
  id: "demo",
  name: "Late night songwriters",
  isLive: true,
  participantCount: 12,
  genre: "Acoustic",
  vibeLabel: "Room vibe",
  heroImage: roomCover1,
  heroObjectPosition: "52% 38%",
  createdBy: "Lina",
  createdAgo: "2 days ago",
  playback: {
    title: "Acoustic riff in Dm",
    current: "00:24",
    total: "01:24",
    isPlaying: true,
    isRecording: true,
    recordingBy: "You",
    waveBars: seedWaveBars(42, 36),
  },
  track: {
    title: "Acoustic riff in Dm",
    bpm: 85,
    genre: "Acoustic",
    key: "Dm",
    elapsed: "01:24",
    duration: "03:48",
    waveBars: seedWaveBars(7, 48),
  },
  vibeTags: ["Acoustic", "Chill", "Songwriter", "Warm", "Late night"],
  moodTags: ["Late night", "Chill", "Focused"],
};

export const MOCK_PARTICIPANTS: MockParticipant[] = [
  { id: "lina", name: "Lina", role: "Vocals", initials: "L", hue: 32, videoThumb: roomCover1, micOn: true },
  { id: "johan", name: "johan.wav", role: "Guitar", initials: "J", hue: 210, micOn: true },
  { id: "noah", name: "Noah", role: "Piano", initials: "N", hue: 145, micOn: true },
  { id: "you", name: "You", role: "Acoustic", initials: "Y", hue: 28, isYou: true, isRecording: true, micOn: true },
];

export const MOCK_VIDEO_FEEDS = [
  { id: "lina", name: "Lina", initials: "L", hue: 32 },
  { id: "johan", name: "johan.wav", initials: "J", hue: 210 },
  { id: "noah", name: "Noah", initials: "N", hue: 145 },
];

export const MOCK_CHANNELS: MockChannel[] = [
  { id: "ch1", label: "Lina", instrument: "Vocals", gain: 72, fader: 68, muted: false, solo: false, level: 74, inputActive: true },
  { id: "ch2", label: "johan.wav", instrument: "Guitar", gain: 65, fader: 58, muted: false, solo: false, level: 62, inputActive: true },
  { id: "ch3", label: "Noah", instrument: "Piano", gain: 58, fader: 52, muted: false, solo: false, level: 55, inputActive: true },
  { id: "ch4", label: "You", instrument: "Acoustic", gain: 70, fader: 64, muted: false, solo: false, level: 78, inputActive: true, isYou: true, isRecording: true },
];

export const MOCK_CHAT: MockChatMessage[] = [
  { id: "1", senderName: "Lina", initials: "L", hue: 32, content: "Love where the bridge is going — maybe we hold the Dm a beat longer?", time: "22:41" },
  { id: "2", senderName: "johan.wav", initials: "J", hue: 210, content: "Yeah, I'll fingerpick softer under your vocal there.", time: "22:42" },
  { id: "3", senderName: "Noah", initials: "N", hue: 145, content: "Dropped a warm pad underneath. Tell me if it's too much.", time: "22:43" },
  { id: "4", senderName: "Maya", initials: "M", hue: 280, content: "", time: "22:44", system: true },
  { id: "5", senderName: "You", initials: "Y", hue: 28, content: "Recording a scratch hook — vibe check in a sec.", time: "22:45" },
];

export const MOCK_AVATAR_STACK = [
  { initials: "L", hue: 32 },
  { initials: "J", hue: 210 },
  { initials: "N", hue: 145 },
  { initials: "M", hue: 280 },
  { initials: "A", hue: 12 },
];
