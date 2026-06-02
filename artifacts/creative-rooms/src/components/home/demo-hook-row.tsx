import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MiniWaveform, seedWaveBars } from "@/components/ui/mini-waveform";
import type { Hook } from "@workspace/api-client-react";
import { DEMO_HOOK_ENGAGEMENT } from "@/lib/discover-demo-data";
import { Heart, MessageCircle, MoreHorizontal, Play } from "lucide-react";

const VIBE_COLORS: Record<string, string> = {
  melancholic: "#7d8a96",
  euphoric: "#b89454",
  dreamy: "#8f8499",
  nostalgic: "#788873",
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

/** Discover hook row — matches reference track layout */
export function DemoHookRow({ hook, index }: { hook: Hook; index: number }) {
  const accent = VIBE_COLORS[hook.vibe?.toLowerCase() ?? ""] ?? "var(--cr-amber)";
  const bars = seedWaveBars(hook.id, 64);
  const bpmTag = hook.tags?.find((t) => /bpm/i.test(t));
  const genreTag = hook.tags?.find((t) => !/bpm/i.test(t));
  const engagement = DEMO_HOOK_ENGAGEMENT[hook.id] ?? { likes: 8, comments: 2 };

  return (
    <div className="cr-hook-track" data-index={index}>
      <button
        type="button"
        className="cr-hook-track-play"
        aria-label="Preview unavailable in demo"
        disabled
      >
        <Play className="w-4 h-4 ml-0.5" />
      </button>

      <div className="cr-hook-track-wave">
        <MiniWaveform bars={bars} accent={accent} height="lg" className="w-full" active />
      </div>

      <div className="cr-hook-track-body">
        <p className="cr-hook-track-title">{hook.title}</p>
        <div className="cr-hook-track-tags">
          {genreTag && <span className="cr-hook-track-genre">{genreTag}</span>}
          {bpmTag && <span className="cr-hook-track-bpm">{bpmTag}</span>}
        </div>
      </div>

      <div className="cr-hook-track-user">
        <Avatar className="cr-hook-track-avatar">
          <AvatarFallback
            className="text-[10px] font-semibold rounded-full"
            style={{ background: `${accent}28`, color: accent }}
          >
            {hook.creatorName?.charAt(0).toUpperCase() ?? "?"}
          </AvatarFallback>
        </Avatar>
        <div className="cr-hook-track-user-text">
          <span className="cr-hook-track-user-name">{hook.creatorName}</span>
          <span className="cr-hook-track-user-time">{timeAgo(hook.createdAt)} ago</span>
        </div>
      </div>

      <div className="cr-hook-track-stats">
        <span className="cr-hook-stat">
          <Heart className="w-3.5 h-3.5" />
          {engagement.likes}
        </span>
        <span className="cr-hook-stat">
          <MessageCircle className="w-3.5 h-3.5" />
          {engagement.comments}
        </span>
      </div>

      <button type="button" className="cr-hook-track-more" aria-label="More options" disabled>
        <MoreHorizontal className="w-4 h-4" />
      </button>
    </div>
  );
}
