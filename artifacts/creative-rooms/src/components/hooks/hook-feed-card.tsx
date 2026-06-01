import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Play,
  Pause,
  MessageCircle,
  GitBranch,
  Bookmark,
  MoreHorizontal,
  Mic,
  DoorOpen,
  Loader2,
} from "lucide-react";
import type { HookFeedItem } from "@/lib/hooks-feed-data";
import { seedWaveBars } from "@/components/ui/mini-waveform";
import { cn } from "@/lib/utils";

const WAVE_COLORS: Record<HookFeedItem["waveVariant"], { main: string; dim: string; glow: string }> = {
  amber: { main: "#d8aa72", dim: "rgba(216,170,114,0.38)", glow: "rgba(216,170,114,0.14)" },
  lavender: { main: "#a89bc4", dim: "rgba(168,155,196,0.35)", glow: "rgba(168,155,196,0.12)" },
  sage: { main: "#8fa88a", dim: "rgba(143,168,138,0.35)", glow: "rgba(143,168,138,0.12)" },
  gold: { main: "#c9a86a", dim: "rgba(201,168,106,0.35)", glow: "rgba(201,168,106,0.14)" },
  rose: { main: "#c49a8a", dim: "rgba(196,154,138,0.35)", glow: "rgba(196,154,138,0.12)" },
};

type StopFn = () => void;
let globalStop: StopFn | null = null;

interface HookFeedCardProps {
  hook: HookFeedItem;
  onPlay?: (hook: HookFeedItem) => void;
}

export function HookFeedCard({ hook, onPlay }: HookFeedCardProps) {
  const colors = WAVE_COLORS[hook.waveVariant];
  const bars = seedWaveBars(hook.id, 72);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stopRef = useRef<StopFn | null>(null);

  const stopFn: StopFn = useCallback(() => {
    audioRef.current?.pause();
    setPlaying(false);
  }, []);

  useEffect(() => {
    stopRef.current = stopFn;
    return () => {
      audioRef.current?.pause();
      if (globalStop === stopRef.current) globalStop = null;
    };
  }, [stopFn]);

  const handlePlay = async (e: React.MouseEvent) => {
    e.stopPropagation();
    onPlay?.(hook);

    if (playing) {
      audioRef.current?.pause();
      setPlaying(false);
      return;
    }
    if (globalStop && globalStop !== stopRef.current) globalStop();

    if (!hook.audioUrl) {
      setPlaying(true);
      globalStop = stopRef.current;
      setTimeout(() => {
        setPlaying(false);
        if (globalStop === stopRef.current) globalStop = null;
      }, 2400);
      return;
    }

    if (!audioRef.current) audioRef.current = new Audio(hook.audioUrl);
    const audio = audioRef.current;
    setLoading(true);
    try {
      await audio.play();
      setPlaying(true);
      globalStop = stopRef.current;
      audio.onended = () => {
        setPlaying(false);
        if (globalStop === stopRef.current) globalStop = null;
      };
    } catch {
      setPlaying(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <article
      className={cn("cr-hook-feed-card group", playing && "cr-hook-feed-card--playing")}
      style={{ "--hook-wave": colors.main, "--hook-glow": colors.glow } as React.CSSProperties}
    >
      <div className="cr-hook-feed-thumb-wrap">
        <img src={hook.thumbImage} alt="" className="cr-hook-feed-thumb" />
        <button
          type="button"
          onClick={handlePlay}
          className="cr-hook-feed-thumb-play"
          aria-label={playing ? "Pause" : "Play"}
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin text-[#f3e8db]" />
          ) : playing ? (
            <Pause className="w-5 h-5 text-[#f3e8db]" />
          ) : (
            <Play className="w-5 h-5 ml-0.5 text-[#f3e8db]" />
          )}
        </button>
      </div>

      <div className="cr-hook-feed-center-col min-w-0 flex-1">
        <div className="cr-hook-feed-wave">
          {bars.map((h, i) => (
            <span
              key={i}
              className="cr-hook-feed-bar"
              style={{
                height: `${Math.max(22, h * 0.78)}%`,
                background: playing ? colors.main : colors.main,
                opacity: playing ? 0.55 + (h / 100) * 0.45 : 0.42 + (h / 100) * 0.38,
              }}
            />
          ))}
        </div>
        <div className="cr-hook-feed-title-row">
          <h3 className="cr-hook-feed-title truncate">{hook.title}</h3>
          <span className="cr-hook-feed-wip">{hook.wipStatus}</span>
        </div>
        <div className="cr-hook-feed-meta">
          <span className="cr-hook-feed-meta-item cr-hook-feed-meta-item--primary">{hook.creatorName}</span>
          <span className="cr-hook-feed-meta-item">{hook.genre}</span>
          <span className="cr-hook-feed-meta-item">{hook.bpm} BPM</span>
          <span className="cr-hook-feed-meta-item">{hook.key}</span>
        </div>
        <div className="cr-hook-mood-tags">
          {hook.moodTags.slice(0, 3).map((tag) => (
            <span key={tag} className="cr-hook-mood-tag">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="cr-hook-feed-right">
        <div className="cr-hook-feed-right-top">
          <Avatar className="w-8 h-8 shrink-0 border border-white/10">
            <AvatarFallback
              className="text-[10px] font-medium"
              style={{ background: `hsl(${hook.creatorHue} 32% 26%)`, color: "#f3e8db" }}
            >
              {hook.creatorInitials}
            </AvatarFallback>
          </Avatar>
          <div className="cr-hook-feed-right-meta min-w-0">
            <p className="text-[11px] font-medium text-[#f3e8db] truncate max-w-[72px]">{hook.creatorName}</p>
            <p className="text-[10px] text-[#b39b85]">{hook.uploadedAgo}</p>
          </div>
        </div>
        <div className="cr-hook-feed-actions">
          <button type="button" className="cr-hook-action-btn" title="Comments">
            <MessageCircle className="w-4 h-4" />
            <span>{hook.commentCount}</span>
          </button>
          <button type="button" className="cr-hook-action-btn" title="Voice note">
            <Mic className="w-4 h-4" />
          </button>
          <button type="button" className="cr-hook-action-btn" title="Remix">
            <GitBranch className="w-4 h-4" />
          </button>
          <button type="button" className="cr-hook-action-btn" title="Save draft">
            <Bookmark className="w-4 h-4" />
          </button>
          <Link href="/rooms/demo" className="cr-hook-action-btn" title="Join room">
            <DoorOpen className="w-4 h-4" />
          </Link>
          <button type="button" className="cr-hook-action-btn cr-hook-action-btn--icon" aria-label="More">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
