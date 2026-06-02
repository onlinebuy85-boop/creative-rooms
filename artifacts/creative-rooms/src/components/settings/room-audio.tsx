import { ChevronDown } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { RECORDING_QUALITIES, ROOM_AUDIO_OPTIONS } from "@/lib/settings-demo-data";
import { cn } from "@/lib/utils";

export type RoomAudioState = Record<string, boolean | string>;

interface RoomAudioProps {
  values: RoomAudioState;
  onChange: (id: string, value: boolean | string) => void;
}

export function RoomAudio({ values, onChange }: RoomAudioProps) {
  return (
    <section className="cr-settings-card">
      <header className="cr-settings-card-header">
        <h2 className="cr-settings-card-title">Room audio</h2>
        <p className="cr-settings-card-subtitle">
          How you show up when you join a session with others.
        </p>
      </header>

      <ul className="cr-settings-rows">
        {ROOM_AUDIO_OPTIONS.map((opt, index) => (
          <li
            key={opt.id}
            className={cn("cr-settings-row", index > 0 && "cr-settings-row--divider")}
          >
            <div className="cr-settings-row-copy">
              <p className="cr-settings-row-title">{opt.title}</p>
              <p className="cr-settings-row-desc">{opt.description}</p>
            </div>
            {opt.type === "toggle" ? (
              <Switch
                className="cr-settings-switch"
                checked={Boolean(values[opt.id])}
                onCheckedChange={(v) => onChange(opt.id, v)}
              />
            ) : (
              <div className="cr-settings-select-wrap cr-settings-select-wrap--compact">
                <select
                  className="cr-settings-select"
                  value={String(values[opt.id] ?? opt.defaultSelect)}
                  onChange={(e) => onChange(opt.id, e.target.value)}
                >
                  {RECORDING_QUALITIES.map((q) => (
                    <option key={q} value={q}>
                      {q}
                    </option>
                  ))}
                </select>
                <ChevronDown className="cr-settings-select-chevron w-4 h-4" />
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
