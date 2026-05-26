import { useRef, useState, useCallback } from "react";
import { Loader2, Music2, X } from "lucide-react";

/* ── Decode audio to waveform bars ── */
async function decodeWaveform(file: File): Promise<number[]> {
  try {
    const buf = await file.arrayBuffer();
    const ctx = new AudioContext();
    const audio = await ctx.decodeAudioData(buf);
    await ctx.close();
    const data = audio.getChannelData(0);
    const bars = 60;
    const block = Math.floor(data.length / bars);
    const wave: number[] = [];
    for (let i = 0; i < bars; i++) {
      let sum = 0;
      for (let j = 0; j < block; j++) sum += Math.abs(data[i * block + j]);
      wave.push(sum / block);
    }
    const max = Math.max(...wave, 0.001);
    return wave.map((v) => v / max);
  } catch {
    /* Fallback: random-ish bars so we still show something */
    return Array.from({ length: 60 }, (_, i) =>
      0.3 + 0.6 * Math.abs(Math.sin(i * 0.4 + 0.7) * Math.cos(i * 0.15)),
    );
  }
}

/* ── Upload file to backend ── */
async function uploadAudioFile(file: File, basePath: string): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${basePath}/api/uploads`, {
    method: "POST",
    body: form,
    credentials: "include",
  });
  if (!res.ok) throw new Error("Upload failed");
  const json = await res.json();
  return json.url as string;
}

const AUDIO_MIME = new Set([
  "audio/mpeg", "audio/wav", "audio/x-wav", "audio/mp4",
  "audio/m4a", "audio/ogg", "audio/flac", "audio/aac", "audio/x-aac",
]);
const AUDIO_EXT = new Set(["mp3", "wav", "m4a", "ogg", "flac", "aac"]);

/* ── Types ── */
type Phase =
  | { kind: "idle" }
  | { kind: "over" }
  | { kind: "uploading"; name: string }
  | { kind: "preview"; name: string; url: string; waveform: number[] };

interface Props {
  children: React.ReactNode;
  enabled: boolean;
  /** Return a promise; on resolution the dropzone resets itself */
  onUpload: (fileUrl: string, title: string, description: string) => Promise<void>;
  className?: string;
  /** Optional ref for a hidden <input type="file"> — lets parent trigger file picker */
  fileInputRef?: React.RefObject<HTMLInputElement | null>;
}

/* ── Waveform bar visual ── */
function WaveformBars({ data, height = 36 }: { data: number[]; height?: number }) {
  return (
    <div className="flex items-center gap-[2px] overflow-hidden" style={{ height }}>
      {data.map((v, i) => (
        <div
          key={i}
          className="rounded-full shrink-0"
          style={{
            width: 3,
            height: Math.max(3, v * height),
            background: `rgba(212,163,65,${0.35 + v * 0.65})`,
          }}
        />
      ))}
    </div>
  );
}

/* ── Component ── */
export function DemoDropzone({ children, enabled, onUpload, className, fileInputRef }: Props) {
  const [phase, setPhase] = useState<Phase>({ kind: "idle" });
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const dragCount = useRef(0);
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

  const reset = () => {
    dragCount.current = 0;
    setPhase({ kind: "idle" });
    setTitle("");
    setDesc("");
    setSaving(false);
  };

  /* ── Drag events ── */
  const onDragEnter = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!enabled) return;
      dragCount.current++;
      setPhase((p) => (p.kind === "idle" ? { kind: "over" } : p));
    },
    [enabled],
  );

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragCount.current = Math.max(0, dragCount.current - 1);
    if (dragCount.current === 0) setPhase((p) => (p.kind === "over" ? { kind: "idle" } : p));
  }, []);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const processFile = useCallback(
    async (file: File) => {
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
      if (!AUDIO_MIME.has(file.type) && !AUDIO_EXT.has(ext)) {
        reset();
        return;
      }
      setTitle(file.name.replace(/\.[^/.]+$/, ""));
      setDesc("");
      setPhase({ kind: "uploading", name: file.name });
      try {
        const [url, waveform] = await Promise.all([
          uploadAudioFile(file, basePath),
          decodeWaveform(file),
        ]);
        setPhase({ kind: "preview", name: file.name, url, waveform });
      } catch {
        reset();
      }
    },
    [basePath],
  );

  const onDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      dragCount.current = 0;
      if (!enabled) return;
      const file = e.dataTransfer.files[0];
      if (!file) { reset(); return; }
      await processFile(file);
    },
    [enabled, processFile],
  );

  const handleConfirm = async () => {
    if (phase.kind !== "preview" || !title.trim()) return;
    setSaving(true);
    try {
      await onUpload(phase.url, title.trim(), desc.trim());
      reset();
    } catch {
      setSaving(false);
    }
  };

  const isDimmed = phase.kind !== "idle";

  return (
    <div
      className={`relative ${className ?? "w-full h-full"}`}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {/* Hidden file input for "Browse Files" button in parent */}
      {fileInputRef && (
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*,.mp3,.wav,.m4a,.ogg,.flac,.aac"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file && enabled) await processFile(file);
            if (e.target) e.target.value = "";
          }}
        />
      )}

      {children}

      {/* ── Drag-over overlay ── */}
      {phase.kind === "over" && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center rounded-xl"
          style={{
            background: "rgba(10,8,14,0.88)",
            backdropFilter: "blur(8px)",
            border: "2px dashed rgba(212,163,65,0.45)",
          }}
        >
          <div className="text-center space-y-4 pointer-events-none">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
              style={{
                background: "rgba(212,163,65,0.1)",
                border: "1px solid rgba(212,163,65,0.3)",
                boxShadow: "0 0 30px rgba(212,163,65,0.12)",
              }}
            >
              <Music2 className="w-7 h-7" style={{ color: "#d4a341" }} />
            </div>
            <div>
              <p className="font-serif text-xl text-white/85">Drop your demo here</p>
              <p className="text-sm text-white/38 mt-1.5">mp3 · wav · m4a · flac</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Uploading ── */}
      {phase.kind === "uploading" && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(10,8,14,0.85)", backdropFilter: "blur(8px)" }}
        >
          <div className="text-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin mx-auto" style={{ color: "#d4a341" }} />
            <div>
              <p className="text-white/65 text-[13px] font-medium">{phase.name}</p>
              <p className="text-white/32 text-[11px] mt-1">Uploading & analyzing…</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Preview + confirm ── */}
      {phase.kind === "preview" && (
        <div
          className="absolute inset-0 z-50 flex items-end justify-center pb-8 px-5"
          style={{ background: "rgba(10,8,14,0.75)", backdropFilter: "blur(14px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) reset(); }}
        >
          <div
            className="w-full max-w-lg rounded-3xl p-6 space-y-5"
            style={{
              background: "rgba(18,14,24,0.96)",
              border: "1px solid rgba(255,255,255,0.09)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
              animation: "stepIn 0.32s ease both",
            }}
          >
            {/* Waveform header */}
            <div className="flex items-center gap-3.5">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: "rgba(212,163,65,0.1)",
                  border: "1px solid rgba(212,163,65,0.22)",
                }}
              >
                <Music2 className="w-5 h-5" style={{ color: "#d4a341" }} />
              </div>
              <WaveformBars data={phase.waveform} height={40} />
            </div>

            {/* Inputs */}
            <div className="space-y-2.5">
              <input
                type="text"
                placeholder="Name this demo…"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
                className="w-full h-11 px-4 rounded-2xl text-[13px] outline-none"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.85)",
                }}
                onFocus={(e) => { e.target.style.borderColor = "rgba(212,163,65,0.35)"; }}
                onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; }}
              />
              <textarea
                placeholder="What's the feeling behind this idea? (optional)"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows={2}
                className="w-full px-4 py-3 rounded-2xl text-[13px] outline-none resize-none leading-relaxed"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  color: "rgba(255,255,255,0.62)",
                }}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleConfirm}
                disabled={!title.trim() || saving}
                className="flex-1 h-11 rounded-full font-medium text-[13px] transition-all hover:brightness-110 disabled:opacity-40"
                style={{
                  background: "linear-gradient(135deg,#e0b050,#c89030)",
                  color: "#1a0f00",
                }}
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                ) : (
                  "Share with the room"
                )}
              </button>
              <button
                type="button"
                onClick={reset}
                className="w-11 h-11 rounded-full flex items-center justify-center transition-colors"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  color: "rgba(255,255,255,0.4)",
                }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
