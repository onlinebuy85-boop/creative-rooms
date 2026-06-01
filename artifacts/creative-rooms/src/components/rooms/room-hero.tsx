import { MoreHorizontal, Pause, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CrPill } from "@/components/ui/cr-pill";
import { MiniWaveform } from "@/components/ui/mini-waveform";
import {
  MOCK_ROOM,
  MOCK_AVATAR_STACK,
  MOCK_VIDEO_FEEDS,
} from "@/lib/room-mock-data";
import { cn } from "@/lib/utils";

function ParticipantAvatar({ initials, hue, className }: { initials: string; hue: number; className?: string }) {
  return (
    <Avatar className={cn("border-2 border-background/80", className)}>
      <AvatarFallback
        className="text-[10px] font-medium"
        style={{ background: `hsl(${hue} 32% 28%)`, color: "hsl(30 20% 92%)" }}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}

function VideoTile({ name, initials, hue }: { name: string; initials: string; hue: number }) {
  return (
    <div className="cr-room-video-tile">
      <div
        className="cr-room-video-thumb"
        style={{ background: `linear-gradient(145deg, hsl(${hue} 28% 18%), hsl(${hue} 22% 10%))` }}
      />
      <div className="cr-room-video-overlay" />
      <span className="cr-room-video-name">{name}</span>
      <span className="cr-room-video-mic" aria-hidden />
    </div>
  );
}

export function RoomHero() {
  const room = MOCK_ROOM;

  return (
    <section className="cr-room-hero-section space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h1 className="font-serif text-2xl md:text-[1.75rem] text-foreground/95 tracking-tight">
            {room.name}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="cr-live-badge">
            <span className="cr-live-dot" />
            Live
          </span>
          <CrPill>{room.participantCount} people</CrPill>
          <CrPill className="text-muted-foreground">{room.genre}</CrPill>
          <button type="button" className="cr-room-icon-btn" aria-label="Invite">
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Invite</span>
          </button>
          <button type="button" className="cr-room-icon-btn cr-room-icon-btn--ghost" aria-label="More options">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="cr-room-hero-card">
        <img
          src={room.heroImage}
          alt=""
          className="cr-room-hero-bg"
          style={{ objectPosition: room.heroObjectPosition }}
        />
        <div className="cr-room-hero-scrim" />

        <span className="cr-room-vibe-badge">{room.vibeLabel}</span>

        <div className="cr-room-hero-videos hidden lg:flex">
          {MOCK_VIDEO_FEEDS.map((feed) => (
            <VideoTile key={feed.id} name={feed.name} initials={feed.initials} hue={feed.hue} />
          ))}
          <div className="cr-room-video-more">
            <span>+8 others</span>
          </div>
        </div>

        <div className="cr-room-hero-avatars">
          <div className="flex -space-x-2">
            {MOCK_AVATAR_STACK.map((a, i) => (
              <ParticipantAvatar key={i} initials={a.initials} hue={a.hue} className="w-8 h-8" />
            ))}
          </div>
        </div>

        <div className="cr-room-playback-glass">
          <button type="button" className="cr-room-play-btn" aria-label="Pause">
            <Pause className="w-4 h-4 fill-current" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground/90 truncate">{room.playback.title}</p>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-[11px] text-muted-foreground tabular-nums">
                {room.playback.current} / {room.playback.total}
              </span>
              <MiniWaveform
                bars={room.playback.waveBars}
                active={room.playback.isPlaying}
                height="sm"
                className="flex-1 max-w-[180px]"
              />
            </div>
          </div>
          {room.playback.isRecording && (
            <div className="cr-recording-pill shrink-0">
              <span className="cr-recording-dot" />
              Recording
              <span className="cr-recording-you">{room.playback.recordingBy}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 lg:hidden">
        {MOCK_VIDEO_FEEDS.map((p) => (
          <VideoTile key={p.id} name={p.name} initials={p.initials} hue={p.hue} />
        ))}
      </div>
    </section>
  );
}
