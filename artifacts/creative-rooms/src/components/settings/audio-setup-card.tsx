import { ChevronDown, Headphones, Mic, Play } from "lucide-react";
import {
  BUFFER_SIZES,
  INPUT_DEVICES,
  OUTPUT_DEVICES,
  SAMPLE_RATES,
  type MeterStatus,
} from "@/lib/settings-demo-data";
import { LevelMeter } from "@/components/settings/level-meter";

interface AudioSetupCardProps {
  inputDevice: string;
  outputDevice: string;
  sampleRate: string;
  bufferSize: string;
  inputLevel: number;
  outputLevel: number;
  inputStatus: MeterStatus;
  outputStatus: MeterStatus;
  onInputDeviceChange: (v: string) => void;
  onOutputDeviceChange: (v: string) => void;
  onSampleRateChange: (v: string) => void;
  onBufferSizeChange: (v: string) => void;
  onPlayTest: () => void;
}

function DeviceSelect({
  id,
  label,
  icon: Icon,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="cr-settings-field" htmlFor={id}>
      <span className="cr-settings-field-label">{label}</span>
      <div className="cr-settings-select-wrap">
        <Icon className="cr-settings-select-icon w-4 h-4" strokeWidth={1.75} />
        <select
          id={id}
          className="cr-settings-select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown className="cr-settings-select-chevron w-4 h-4" />
      </div>
    </label>
  );
}

export function AudioSetupCard({
  inputDevice,
  outputDevice,
  sampleRate,
  bufferSize,
  inputLevel,
  outputLevel,
  inputStatus,
  outputStatus,
  onInputDeviceChange,
  onOutputDeviceChange,
  onSampleRateChange,
  onBufferSizeChange,
  onPlayTest,
}: AudioSetupCardProps) {
  return (
    <section className="cr-settings-card">
      <header className="cr-settings-card-header">
        <h2 className="cr-settings-card-title">Audio setup</h2>
        <p className="cr-settings-card-subtitle">
          Set up your audio to collaborate without distractions.
        </p>
      </header>

      <div className="cr-settings-setup-grid">
        <DeviceSelect
          id="input-device"
          label="Input device"
          icon={Mic}
          value={inputDevice}
          options={INPUT_DEVICES}
          onChange={onInputDeviceChange}
        />
        <LevelMeter label="Input level" level={inputLevel} status={inputStatus} />

        <DeviceSelect
          id="output-device"
          label="Output device"
          icon={Headphones}
          value={outputDevice}
          options={OUTPUT_DEVICES}
          onChange={onOutputDeviceChange}
        />
        <LevelMeter label="Output level" level={outputLevel} status={outputStatus} />

        <label className="cr-settings-field" htmlFor="sample-rate">
          <span className="cr-settings-field-label">Sample rate</span>
          <div className="cr-settings-select-wrap cr-settings-select-wrap--plain">
            <select
              id="sample-rate"
              className="cr-settings-select"
              value={sampleRate}
              onChange={(e) => onSampleRateChange(e.target.value)}
            >
              {SAMPLE_RATES.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <ChevronDown className="cr-settings-select-chevron w-4 h-4" />
          </div>
        </label>

        <label className="cr-settings-field" htmlFor="buffer-size">
          <span className="cr-settings-field-label">Buffer size</span>
          <div className="cr-settings-select-wrap cr-settings-select-wrap--plain">
            <select
              id="buffer-size"
              className="cr-settings-select"
              value={bufferSize}
              onChange={(e) => onBufferSizeChange(e.target.value)}
            >
              {BUFFER_SIZES.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <ChevronDown className="cr-settings-select-chevron w-4 h-4" />
          </div>
        </label>
      </div>

      <div className="cr-settings-test-row">
        <span className="cr-settings-field-label">Test your audio</span>
        <button type="button" className="cr-settings-test-btn" onClick={onPlayTest}>
          <Play className="w-4 h-4" />
          Play test sound
        </button>
      </div>
    </section>
  );
}
