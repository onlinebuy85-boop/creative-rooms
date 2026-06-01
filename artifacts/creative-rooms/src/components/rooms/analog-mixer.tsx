import { useState } from "react";
import { ChannelStrip } from "@/components/rooms/channel-strip";
import { TapeRecorder } from "@/components/rooms/tape-recorder";
import { MOCK_CHANNELS } from "@/lib/room-mock-data";
import { cn } from "@/lib/utils";

function MasterKnob({ label, value, on }: { label: string; value: number; on?: boolean }) {
  const deg = -135 + (value / 100) * 270;
  return (
    <div className="cr-master-knob">
      <div className="cr-knob cr-knob--master" style={{ transform: `rotate(${deg}deg)` }}>
        <span className="cr-knob-pointer" />
      </div>
      <span className="cr-knob-label">{label}</span>
      {on != null && (
        <span className={cn("cr-warmth-led", on && "cr-warmth-led--on")}>{on ? "On" : "Off"}</span>
      )}
    </div>
  );
}

function MasterMeter({ level = 68 }: { level?: number }) {
  const segments = 16;
  return (
    <div className="cr-master-meter">
      {Array.from({ length: segments }, (_, i) => {
        const threshold = ((i + 1) / segments) * 100;
        const on = level >= threshold - 6;
        const hot = i >= segments - 4;
        return (
          <span
            key={i}
            className={cn("cr-led-segment cr-led-segment--tall", on && (hot ? "cr-led-segment--hot" : "cr-led-segment--on"))}
          />
        );
      })}
    </div>
  );
}

export function AnalogMixer() {
  const [limiterOn, setLimiterOn] = useState(true);

  return (
    <div className="cr-analog-mixer">
      <div className="cr-analog-mixer-grain" aria-hidden />
      <div className="cr-analog-mixer-inner">
        <div className="cr-mixer-col cr-mixer-col--inputs">
          <p className="cr-mixer-section-label">Inputs</p>
          <div className="cr-channel-row">
            {MOCK_CHANNELS.map((ch) => (
              <ChannelStrip key={ch.id} channel={ch} />
            ))}
          </div>
        </div>

        <div className="cr-mixer-col cr-mixer-col--tape">
          <TapeRecorder />
        </div>

        <div className="cr-mixer-col cr-mixer-col--master">
          <p className="cr-mixer-section-label">Master</p>
          <div className="cr-master-panel">
            <MasterKnob label="Analog warmth" value={72} on />
            <MasterKnob label="Reverb" value={45} />
            <MasterKnob label="Tape" value={58} />
            <MasterMeter level={72} />
            <button
              type="button"
              onClick={() => setLimiterOn((l) => !l)}
              className={cn("cr-limiter-toggle", limiterOn && "cr-limiter-toggle--on")}
            >
              <span className="cr-limiter-thumb" />
              <span>Limiter</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
