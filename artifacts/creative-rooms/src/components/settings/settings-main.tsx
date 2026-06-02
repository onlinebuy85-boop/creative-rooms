import { SettingsTabs } from "@/components/settings/settings-tabs";
import { AudioSetupCard } from "@/components/settings/audio-setup-card";
import { AudioPreferences, type PreferenceState } from "@/components/settings/audio-preferences";
import { RoomAudio, type RoomAudioState } from "@/components/settings/room-audio";
import type { MeterStatus, SettingsTab } from "@/lib/settings-demo-data";

interface SettingsMainProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
  inputDevice: string;
  outputDevice: string;
  sampleRate: string;
  bufferSize: string;
  inputLevel: number;
  outputLevel: number;
  inputStatus: MeterStatus;
  outputStatus: MeterStatus;
  preferences: PreferenceState;
  roomAudio: RoomAudioState;
  onInputDeviceChange: (v: string) => void;
  onOutputDeviceChange: (v: string) => void;
  onSampleRateChange: (v: string) => void;
  onBufferSizeChange: (v: string) => void;
  onPreferenceChange: (id: string, value: boolean | number) => void;
  onRoomAudioChange: (id: string, value: boolean | string) => void;
  onPlayTest: () => void;
}

export function SettingsMain({
  activeTab,
  onTabChange,
  inputDevice,
  outputDevice,
  sampleRate,
  bufferSize,
  inputLevel,
  outputLevel,
  inputStatus,
  outputStatus,
  preferences,
  roomAudio,
  onInputDeviceChange,
  onOutputDeviceChange,
  onSampleRateChange,
  onBufferSizeChange,
  onPreferenceChange,
  onRoomAudioChange,
  onPlayTest,
}: SettingsMainProps) {
  return (
    <div className="cr-settings-main">
      <header className="cr-settings-header">
        <h1 className="cr-settings-page-title font-serif">Settings</h1>
        <p className="cr-settings-page-subtitle">
          Customize your experience and keep your creative flow smooth.
        </p>
      </header>

      <SettingsTabs activeTab={activeTab} onTabChange={onTabChange} />

      <div className="cr-settings-content">
        {activeTab === "Audio" ? (
          <>
            <AudioSetupCard
              inputDevice={inputDevice}
              outputDevice={outputDevice}
              sampleRate={sampleRate}
              bufferSize={bufferSize}
              inputLevel={inputLevel}
              outputLevel={outputLevel}
              inputStatus={inputStatus}
              outputStatus={outputStatus}
              onInputDeviceChange={onInputDeviceChange}
              onOutputDeviceChange={onOutputDeviceChange}
              onSampleRateChange={onSampleRateChange}
              onBufferSizeChange={onBufferSizeChange}
              onPlayTest={onPlayTest}
            />
            <AudioPreferences values={preferences} onChange={onPreferenceChange} />
            <RoomAudio values={roomAudio} onChange={onRoomAudioChange} />
          </>
        ) : (
          <section className="cr-settings-card cr-settings-placeholder">
            <p className="cr-settings-placeholder-title">{activeTab} settings</p>
            <p className="cr-settings-placeholder-desc">
              More ways to shape your experience are on the way. For now, tune your audio
              in the Audio tab.
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
