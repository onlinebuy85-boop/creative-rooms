import { useState, useRef, useCallback } from "react";

export type RecorderState =
  | "idle"
  | "requesting"
  | "recording"
  | "processing"
  | "done"
  | "error";

export interface UseRecorderResult {
  state: RecorderState;
  seconds: number;
  audioBlob: Blob | null;
  localUrl: string | null;
  error: string | null;
  start: () => Promise<void>;
  stop: () => void;
  reset: () => void;
}

/** Best MIME type supported by this browser */
function bestMime(): string {
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/ogg;codecs=opus",
    "audio/mp4",
  ];
  return candidates.find((m) => MediaRecorder.isTypeSupported(m)) ?? "";
}

export function useRecorder(): UseRecorderResult {
  const [state, setState] = useState<RecorderState>("idle");
  const [seconds, setSeconds] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [localUrl, setLocalUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mimeRef = useRef<string>("");

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const stopTracks = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  const start = useCallback(async () => {
    setState("requesting");
    setError(null);

    if (!navigator.mediaDevices?.getUserMedia) {
      setState("error");
      setError("Your browser does not support audio recording.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      streamRef.current = stream;

      const mime = bestMime();
      mimeRef.current = mime;

      const recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        clearTimer();
        stopTracks();

        const effectiveMime = mimeRef.current || "audio/webm";
        const blob = new Blob(chunksRef.current, { type: effectiveMime });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setLocalUrl(url);
        setState("done");
      };

      recorder.onerror = () => {
        clearTimer();
        stopTracks();
        setState("error");
        setError("Recording failed unexpectedly. Please try again.");
      };

      /* Collect data every 250ms for responsive stop */
      recorder.start(250);
      /* IMPORTANT: capture the *actual* mimeType used by the browser (may differ from requested) */
      mimeRef.current = recorder.mimeType || mime;
      setState("recording");
      setSeconds(0);
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch (err: unknown) {
      stopTracks();
      setState("error");
      const name = err instanceof Error ? err.name : "";
      const msg = err instanceof Error ? err.message : String(err);
      if (name === "NotAllowedError" || msg.includes("Permission denied")) {
        setError("Microphone access denied. Tap the lock icon in your browser address bar to allow it.");
      } else if (name === "NotFoundError" || name === "DevicesNotFoundError") {
        setError("No microphone detected. Please connect one and try again.");
      } else if (name === "NotReadableError") {
        setError("Microphone is in use by another app. Close it and try again.");
      } else {
        setError("Could not start recording. Please check your microphone and try again.");
      }
    }
  }, []);

  const stop = useCallback(() => {
    clearTimer();
    const rec = mediaRecorderRef.current;
    if (rec && rec.state !== "inactive") {
      setState("processing");
      rec.stop();
    }
  }, []);

  const reset = useCallback(() => {
    clearTimer();
    const rec = mediaRecorderRef.current;
    if (rec && rec.state !== "inactive") rec.stop();
    stopTracks();
    if (localUrl) URL.revokeObjectURL(localUrl);
    mediaRecorderRef.current = null;
    chunksRef.current = [];
    setState("idle");
    setSeconds(0);
    setAudioBlob(null);
    setLocalUrl(null);
    setError(null);
  }, [localUrl]);

  return { state, seconds, audioBlob, localUrl, error, start, stop, reset };
}
