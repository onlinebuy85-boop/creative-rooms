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
  mimeType: string | null;
  error: string | null;
  start: () => Promise<void>;
  stop: () => void;
  reset: () => void;
}

/** Ordered preference list for recording MIME types.
 *  Safari/iOS supports audio/mp4 only. Chrome/Android uses audio/webm;codecs=opus.
 *  We check isTypeSupported at runtime so we always use what the browser actually supports. */
function bestMime(): string {
  const candidates = [
    "audio/webm;codecs=opus",  // Android Chrome (best quality)
    "audio/webm",              // Chrome desktop fallback
    "audio/mp4",               // Safari / iOS (required)
    "audio/ogg;codecs=opus",   // Firefox
    "audio/ogg",
  ];
  const supported = candidates.filter((m) => {
    try { return MediaRecorder.isTypeSupported(m); } catch { return false; }
  });
  console.log("[useRecorder] Supported MIME types:", supported);
  return supported[0] ?? "";
}

/** Map from a MIME type to a file extension for upload. */
export function mimeToExt(mime: string): string {
  const base = mime.split(";")[0].trim().toLowerCase();
  const map: Record<string, string> = {
    "audio/webm": ".webm",
    "audio/ogg":  ".ogg",
    "audio/mp4":  ".m4a",
    "audio/x-m4a": ".m4a",
    "audio/aac":  ".aac",
    "audio/mpeg": ".mp3",
    "audio/wav":  ".wav",
    "audio/flac": ".flac",
  };
  return map[base] ?? ".webm";
}

export function useRecorder(): UseRecorderResult {
  const [state, setState]     = useState<RecorderState>("idle");
  const [seconds, setSeconds] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [localUrl, setLocalUrl]   = useState<string | null>(null);
  const [mimeType, setMimeType]   = useState<string | null>(null);
  const [error, setError]         = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef        = useRef<MediaStream | null>(null);
  const chunksRef        = useRef<Blob[]>([]);
  const timerRef         = useRef<ReturnType<typeof setInterval> | null>(null);
  const mimeRef          = useRef<string>("");

  const clearTimer = () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  };

  const stopTracks = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  const start = useCallback(async () => {
    setState("requesting");
    setError(null);

    if (!window.MediaRecorder) {
      setState("error");
      setError("Your browser does not support audio recording. Please try Chrome or Safari.");
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setState("error");
      setError("Your browser does not support microphone access.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      streamRef.current = stream;

      const mime = bestMime();
      console.log("[useRecorder] Requesting MIME:", mime || "(browser default)");

      const recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          console.log("[useRecorder] Chunk received:", e.data.size, "bytes, type:", e.data.type);
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        clearTimer();
        stopTracks();

        /* Capture actual MIME used by the browser (may differ from requested) */
        const effectiveMime = mimeRef.current || "audio/webm";
        const chunkCount    = chunksRef.current.length;
        const totalBytes    = chunksRef.current.reduce((s, c) => s + c.size, 0);

        console.log("[useRecorder] Recording stopped.");
        console.log("[useRecorder]  MIME:", effectiveMime);
        console.log("[useRecorder]  Chunks:", chunkCount, "| Total bytes:", totalBytes);

        if (chunkCount === 0 || totalBytes === 0) {
          console.error("[useRecorder] No audio data captured!");
          setState("error");
          setError("No audio data was captured. Check that your microphone is working and try again.");
          return;
        }

        const blob = new Blob(chunksRef.current, { type: effectiveMime });
        const url  = URL.createObjectURL(blob);

        console.log("[useRecorder] Blob created:", blob.size, "bytes,", blob.type);
        console.log("[useRecorder] Object URL:", url);

        setAudioBlob(blob);
        setLocalUrl(url);
        setMimeType(effectiveMime);
        setState("done");
      };

      recorder.onerror = (evt) => {
        console.error("[useRecorder] MediaRecorder error:", evt);
        clearTimer();
        stopTracks();
        setState("error");
        setError("Recording failed unexpectedly. Please try again.");
      };

      recorder.start(250);
      /* Read actual MIME *after* start() — this is what the browser committed to */
      mimeRef.current = recorder.mimeType || mime;
      console.log("[useRecorder] Actual MIME after start:", recorder.mimeType || "(empty — using requested)");

      setState("recording");
      setSeconds(0);
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch (err: unknown) {
      stopTracks();
      setState("error");
      const name = err instanceof Error ? err.name  : "";
      const msg  = err instanceof Error ? err.message : String(err);
      console.error("[useRecorder] getUserMedia error:", name, msg);
      if (name === "NotAllowedError" || msg.includes("Permission denied")) {
        setError("Microphone access denied. Tap the lock icon in your browser address bar to allow it.");
      } else if (name === "NotFoundError" || name === "DevicesNotFoundError") {
        setError("No microphone detected. Please connect one and try again.");
      } else if (name === "NotReadableError") {
        setError("Microphone is in use by another app. Close it and try again.");
      } else {
        setError(`Could not start recording: ${msg}`);
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
    setMimeType(null);
    setError(null);
  }, [localUrl]);

  return { state, seconds, audioBlob, localUrl, mimeType, error, start, stop, reset };
}
