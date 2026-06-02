import { useCallback, useEffect, useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { PageShell } from "@/components/layout/page-shell";
import { SettingsMain } from "@/components/settings/settings-main";
import { AudioHealthPanel } from "@/components/settings/audio-health-panel";
import { SettingsQuickActions } from "@/components/settings/quick-actions";
import { HelpPanel } from "@/components/settings/help-panel";
import type { PreferenceState } from "@/components/settings/audio-preferences";
import type { RoomAudioState } from "@/components/settings/room-audio";
import {
  AUDIO_PREFERENCES,
  DEFAULT_AUDIO_STATE,
  ROOM_AUDIO_OPTIONS,
  type MeterStatus,
  type SettingsTab,
} from "@/lib/settings-demo-data";

function levelToStatus(level: number): MeterStatus {
  if (level < 0.35) return "Low";
  if (level > 0.88) return "High";
  return "Good";
}

function buildPreferenceDefaults(): PreferenceState {
  const out: PreferenceState = {};
  for (const p of AUDIO_PREFERENCES) {
    out[p.id] = p.type === "toggle" ? Boolean(p.defaultOn) : (p.defaultSlider ?? 0);
  }
  return out;
}

function buildRoomDefaults(): RoomAudioState {
  const out: RoomAudioState = {};
  for (const o of ROOM_AUDIO_OPTIONS) {
    out[o.id] = o.type === "toggle" ? Boolean(o.defaultOn) : (o.defaultSelect ?? "");
  }
  return out;
}

export function SettingsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<SettingsTab>("Audio");
  const [inputDevice, setInputDevice] = useState(DEFAULT_AUDIO_STATE.inputDevice);
  const [outputDevice, setOutputDevice] = useState(DEFAULT_AUDIO_STATE.outputDevice);
  const [sampleRate, setSampleRate] = useState(DEFAULT_AUDIO_STATE.sampleRate);
  const [bufferSize, setBufferSize] = useState(DEFAULT_AUDIO_STATE.bufferSize);
  const [inputLevel, setInputLevel] = useState(DEFAULT_AUDIO_STATE.inputLevel);
  const [outputLevel, setOutputLevel] = useState(DEFAULT_AUDIO_STATE.outputLevel);
  const [preferences, setPreferences] = useState<PreferenceState>(buildPreferenceDefaults);
  const [roomAudio, setRoomAudio] = useState<RoomAudioState>(buildRoomDefaults);

  useEffect(() => {
    const id = window.setInterval(() => {
      setInputLevel((v) => {
        const jitter = (Math.random() - 0.5) * 0.08;
        return Math.min(0.95, Math.max(0.2, v + jitter));
      });
      setOutputLevel((v) => {
        const jitter = (Math.random() - 0.5) * 0.06;
        return Math.min(0.92, Math.max(0.25, v + jitter));
      });
    }, 420);
    return () => window.clearInterval(id);
  }, []);

  const inputStatus = useMemo(() => levelToStatus(inputLevel), [inputLevel]);
  const outputStatus = useMemo(() => levelToStatus(outputLevel), [outputLevel]);

  const handlePreferenceChange = useCallback((id: string, value: boolean | number) => {
    setPreferences((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleRoomAudioChange = useCallback((id: string, value: boolean | string) => {
    setRoomAudio((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handlePlayTest = useCallback(() => {
    toast({
      title: "Playing test sound",
      description: "You should hear a soft tone through your output device.",
    });
  }, [toast]);

  const handleReset = useCallback(() => {
    setInputDevice(DEFAULT_AUDIO_STATE.inputDevice);
    setOutputDevice(DEFAULT_AUDIO_STATE.outputDevice);
    setSampleRate(DEFAULT_AUDIO_STATE.sampleRate);
    setBufferSize(DEFAULT_AUDIO_STATE.bufferSize);
    setInputLevel(DEFAULT_AUDIO_STATE.inputLevel);
    setOutputLevel(DEFAULT_AUDIO_STATE.outputLevel);
    setPreferences(buildPreferenceDefaults());
    setRoomAudio(buildRoomDefaults());
    toast({ title: "Audio settings reset", description: "Back to balanced defaults." });
  }, [toast]);

  return (
    <PageShell
      className="cr-page--settings"
      rail={
        <>
          <AudioHealthPanel inputStatus={inputStatus} outputStatus={outputStatus} />
          <SettingsQuickActions
            onCalibrate={() =>
              toast({
                title: "Calibration",
                description: "Speak at your normal volume — we'll guide you through levels.",
              })
            }
            onTest={handlePlayTest}
            onReset={handleReset}
          />
          <HelpPanel />
        </>
      }
    >
      <SettingsMain
        activeTab={activeTab}
        onTabChange={setActiveTab}
        inputDevice={inputDevice}
        outputDevice={outputDevice}
        sampleRate={sampleRate}
        bufferSize={bufferSize}
        inputLevel={inputLevel}
        outputLevel={outputLevel}
        inputStatus={inputStatus}
        outputStatus={outputStatus}
        preferences={preferences}
        roomAudio={roomAudio}
        onInputDeviceChange={setInputDevice}
        onOutputDeviceChange={setOutputDevice}
        onSampleRateChange={setSampleRate}
        onBufferSizeChange={setBufferSize}
        onPreferenceChange={handlePreferenceChange}
        onRoomAudioChange={handleRoomAudioChange}
        onPlayTest={handlePlayTest}
      />
    </PageShell>
  );
}
