import { useState, useRef } from "react";
import { useUser } from "@clerk/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GuestSignupPrompt } from "@/components/guest-prompt";
import type { Hook } from "@workspace/api-client-react";
import { Play, Pause, Users, Lock } from "lucide-react";

function seededWave(id: number, bars = 38): number[] {
  let s = ((id * 1664525) + 1013904223) >>> 0;
  return Array.from({ length: bars }, () => {
    s = ((s * 1664525) + 1013904223) >>> 0;
    return (s % 65) + 18;
  });
}

function seededDuration(id: number): string {
  let s = ((id * 1664525) + 1013904223) >>> 0;
  s = ((s * 1664525) + 1013904223) >>> 0;
  const total = (s % 45) + 12;
  const m = Math.floor(total / 60);
  const sec = total % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

const VIBE_COLORS: Record<string, string> = {
  melancholic: "#7da0d4",
  euphoric: "#d4a341",
  raw: "#d47a5a",
  dreamy: "#a07ed4",
  intense: "#d45a5a",
  nostalgic: "#7ed4a0",
  experimental: "#d4cc5a",
};

interface HookCardProps {
  hook: Hook;
  selected?: boolean;
  onClick?: () => void;
  onJoinRequest?: () => void;
}

export function HookCard({ hook, selected, onClick, onJoinRequest }: HookCardProps) {
  const { isSignedIn } = useUser();
  const [playing, setPlaying] = useState(false);
  const [guestReason, setGuestReason] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const bars = seededWave(hook.id);
  const duration = seededDuration(hook.id);
  const accent = VIBE_COLORS[hook.vibe?.toLowerCase() ?? ""] ?? "#d4a341";
  const isFull = hook.seatsLeft === 0 || !hook.isActive;

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) {
      audioRef.current = new Audio(hook.audioUrl);
      audioRef.current.onended = () => setPlaying(false);
    }
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setPlaying(true);
    }
  };

  const handleClick = () => {
    onClick?.();
  };

  const handleJoinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isSignedIn) {
      setGuestReason("join this hook");
      return;
    }
    onJoinRequest?.();
  };

  return (
    <>
      <div
        onClick={handleClick}
        className="group relative w-full cursor-pointer transition-all duration-200"
        style={{
          background: selected
            ? "rgba(212,163,65,0.06)"
            : "rgba(255,255,255,0.02)",
          border: selected
            ? "1px solid rgba(212,163,65,0.25)"
            : "1px solid rgba(255,255,255,0.055)",
          borderRadius: 12,
          boxShadow: selected ? "0 0 0 1px rgba(212,163,65,0.12)" : "none",
        }}
        onMouseEnter={(e) => {
          if (!selected) {
            (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)";
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)";
          }
        }}
        onMouseLeave={(e) => {
          if (!selected) {
            (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)";
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.055)";
          }
        }}
      >
        {/* Selected accent bar */}
        {selected && (
          <div
            className="absolute left-0 top-3 bottom-3 w-[2px] rounded-full"
            style={{ background: accent }}
          />
        )}

        <div className="px-4 py-4">
          {/* Top row: waveform + creator */}
          <div className="flex items-center gap-3 mb-3">
            {/* Play button */}
            <button
              onClick={handlePlay}
              className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-105"
              style={{
                background: playing ? `${accent}22` : "rgba(255,255,255,0.07)",
                border: playing ? `1px solid ${accent}55` : "1px solid rgba(255,255,255,0.12)",
              }}
            >
              {playing ? (
                <Pause className="w-3 h-3" style={{ color: accent }} />
              ) : (
                <Play className="w-3 h-3 ml-0.5" style={{ color: "rgba(255,255,255,0.6)" }} />
              )}
            </button>

            {/* Waveform */}
            <div className="flex-1 flex items-center gap-px h-8 overflow-hidden">
              {bars.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-full"
                  style={{
                    minWidth: 2,
                    height: `${h}%`,
                    background: playing
                      ? `${accent}${i % 3 === 0 ? "bb" : i % 3 === 1 ? "77" : "44"}`
                      : `rgba(255,255,255,${i % 2 === 0 ? "0.15" : "0.08"})`,
                  }}
                />
              ))}
            </div>

            {/* Duration */}
            <span
              className="flex-shrink-0 text-[11px] tabular-nums"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              {duration}
            </span>

            {/* Creator avatar + time */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <Avatar className="h-6 w-6">
                <AvatarImage src={hook.creatorAvatarUrl ?? undefined} />
                <AvatarFallback
                  className="text-[9px]"
                  style={{ background: `${accent}22`, color: accent }}
                >
                  {hook.creatorName?.charAt(0).toUpperCase() ?? "?"}
                </AvatarFallback>
              </Avatar>
              <div className="text-right hidden sm:block">
                <p className="text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.65)" }}>
                  {hook.creatorName ?? "Anonymous"}
                </p>
                <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.25)" }}>
                  {timeAgo(hook.createdAt)} ago
                </p>
              </div>
            </div>
          </div>

          {/* Title + description */}
          <div className="mb-2.5">
            <h3
              className="font-medium text-[14px] leading-snug mb-0.5"
              style={{ color: "rgba(255,255,255,0.9)" }}
            >
              {hook.title}
            </h3>
            {hook.description && (
              <p
                className="text-[12px] leading-relaxed line-clamp-1"
                style={{ color: "rgba(255,255,255,0.38)" }}
              >
                {hook.description}
              </p>
            )}
          </div>

          {/* Footer: tags + spots */}
          <div className="flex items-center justify-between gap-3">
            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 min-w-0">
              {hook.vibe && (
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full"
                  style={{
                    background: `${accent}15`,
                    color: accent,
                    border: `1px solid ${accent}30`,
                  }}
                >
                  {hook.vibe.toLowerCase()}
                </span>
              )}
              {(hook.lookingFor ?? []).slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-2 py-0.5 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    color: "rgba(255,255,255,0.35)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {tag.toLowerCase()}
                </span>
              ))}
            </div>

            {/* Spots + join */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="flex items-center gap-1" style={{ color: "rgba(255,255,255,0.3)" }}>
                {isFull ? (
                  <Lock className="w-3 h-3" />
                ) : (
                  <Users className="w-3 h-3" />
                )}
                <span className="text-[11px]">
                  {isFull ? "full" : `${hook.seatsLeft}/${hook.maxSeats}`}
                </span>
              </div>

              {!isFull && (
                <button
                  onClick={handleJoinClick}
                  className="text-[11px] font-semibold px-3 py-1 rounded-full transition-all hover:brightness-110 active:scale-95"
                  style={{
                    background: "linear-gradient(135deg,#e0b050,#c89030)",
                    color: "#1a0f00",
                  }}
                >
                  Join
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <GuestSignupPrompt
        open={guestReason !== null}
        reason={guestReason ?? ""}
        onClose={() => setGuestReason(null)}
      />
    </>
  );
}
