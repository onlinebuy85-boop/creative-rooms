import { useState, useRef, useEffect, useCallback } from "react";
import { useUser } from "@clerk/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GuestSignupPrompt } from "@/components/guest-prompt";
import { HookManageMenu } from "@/components/hooks/hook-manage-menu";
import type { Hook } from "@workspace/api-client-react";
import { Play, Pause, Users, Lock, Loader2, AlertCircle, RotateCcw } from "lucide-react";

/* ── Module-level singleton — only one audio plays at a time ──────────────── */
type StopFn = () => void;
let globalStop: StopFn | null = null;

/* ── Static waveform seeded by hook id ───────────────────────────────────── */
function seededWave(id: number, bars = 38): number[] {
  let s = ((id * 1664525) + 1013904223) >>> 0;
  return Array.from({ length: bars }, () => {
    s = ((s * 1664525) + 1013904223) >>> 0;
    return (s % 65) + 18;
  });
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

type AudioState = "idle" | "loading" | "playing" | "paused" | "error";

interface HookCardProps {
  hook: Hook;
  selected?: boolean;
  onClick?: () => void;
  onJoinRequest?: () => void;
  currentProfileId?: number;
}

export function HookCard({ hook, selected, onClick, onJoinRequest, currentProfileId }: HookCardProps) {
  const { isSignedIn } = useUser();
  const [audioState, setAudioState] = useState<AudioState>("idle");
  const [audioErrorMsg, setAudioErrorMsg] = useState<string | null>(null);
  const [realDuration, setRealDuration] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [guestReason, setGuestReason] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stopRef = useRef<StopFn | null>(null);

  const bars = seededWave(hook.id);
  const accent = VIBE_COLORS[hook.vibe?.toLowerCase() ?? ""] ?? "#d4a341";
  const isFull = hook.seatsLeft === 0 || !hook.isActive;
  const isOwner = currentProfileId != null && hook.creatorId === currentProfileId;

  /* ── Audio element lifecycle ───────────────────────────────────────────── */
  const getAudio = useCallback((): HTMLAudioElement => {
    if (audioRef.current) return audioRef.current;

    const audio = new Audio();
    audio.preload = "none";

    audio.addEventListener("loadedmetadata", () => {
      const secs = Math.floor(audio.duration);
      if (!isNaN(secs) && isFinite(secs)) {
        setRealDuration(`${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`);
      }
    });

    audio.addEventListener("timeupdate", () => {
      if (audio.duration > 0) setProgress(audio.currentTime / audio.duration);
    });

    audio.addEventListener("ended", () => {
      setAudioState("idle");
      setProgress(0);
      if (globalStop === stopRef.current) globalStop = null;
    });

    audio.addEventListener("error", () => {
      const code = audio.error?.code;
      const msgs: Record<number, string> = {
        1: "Playback stopped.",
        2: "Network error — check connection.",
        3: "Audio could not be decoded.",
        4: "Audio format not supported by this browser.",
      };
      const msg = (code && msgs[code]) || "Could not load audio.";
      console.error("[HookCard] Audio error — code:", code, "| src:", audio.src, "| message:", audio.error?.message);
      setAudioState("error");
      setAudioErrorMsg(msg);
      if (globalStop === stopRef.current) globalStop = null;
    });

    audioRef.current = audio;
    return audio;
  }, []);

  /* ── Stop function (stable ref for singleton tracking) ─────────────────── */
  const stopFn: StopFn = useCallback(() => {
    audioRef.current?.pause();
    setAudioState("paused");
  }, []);

  useEffect(() => {
    stopRef.current = stopFn;
  }, [stopFn]);

  /* ── Cleanup on unmount ─────────────────────────────────────────────────── */
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
      if (globalStop === stopRef.current) globalStop = null;
    };
  }, []);

  /* ── Play / pause handler ───────────────────────────────────────────────── */
  const handlePlay = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const audio = getAudio();

    if (audioState === "playing") {
      audio.pause();
      setAudioState("paused");
      return;
    }

    /* Stop whatever else is playing */
    if (globalStop && globalStop !== stopRef.current) {
      globalStop();
    }

    /* Set src if needed (or if retrying after error) */
    if (!audio.src || audioState === "error") {
      const url = hook.audioUrl;
      console.log("[HookCard] Setting audio src:", url, "| hook:", hook.id, hook.title);
      audio.src = url;
      setAudioErrorMsg(null);
      setProgress(0);
    }

    setAudioState("loading");

    try {
      await audio.play();
      setAudioState("playing");
      globalStop = stopRef.current;
      console.log("[HookCard] Playback started — hook:", hook.id, "| url:", audio.src);
    } catch (err: unknown) {
      console.error("[HookCard] play() rejected:", err, "| src:", audio.src);
      setAudioState("error");
      setAudioErrorMsg(
        err instanceof Error && err.name === "NotAllowedError"
          ? "Tap again to start playback."
          : err instanceof Error
          ? err.message
          : "Playback failed."
      );
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

  /* ── Derived display values ─────────────────────────────────────────────── */
  const isPlaying = audioState === "playing";
  const isLoading = audioState === "loading";
  const hasError = audioState === "error";
  const displayDuration = realDuration ?? "--:--";

  return (
    <>
      <div
        onClick={onClick}
        className="group relative w-full cursor-pointer transition-all duration-200 active:scale-[0.99]"
        style={{
          background: selected
            ? "rgba(212,163,65,0.07)"
            : isPlaying
            ? "rgba(212,163,65,0.04)"
            : "rgba(255,255,255,0.025)",
          border: selected
            ? "1px solid rgba(212,163,65,0.28)"
            : isPlaying
            ? `1px solid ${accent}33`
            : "1px solid rgba(255,255,255,0.07)",
          borderRadius: 14,
          boxShadow: isPlaying
            ? `0 0 20px ${accent}18, 0 4px 16px rgba(0,0,0,0.2)`
            : selected
            ? "0 0 0 1px rgba(212,163,65,0.12), 0 4px 16px rgba(0,0,0,0.2)"
            : "none",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          if (!selected && !isPlaying) {
            (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)";
          }
        }}
        onMouseLeave={(e) => {
          if (!selected && !isPlaying) {
            (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.025)";
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
          }
        }}
      >
        {/* Selected / playing accent bar */}
        {(selected || isPlaying) && (
          <div
            className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full"
            style={{
              background: accent,
              boxShadow: isPlaying ? `0 0 12px ${accent}` : `0 0 8px ${accent}88`,
            }}
          />
        )}

        <div className="px-4 py-5 sm:py-4">
          {/* Top row: play + waveform + meta */}
          <div className="flex items-center gap-3 mb-2.5">
            {/* Play / pause button */}
            <button
              onClick={handlePlay}
              className="flex-shrink-0 rounded-full flex items-center justify-center transition-all active:scale-95"
              style={{
                width: 40,
                height: 40,
                background: isPlaying
                  ? `${accent}22`
                  : hasError
                  ? "rgba(212,74,74,0.12)"
                  : "rgba(255,255,255,0.08)",
                border: isPlaying
                  ? `1.5px solid ${accent}66`
                  : hasError
                  ? "1.5px solid rgba(212,74,74,0.35)"
                  : "1.5px solid rgba(255,255,255,0.14)",
                boxShadow: isPlaying ? `0 0 12px ${accent}44` : "none",
              }}
            >
              {isLoading ? (
                <Loader2
                  className="w-4 h-4 animate-spin"
                  style={{ color: accent }}
                />
              ) : hasError ? (
                <RotateCcw className="w-4 h-4" style={{ color: "rgba(212,100,100,0.8)" }} />
              ) : isPlaying ? (
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
                    background: isPlaying
                      ? `${accent}${i % 3 === 0 ? "bb" : i % 3 === 1 ? "77" : "44"}`
                      : hasError
                      ? `rgba(212,100,100,${i % 2 === 0 ? "0.25" : "0.12"})`
                      : `rgba(255,255,255,${i % 2 === 0 ? "0.18" : "0.09"})`,
                    animation: isPlaying
                      ? `breathe ${1.1 + (i % 6) * 0.2}s ease-in-out infinite`
                      : undefined,
                    animationDelay: isPlaying ? `${i * 0.04}s` : undefined,
                    transition: "background 0.3s ease",
                  }}
                />
              ))}
            </div>

            {/* Duration */}
            <span
              className="flex-shrink-0 text-[12px] tabular-nums"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              {displayDuration}
            </span>

            {/* Creator + manage menu */}
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
              {isOwner && (
                <HookManageMenu
                  hookId={hook.id}
                  hookTitle={hook.title}
                  isActive={hook.isActive}
                />
              )}
            </div>
          </div>

          {/* Progress bar (shows during play) */}
          {(isPlaying || (audioState === "paused" && progress > 0)) && (
            <div
              style={{
                height: 2,
                borderRadius: 99,
                background: "rgba(255,255,255,0.1)",
                marginBottom: 10,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${progress * 100}%`,
                  background: `linear-gradient(90deg, ${accent}, ${accent}99)`,
                  borderRadius: 99,
                  transition: "width 0.25s linear",
                }}
              />
            </div>
          )}

          {/* Error message */}
          {hasError && audioErrorMsg && (
            <div
              className="flex items-center gap-2 mb-2"
              style={{
                padding: "7px 10px",
                borderRadius: 8,
                background: "rgba(212,74,74,0.08)",
                border: "1px solid rgba(212,74,74,0.2)",
              }}
            >
              <AlertCircle size={13} style={{ color: "rgba(212,100,100,0.8)", flexShrink: 0 }} />
              <span className="text-[12px]" style={{ color: "rgba(212,130,130,0.9)" }}>
                {audioErrorMsg} Tap to retry.
              </span>
            </div>
          )}

          {/* Title + description */}
          <div className="mb-3.5">
            <div className="flex items-start justify-between gap-3 mb-1">
              <h3
                className="font-semibold text-[15px] leading-snug"
                style={{ color: "rgba(255,255,255,0.92)" }}
              >
                {hook.title}
              </h3>
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
