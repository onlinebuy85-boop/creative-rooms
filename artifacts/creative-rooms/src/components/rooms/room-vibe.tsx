import { CrPill } from "@/components/ui/cr-pill";
import { MOCK_ROOM } from "@/lib/room-mock-data";
import { seedWaveBars } from "@/components/ui/mini-waveform";

const freqBars = seedWaveBars(99, 16);

export function RoomVibe() {
  const room = MOCK_ROOM;

  return (
    <div className="cr-room-vibe-card">
      <div className="flex flex-wrap gap-1.5 mb-3">
        {room.moodTags.map((tag) => (
          <span key={tag} className="text-[10px] text-muted-foreground/90 px-2 py-0.5 rounded-full border border-border/40">
            {tag}
          </span>
        ))}
      </div>

      <div className="cr-room-freq-viz" aria-hidden>
        {freqBars.map((h, i) => (
          <span key={i} style={{ height: `${h * 0.35}%`, opacity: 0.5 + (h / 100) * 0.5 }} />
        ))}
      </div>

      <div className="flex flex-wrap gap-1.5 mt-3">
        {room.vibeTags.map((tag) => (
          <CrPill key={tag} className="text-[11px] cursor-default">
            {tag}
          </CrPill>
        ))}
      </div>

      <p className="text-[10px] text-muted-foreground/70 mt-4 text-center">
        Room created by {room.createdBy} · {room.createdAgo}
      </p>
    </div>
  );
}
