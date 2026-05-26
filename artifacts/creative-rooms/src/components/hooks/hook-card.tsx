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
        onClick={onClick}
        className="group relative w-full cursor-pointer transition-all duration-200 active:scale-[0.99]"
        style={{
          background: selected ? "rgba(212,163,65,0.07)" : "rgba(255,255,255,0.025)",
          border: selected
            ? "1px solid rgba(212,163,65,0.28)"
            : "1px solid rgba(255,255,255,0.07)",
          borderRadius: 14,
          boxShadow: selected ? "0 0 0 1px rgba(212,163,65,0.12), 0 4px 16px rgba(0,0,0,0.2)" : "none",
        }}
        onMouseEnter={(e) => {
          if (!selected) {
            (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)";
          }
        }}
        onMouseLeave={(e) => {
          if (!selected) {
            (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.025)";
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
          }
        }}
      >
        {/* Selected accent bar */}
        {selected && (
          <div
            className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full"
            style={{ background: accent, boxShadow: `0 0 8px ${accent}88` }}
          />
        )}

        <div className="px-4 py-5 sm:py-4">
          {/* Top row: play + waveform + meta */}
          <div className="flex items-center gap-3 mb-3.5">
            {/* Play button — larger on mobile */}
            <button
              onClick={handlePlay}
              className="flex-shrink-0 rounded-full flex items-center justify-center transition-all active:scale-95"
              style={{
                width: 40,
                height: 40,
                background: playing ? `${accent}22` : "rgba(255,255,255,0.08)",
                border: playing ? `1.5px solid ${accent}66` : "1.5px solid rgba(255,255,255,0.14)",
                boxShadow: playing ? `0 0 12px ${accent}44` : "none",
              }}
            >
              {playing ? (
                <Pause className="w-4 h-4" style={{ color: accent }} />
              ) : (
                <Play className="w-4 h-4 ml-0.5" style={{ color: "rgba(255,255,255,0.7)" }} />
              )}
            </button>

            {/* Waveform */}
            <div className="flex-1 flex items-center gap-px h-9 overflow-hidden">
              {bars.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-full"
                  style={{
                    minWidth: 2,
                    height: `${h}%`,
                    background: playing
                      ? `${accent}${i % 3 === 0 ? "bb" : i % 3 === 1 ? "77" : "44"}`
                      : `rgba(255,255,255,${i % 2 === 0 ? "0.18" : "0.09"})`,
                    animation: playing
                      ? `breathe ${1.1 + (i % 6) * 0.2}s ease-in-out infinite`
                      : undefined,
                    animationDelay: playing ? `${i * 0.04}s` : undefined,
                    transition: "background 0.3s ease, height 0.3s ease",
                  }}
                />
              ))}
            </div>

            {/* Duration */}
            <span
              className="flex-shrink-0 text-[12px] tabular-nums"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              {duration}
            </span>

            {/* Creator */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Avatar className="h-7 w-7">
                <AvatarImage src={hook.creatorAvatarUrl ?? undefined} />
                <AvatarFallback
                  className="text-[10px]"
                  style={{ background: `${accent}22`, color: accent }}
                >
                  {hook.creatorName?.charAt(0).toUpperCase() ?? "?"}
                </AvatarFallback>
              </Avatar>
              <div className="text-right hidden sm:block">
                <p className="text-[12px] font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>
                  {hook.creatorName ?? "Anonymous"}
                </p>
                <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.28)" }}>
                  {timeAgo(hook.createdAt)} ago
                </p>
              </div>
            </div>
          </div>

          {/* Title + description */}
          <div className="mb-3.5">
            <div className="flex items-start justify-between gap-3 mb-1">
              <h3
                className="font-semibold text-[15px] leading-snug"
                style={{ color: "rgba(255,255,255,0.92)" }}
              >
                {hook.title}
              </h3>
              {/* Creator name on mobile (hidden on desktop where it's in the top row) */}
              <span
                className="sm:hidden flex-shrink-0 text-[11px] mt-0.5"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                {timeAgo(hook.createdAt)} ago
              </span>
            </div>
            {hook.description && (
              <p
                className="text-[13px] leading-relaxed line-clamp-2"
                style={{ color: "rgba(255,255,255,0.42)" }}
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
                  className="text-[11px] px-2.5 py-1 rounded-full"
                  style={{
                    background: `${accent}15`,
                    color: accent,
                    border: `1px solid ${accent}35`,
                  }}
                >
                  {hook.vibe.toLowerCase()}
                </span>
              )}
              {(hook.lookingFor ?? []).slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] px-2.5 py-1 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.055)",
                    color: "rgba(255,255,255,0.42)",
                    border: "1px solid rgba(255,255,255,0.09)",
                  }}
                >
                  {tag.toLowerCase()}
                </span>
              ))}
            </div>

            {/* Spots + join */}
            <div className="flex items-center gap-2.5 flex-shrink-0">
              <div className="flex items-center gap-1.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                {isFull ? (
                  <Lock className="w-3.5 h-3.5" />
                ) : (
                  <Users className="w-3.5 h-3.5" />
                )}
                <span className="text-[12px]">
                  {isFull ? "full" : `${hook.seatsLeft}/${hook.maxSeats}`}
                </span>
              </div>

              {!isFull && (
                <button
                  onClick={handleJoinClick}
                  className="font-semibold rounded-full transition-all hover:brightness-110 active:scale-95"
                  style={{
                    fontSize: 12,
                    padding: "6px 14px",
                    background: "linear-gradient(135deg,#e0b050,#c89030)",
                    color: "#1a0f00",
                    minHeight: 32,
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
