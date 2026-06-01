import { cn } from "@/lib/utils";
import type { MockChannel } from "@/lib/room-mock-data";

interface ChannelStripProps {
  channel: MockChannel;
}

function LedMeter({ level }: { level: number }) {
  const segments = 12;
  return (
    <div className="cr-led-meter" aria-hidden>
      {Array.from({ length: segments }, (_, i) => {
        const threshold = ((i + 1) / segments) * 100;
        const on = level >= threshold - 8;
        const hot = i >= segments - 3;
        const warm = i >= segments - 6 && i < segments - 3;
        return (
          <span
            key={i}
            className={cn(
              "cr-led-segment",
              on && (hot ? "cr-led-segment--hot" : warm ? "cr-led-segment--warm" : "cr-led-segment--on"),
            )}
          />
        );
      })}
    </div>
  );
}

function RotaryKnob({ value, label }: { value: number; label: string }) {
  const deg = -135 + (value / 100) * 270;
  return (
    <div className="cr-knob-wrap">
      <div className="cr-knob" style={{ transform: `rotate(${deg}deg)` }}>
        <span className="cr-knob-pointer" />
      </div>
      <span className="cr-knob-label">{label}</span>
    </div>
  );
}

export function ChannelStrip({ channel }: ChannelStripProps) {
  return (
    <div className={cn("cr-channel-strip", channel.isYou && "cr-channel-strip--you")}>
      <div className="cr-channel-header">
        <span className={cn("cr-input-led", channel.inputActive && "cr-input-led--on")} />
        <div className="min-w-0 text-center">
          <p className="cr-channel-name">{channel.label}</p>
          <p className="cr-channel-inst">{channel.instrument}</p>
        </div>
        {channel.isRecording && <span className="cr-channel-rec">REC</span>}
      </div>

      <RotaryKnob value={channel.gain} label="Gain" />

      <div className="cr-channel-buttons">
        <button type="button" className={cn("cr-mixer-btn", channel.solo && "cr-mixer-btn--solo")}>
          S
        </button>
        <button type="button" className={cn("cr-mixer-btn", channel.muted && "cr-mixer-btn--mute")}>
          M
        </button>
      </div>

      <div className="cr-fader-wrap">
        <div className="cr-fader-track">
          <div className="cr-fader-fill" style={{ height: `${channel.fader}%` }} />
          <div className="cr-fader-thumb" style={{ bottom: `${channel.fader}%` }} />
        </div>
      </div>

      <LedMeter level={channel.level} />
    </div>
  );
}
