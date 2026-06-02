import { Switch } from "@/components/ui/switch";
import { AUDIO_PREFERENCES } from "@/lib/settings-demo-data";
import { cn } from "@/lib/utils";

export type PreferenceState = Record<string, boolean | number>;

interface AudioPreferencesProps {
  values: PreferenceState;
  onChange: (id: string, value: boolean | number) => void;
}

export function AudioPreferences({ values, onChange }: AudioPreferencesProps) {
  return (
    <section className="cr-settings-card">
      <header className="cr-settings-card-header">
        <h2 className="cr-settings-card-title">Audio preferences</h2>
        <p className="cr-settings-card-subtitle">
          Fine-tune how you sound — without digging into studio menus.
        </p>
      </header>

      <ul className="cr-settings-rows">
        {AUDIO_PREFERENCES.map((pref, index) => (
          <li
            key={pref.id}
            className={cn("cr-settings-row", index > 0 && "cr-settings-row--divider")}
          >
            <div className="cr-settings-row-copy">
              <p className="cr-settings-row-title">{pref.title}</p>
              <p className="cr-settings-row-desc">{pref.description}</p>
            </div>
            {pref.type === "toggle" ? (
              <Switch
                className="cr-settings-switch"
                checked={Boolean(values[pref.id])}
                onCheckedChange={(v) => onChange(pref.id, v)}
              />
            ) : (
              <div className="cr-settings-slider-wrap">
                <span className="cr-settings-slider-label">Low</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={Number(values[pref.id] ?? pref.defaultSlider ?? 0)}
                  onChange={(e) => onChange(pref.id, Number(e.target.value))}
                  className="cr-settings-slider"
                />
                <span className="cr-settings-slider-label">High</span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
