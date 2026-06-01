import { Music2, Upload } from "lucide-react";
import { MiniWaveform } from "@/components/ui/mini-waveform";
import { CrPill } from "@/components/ui/cr-pill";
import { MOCK_ROOM } from "@/lib/room-mock-data";

export function RoomTrack() {
  const track = MOCK_ROOM.track;

  return (
    <div className="cr-room-track-card">
      <div className="cr-room-track-left">
        <div className="cr-room-track-icon">
          <Music2 className="w-5 h-5 text-primary" strokeWidth={1.75} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground/90 truncate">{track.title}</p>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span className="text-[11px] text-muted-foreground">{track.bpm} BPM</span>
            <CrPill className="text-[10px] py-0.5">{track.genre}</CrPill>
          </div>
        </div>
      </div>

      <div className="cr-room-track-wave">
        <MiniWaveform bars={track.waveBars} active height="lg" className="w-full justify-center" />
      </div>

      <div className="cr-room-track-right">
        <div className="text-right hidden sm:block">
          <p className="text-[11px] text-muted-foreground tabular-nums">
            {track.elapsed} / {track.duration}
          </p>
          <p className="text-[11px] text-muted-foreground/80 mt-0.5">Key {track.key}</p>
          <p className="text-[11px] text-muted-foreground/80">{track.bpm} BPM</p>
        </div>
        <button type="button" className="cr-room-export-btn">
          <Upload className="w-3.5 h-3.5" />
          Export
        </button>
      </div>
    </div>
  );
}
