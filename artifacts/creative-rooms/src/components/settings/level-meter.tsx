import { cn } from "@/lib/utils";
import type { MeterStatus } from "@/lib/settings-demo-data";

const STATUS_CLASS: Record<MeterStatus, string> = {
  Good: "cr-settings-meter-status--good",
  Low: "cr-settings-meter-status--low",
  High: "cr-settings-meter-status--high",
};

interface LevelMeterProps {
  label: string;
  level: number;
  status: MeterStatus;
  animated?: boolean;
}

export function LevelMeter({ label, level, status, animated = true }: LevelMeterProps) {
  const barCount = 28;
  const filled = Math.round(Math.min(1, Math.max(0, level)) * barCount);

  return (
    <div className="cr-settings-meter">
      <div className="cr-settings-meter-head">
        <span className="cr-settings-meter-label">{label}</span>
        <span className={cn("cr-settings-meter-status", STATUS_CLASS[status])}>{status}</span>
      </div>
      <div className="cr-settings-meter-bars" aria-hidden>
        {Array.from({ length: barCount }, (_, i) => {
          const on = i < filled;
          const h = 22 + ((i * 7) % 18);
          return (
            <span
              key={i}
              className={cn(
                "cr-settings-meter-bar",
                on && "cr-settings-meter-bar--on",
                animated && on && "cr-settings-meter-bar--pulse",
              )}
              style={{
                height: on ? `${h}%` : "18%",
                animationDelay: animated && on ? `${i * 45}ms` : undefined,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
