import { seedWaveBars, MiniWaveform } from "@/components/ui/mini-waveform";
import { cn } from "@/lib/utils";

export type TrackCategory = "vocal" | "guitar" | "bass" | "drums" | "other";

const TRACK_STYLES: Record<TrackCategory, { label: string; hsl: string; iconBg: string }> = {
  vocal: { label: "Vocals", hsl: "var(--track-vocal)", iconBg: "bg-violet-500/20 text-violet-300" },
  guitar: { label: "Guitar", hsl: "var(--track-guitar)", iconBg: "bg-amber-500/20 text-amber-300" },
  bass: { label: "Bass", hsl: "var(--track-bass)", iconBg: "bg-emerald-500/20 text-emerald-300" },
  drums: { label: "Drums", hsl: "var(--track-drums)", iconBg: "bg-orange-500/20 text-orange-300" },
  other: { label: "Track", hsl: "32 52% 67%", iconBg: "bg-primary/15 text-primary" },
};

export interface DawTrack {
  id: number;
  title: string;
  uploaderName?: string | null;
  category?: TrackCategory;
  commentCount?: number;
}

interface RoomDawTimelineProps {
  tracks: DawTrack[];
  playheadPercent?: number;
  className?: string;
}

const RULER = ["0:00", "0:30", "1:00", "1:30", "2:00", "2:30", "3:00"];

function guessCategory(title: string): TrackCategory {
  const t = title.toLowerCase();
  if (t.includes("vocal") || t.includes("voice")) return "vocal";
  if (t.includes("guitar") || t.includes("acoustic") || t.includes("riff")) return "guitar";
  if (t.includes("bass")) return "bass";
  if (t.includes("drum") || t.includes("beat")) return "drums";
  return "other";
}

export function RoomDawTimeline({ tracks, playheadPercent = 38, className }: RoomDawTimelineProps) {
  if (tracks.length === 0) return null;

  return (
    <div className={cn("cr-room-panel space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
          Timeline
        </h2>
        <span className="text-xs text-muted-foreground/70">DAW view</span>
      </div>

      <div className="cr-timeline-ruler">
        {RULER.map((t) => (
          <span key={t} className="flex-1 text-center first:text-left last:text-right">
            {t}
          </span>
        ))}
      </div>

      <div className="relative">
        <div
          className="absolute top-0 bottom-0 w-px bg-primary z-10 pointer-events-none"
          style={{ left: `${playheadPercent}%` }}
        />
        <div
          className="absolute top-0 bottom-0 w-8 -ml-4 bg-primary/10 z-0 pointer-events-none rounded-full blur-md"
          style={{ left: `${playheadPercent}%` }}
        />

        {tracks.map((track, i) => {
          const cat = track.category ?? guessCategory(track.title);
          const style = TRACK_STYLES[cat];
          const clipLeft = 8 + (i * 11) % 35;
          const clipWidth = 22 + (track.id % 5) * 8;

          return (
            <div key={track.id} className="cr-timeline-lane mb-2">
              <div
                className="cr-timeline-clip"
                style={{
                  left: `${clipLeft}%`,
                  width: `${clipWidth}%`,
                  background: `hsl(${style.hsl} / 0.45)`,
                  border: `1px solid hsl(${style.hsl} / 0.35)`,
                }}
              />
            </div>
          );
        })}
      </div>

      <div className="space-y-2 pt-2 border-t border-border/30">
        {tracks.map((track) => {
          const cat = track.category ?? guessCategory(track.title);
          const style = TRACK_STYLES[cat];
          const bars = seedWaveBars(track.id, 24);

          return (
            <div key={track.id} className="flex items-center gap-3 py-1">
              <span className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0", style.iconBg)}>
                {style.label.charAt(0)}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-foreground/90">{track.title}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {track.uploaderName ?? "Unknown"}
                </p>
              </div>
              <MiniWaveform bars={bars} accent={`hsl(${style.hsl})`} height="sm" />
              {track.commentCount != null && track.commentCount > 0 && (
                <span className="text-xs text-muted-foreground tabular-nums">{track.commentCount}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
