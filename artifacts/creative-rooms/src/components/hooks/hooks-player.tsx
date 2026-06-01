import { useState } from "react";
import { Play, Pause, SkipBack, SkipForward, Mic } from "lucide-react";
import type { HookFeedItem } from "@/lib/hooks-feed-data";
import { seedWaveBars } from "@/components/ui/mini-waveform";

const WAVE_COLORS: Record<HookFeedItem["waveVariant"], string> = {
  amber: "#d8aa72",
  lavender: "#a89bc4",
  sage: "#8fa88a",
  gold: "#c9a86a",
  rose: "#c49a8a",
};

interface HooksPlayerProps {
  hook: HookFeedItem | null;
}

/** Sticky mini player — unfinished snippet feel, not a streaming bar */
export function HooksPlayer({ hook }: HooksPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const bars = seedWaveBars(hook?.id ?? 1, 72);
  const accent = hook ? WAVE_COLORS[hook.waveVariant] : "#d8aa72";
  const progressIdx = Math.floor(bars.length * 0.35);

  return (
    <div className="cr-hooks-player" role="region" aria-label="Now playing">
      <div className="cr-hooks-player-inner">
        <div className="cr-hooks-player-track">
          {hook?.thumbImage ? (
            <img src={hook.thumbImage} alt="" className="cr-hooks-player-thumb" />
          ) : (
            <div className="cr-hooks-player-thumb cr-hooks-player-thumb--empty" />
          )}
          <div className="cr-hooks-player-meta min-w-0">
            <p className="cr-hooks-player-title truncate">{hook?.title ?? "Select a hook"}</p>
            <p className="cr-hooks-player-artist truncate">
              {hook ? hook.creatorName : "Tap play on any idea"}
            </p>
            {hook?.wipStatus && (
              <p className="cr-hooks-player-wip truncate">{hook.wipStatus}</p>
            )}
          </div>
        </div>

        <div className="cr-hooks-player-progress">
          <span className="cr-hooks-player-time">0:07</span>
          <div className="cr-hooks-player-wave" aria-hidden>
            {bars.map((h, i) => (
              <span
                key={i}
                className="cr-hooks-player-bar"
                style={{
                  height: `${Math.max(20, h * 0.55)}%`,
                  background: accent,
                  opacity: i <= progressIdx ? 0.75 : 0.22,
                }}
              />
            ))}
          </div>
          <span className="cr-hooks-player-time">{hook?.duration ?? "0:00"}</span>
        </div>

        <div className="cr-hooks-player-controls">
          <button type="button" className="cr-hooks-player-ghost" aria-label="Previous">
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="cr-hooks-player-play"
            onClick={() => hook && setPlaying((p) => !p)}
            disabled={!hook}
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>
          <button type="button" className="cr-hooks-player-ghost" aria-label="Next">
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        <button type="button" className="cr-hooks-player-voice" aria-label="Leave voice note">
          <Mic className="w-4 h-4" />
          <span className="hidden sm:inline">Voice note</span>
        </button>
      </div>
    </div>
  );
}
