import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { useUser } from "@clerk/react";
import { useQueryClient } from "@tanstack/react-query";
import { useJoinHook, getListHooksQueryKey } from "@workspace/api-client-react";
import type { Hook } from "@workspace/api-client-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GuestSignupPrompt } from "@/components/guest-prompt";
import { Loader2, Users, Play, Pause, Lock } from "lucide-react";

function seededWave(id: number, bars = 40): number[] {
  let s = ((id * 1664525) + 1013904223) >>> 0;
  return Array.from({ length: bars }, () => {
    s = ((s * 1664525) + 1013904223) >>> 0;
    return (s % 60) + 20;
  });
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

interface HookCardProps {
  hook: Hook;
}

export function HookCard({ hook }: HookCardProps) {
  const { isSignedIn } = useUser();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [playing, setPlaying] = useState(false);
  const [guestReason, setGuestReason] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const bars = seededWave(hook.id);

  const joinMutation = useJoinHook({
    mutation: {
      onSuccess: (updated) => {
        queryClient.invalidateQueries({ queryKey: getListHooksQueryKey() });
        if (updated.roomId) {
          setLocation(`/rooms/${updated.roomId}`);
        }
      },
    },
  });

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

  const handleJoin = () => {
    if (!isSignedIn) {
      setGuestReason("join this hook");
      return;
    }
    joinMutation.mutate({ id: hook.id });
  };

  const isFull = hook.seatsLeft === 0 || !hook.isActive;
  const seatsLabel = isFull
    ? "Full"
    : hook.seatsLeft === 1
    ? "1 spot left"
    : `${hook.seatsLeft} spots open`;

  const vibeColor: Record<string, string> = {
    melancholic: "#6b8ec4",
    euphoric: "#d4a341",
    raw: "#c47c5a",
    dreamy: "#9b7ec4",
    intense: "#c45a5a",
    nostalgic: "#7ec47e",
    experimental: "#c4b85a",
  };
  const accent = vibeColor[hook.vibe?.toLowerCase() ?? ""] ?? "#d4a341";

  return (
    <>
      <div
        className="relative flex flex-col rounded-xl border border-border/40 bg-card overflow-hidden group transition-all duration-300 hover:border-border/80 hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
        style={{ background: "linear-gradient(160deg, hsl(270 12% 8%) 0%, hsl(270 8% 6%) 100%)" }}
      >
        {/* Color accent bar */}
        <div className="h-[2px] w-full opacity-60" style={{ background: accent }} />

        {/* Waveform area */}
        <div className="relative px-5 pt-5 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePlay}
              className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-105"
              style={{ background: `${accent}22`, border: `1px solid ${accent}44` }}
            >
              {playing ? (
                <Pause className="w-3.5 h-3.5" style={{ color: accent }} />
              ) : (
                <Play className="w-3.5 h-3.5 ml-0.5" style={{ color: accent }} />
              )}
            </button>

            {/* Waveform bars */}
            <div className="flex-1 flex items-center gap-[2px] h-10 overflow-hidden">
              {bars.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-full min-w-[2px] transition-all duration-150"
                  style={{
                    height: `${h}%`,
                    background: playing
                      ? `${accent}${i % 3 === 0 ? "cc" : i % 3 === 1 ? "88" : "44"}`
                      : `${accent}${i % 2 === 0 ? "55" : "33"}`,
                    animationDelay: playing ? `${i * 50}ms` : "0ms",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col px-5 pb-5 gap-3">
          {/* Creator */}
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={hook.creatorAvatarUrl ?? undefined} />
              <AvatarFallback className="text-[10px] bg-muted">
                {hook.creatorName?.charAt(0).toUpperCase() ?? "?"}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">
              {hook.creatorName ?? "Anonymous"} · {timeAgo(hook.createdAt)}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-base leading-snug text-foreground line-clamp-2">
            {hook.title}
          </h3>

          {/* Description */}
          {hook.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {hook.description}
            </p>
          )}

          {/* Vibe + looking for */}
          <div className="flex flex-wrap gap-1.5">
            {hook.vibe && (
              <span
                className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                style={{
                  background: `${accent}18`,
                  color: accent,
                  border: `1px solid ${accent}30`,
                }}
              >
                {hook.vibe}
              </span>
            )}
            {(hook.lookingFor ?? []).slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[11px] px-2 py-0.5 rounded-full text-muted-foreground"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Footer: seats + join */}
          <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/30">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              {isFull ? (
                <Lock className="w-3 h-3" />
              ) : (
                <Users className="w-3 h-3" />
              )}
              <span>{seatsLabel}</span>
            </div>

            {!isFull ? (
              <Button
                size="sm"
                onClick={handleJoin}
                disabled={joinMutation.isPending}
                className="h-7 px-4 text-xs font-semibold rounded-full transition-all hover:brightness-110"
                style={{ background: "linear-gradient(135deg,#e0b050,#c89030)", color: "#1a0f00", border: "none" }}
              >
                {joinMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : "Join"}
              </Button>
            ) : (
              <span className="text-xs text-muted-foreground/50 italic">locked</span>
            )}
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
