import { Play } from "lucide-react";
import type { AudioMeta } from "@/lib/messages-demo-data";
import { seedWaveBars } from "@/components/ui/mini-waveform";
import { WAVE_COLORS } from "@/lib/messages-demo-data";

interface AudioMessageCardProps {
  audio: AudioMeta;
  incoming?: boolean;
  seed?: number;
}

export function AudioMessageCard({ audio, incoming = true, seed = 1 }: AudioMessageCardProps) {
  const bars = seedWaveBars(seed, 36);
  const accent = WAVE_COLORS[audio.waveVariant];

  const tags = [
    audio.instrument,
    audio.mood,
    audio.bpm != null ? `${audio.bpm} BPM` : null,
    audio.key,
  ].filter(Boolean);

  return (
    <div className={incoming ? "cr-msg-audio cr-msg-audio--in" : "cr-msg-audio cr-msg-audio--out"}>
      <button type="button" className="cr-msg-audio-play" aria-label="Play">
        <Play className="w-4 h-4 ml-0.5" />
      </button>
      <div className="cr-msg-audio-main min-w-0 flex-1">
        <p className="cr-msg-audio-title">{audio.title}</p>
        <div className="cr-msg-audio-wave">
          {bars.map((h, i) => (
            <span
              key={i}
              className="cr-msg-audio-bar"
              style={{
                height: `${Math.max(20, h * 0.65)}%`,
                background: accent,
                opacity: 0.45 + (h / 100) * 0.45,
              }}
            />
          ))}
        </div>
        <div className="cr-msg-audio-meta">
          <span>{audio.duration}</span>
          {tags.map((t) => (
            <span key={t} className="cr-msg-audio-tag">
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
