import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateHook, getListHooksQueryKey } from "@workspace/api-client-react";
import { Loader2, Upload, Music, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

/* ── seeded waveform helper ─────────────────────────────────────────────────── */
function seededWave(id: number, bars = 48): number[] {
  let s = ((id * 1664525) + 1013904223) >>> 0;
  return Array.from({ length: bars }, () => {
    s = ((s * 1664525) + 1013904223) >>> 0;
    return (s % 65) + 18;
  });
}

/* ── Success panel ──────────────────────────────────────────────────────────── */
function SuccessPanel({ onClose }: { onClose: () => void }) {
  const bars = seededWave((Date.now() % 10000) | 0);
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-8 text-center px-8 py-16">
      <div className="flex items-end justify-center gap-[3px] h-16 w-full max-w-[240px]">
        {bars.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-full"
            style={{
              minWidth: 2,
              height: `${h}%`,
              background: `rgba(212,163,65,${0.25 + (i % 3) * 0.25})`,
              animation: `breathe ${1.3 + (i % 5) * 0.28}s ease-in-out infinite`,
              animationDelay: `${i * 0.05}s`,
            }}
          />
        ))}
      </div>
      <div>
        <p className="font-serif text-[1.8rem] mb-2.5" style={{ color: "#d4a341" }}>
          Your hook is live.
        </p>
        <p className="text-[15px] leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
          Your signal is out there.<br />Listening for someone who hears it.
        </p>
      </div>
      <div className="flex items-center gap-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full"
            style={{
              background: "#d4a341",
              animation: "breathe 1.4s ease-in-out infinite",
              animationDelay: `${i * 0.35}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Constants ───────────────────────────────────────────────────────────────── */
const VIBES = ["Melancholic", "Euphoric", "Raw", "Dreamy", "Intense", "Nostalgic", "Experimental"];
const LOOKING_FOR_OPTIONS = [
  "Vocals", "Lyrics", "Drums", "Bass", "Guitar", "Keys", "Production", "Strings", "Collaborator",
];

/* ── Props ─────────────────────────────────────────────────────────────────── */
interface DropHookModalProps {
  open: boolean;
  onClose: () => void;
}

/* ── Main component ─────────────────────────────────────────────────────────── */
export function DropHookModal({ open, onClose }: DropHookModalProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [vibe, setVibe] = useState("");
  const [lookingFor, setLookingFor] = useState<string[]>([]);
  const [maxSeats, setMaxSeats] = useState(3);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [visible, setVisible] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* Lock body scroll when open; animate in/out */
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
      /* Slight delay so the DOM mounts before the animation starts */
      const t = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(t);
    } else {
      setVisible(false);
      const t = setTimeout(() => {
        document.body.style.overflow = "";
        document.body.style.touchAction = "";
      }, 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  const createMutation = useCreateHook({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListHooksQueryKey() });
        setSucceeded(true);
      },
      onError: () => {
        toast({
          title: "Something went wrong",
          description: "Couldn't drop the hook. Try again.",
          variant: "destructive",
        });
      },
    },
  });

  const handleClose = useCallback(() => {
    setTitle("");
    setDescription("");
    setVibe("");
    setLookingFor([]);
    setMaxSeats(3);
    setAudioFile(null);
    setSucceeded(false);
    onClose();
  }, [onClose]);

  const toggleLookingFor = (tag: string) => {
    setLookingFor((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith("audio/")) setAudioFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !audioFile) return;

    setUploading(true);
    let audioUrl = "";
    try {
      const form = new FormData();
      form.append("file", audioFile);
      const res = await fetch("/api/uploads", { method: "POST", body: form });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      audioUrl = `/api${data.url}`;
    } catch {
      toast({ title: "Upload failed", description: "Could not upload the audio file.", variant: "destructive" });
      setUploading(false);
      return;
    }
    setUploading(false);

    createMutation.mutate({
      data: {
        title: title.trim(),
        description: description.trim() || undefined,
        audioUrl,
        vibe: vibe || undefined,
        lookingFor,
        maxSeats,
      },
    });
  };

  const isLoading = uploading || createMutation.isPending;
  const canSubmit = title.trim().length > 0 && audioFile !== null && !isLoading;

  /* Don't mount at all until first open */
  if (!open && !visible) return null;

  return createPortal(
    <div
      aria-modal="true"
      role="dialog"
      style={{
        /* Full viewport lock — NO width/height constraints, no transforms */
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        width: "100vw",
        height: "100dvh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        /* Transition opacity of the whole overlay */
        opacity: visible ? 1 : 0,
        transition: "opacity 0.25s ease",
        pointerEvents: open ? "auto" : "none",
      }}
    >
      {/* ── Backdrop ── */}
      <div
        onClick={handleClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.72)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
        }}
      />

      {/* ── Sheet panel — true mobile-native bottom sheet ── */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          /* Mobile: full-width, max 94dvh tall, rounded top corners */
          width: "100%",
          maxHeight: "94dvh",
          /* Desktop: centered modal */
          maxWidth: "min(520px, 100vw)",
          display: "flex",
          flexDirection: "column",
          background: "hsl(270 16% 8%)",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "20px 20px 0 0",
          overflow: "hidden",
          /* Slide in from bottom */
          transform: visible ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.32s cubic-bezier(0.32,0.72,0,1)",
          /* Ensure no horizontal overflow bleeds out */
          boxSizing: "border-box",
        }}
      >
        {/* Gold accent line */}
        <div style={{ height: 2.5, background: "linear-gradient(90deg,#e0b050,#c89030)", flexShrink: 0 }} />

        {/* Drag handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 4px", flexShrink: 0 }}>
          <div style={{ width: 36, height: 4, borderRadius: 99, background: "rgba(255,255,255,0.18)" }} />
        </div>

        {/* ── Header bar (sticky) ── */}
        <div style={{
          flexShrink: 0,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          padding: "4px 20px 0",
        }}>
          <div style={{ paddingBottom: 8 }}>
            <h2 style={{ fontFamily: "var(--font-serif, Georgia, serif)", fontSize: "1.45rem", color: "rgba(255,255,255,0.96)", margin: 0, lineHeight: 1.2 }}>
              Drop a Hook
            </h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.42)", margin: "6px 0 0", lineHeight: 1.5 }}>
              A short signal — a riff, a melody, a feeling.
            </p>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close"
            style={{
              flexShrink: 0,
              marginTop: 2,
              width: 36,
              height: 36,
              borderRadius: 99,
              background: "rgba(255,255,255,0.07)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Scrollable content ── */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          WebkitOverflowScrolling: "touch",
          /* Prevent content from ever being wider than viewport */
          width: "100%",
          boxSizing: "border-box",
        }}>
          {succeeded ? (
            <SuccessPanel onClose={handleClose} />
          ) : (
            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 24,
                padding: "16px 20px",
                paddingBottom: "calc(24px + env(safe-area-inset-bottom, 0px))",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              {/* ── Audio upload ── */}
              <section>
                <label style={{ display: "block", fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,0.88)", marginBottom: 10 }}>
                  Audio snippet <span style={{ color: "#d45a5a" }}>*</span>
                </label>

                {audioFile ? (
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "14px 16px",
                    borderRadius: 14,
                    background: "rgba(212,163,65,0.08)",
                    border: "1.5px solid rgba(212,163,65,0.35)",
                    boxShadow: "0 0 20px rgba(212,163,65,0.08)",
                    boxSizing: "border-box",
                    width: "100%",
                  }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 99, flexShrink: 0,
                      background: "rgba(212,163,65,0.14)", border: "1.5px solid rgba(212,163,65,0.3)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Music size={20} color="#d4a341" />
                    </div>
                    <span style={{ flex: 1, fontSize: 14, color: "rgba(255,255,255,0.88)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {audioFile.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => setAudioFile(null)}
                      style={{
                        flexShrink: 0, width: 32, height: 32, borderRadius: 99,
                        background: "rgba(255,255,255,0.07)", border: "none", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "rgba(255,255,255,0.45)",
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 14,
                      padding: "36px 20px",
                      borderRadius: 16,
                      border: `2px dashed ${dragOver ? "rgba(212,163,65,0.8)" : "rgba(255,255,255,0.2)"}`,
                      background: dragOver ? "rgba(212,163,65,0.06)" : "rgba(255,255,255,0.03)",
                      boxShadow: dragOver ? "0 0 28px rgba(212,163,65,0.15)" : "none",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      textAlign: "center",
                      width: "100%",
                      boxSizing: "border-box",
                    }}
                  >
                    <div style={{
                      width: 64, height: 64, borderRadius: 99,
                      background: "rgba(212,163,65,0.1)", border: "1.5px solid rgba(212,163,65,0.25)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Upload size={28} color="rgba(212,163,65,0.8)" />
                    </div>
                    <div>
                      <p style={{ fontSize: 16, fontWeight: 500, color: "rgba(255,255,255,0.75)", margin: 0 }}>
                        Tap to choose a file
                      </p>
                      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", margin: "4px 0 0" }}>
                        or drag &amp; drop here
                      </p>
                    </div>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", margin: 0 }}>
                      MP3 · WAV · M4A &nbsp;·&nbsp; max 20 MB
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="audio/*"
                      style={{ display: "none" }}
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); }}
                    />
                  </div>
                )}
              </section>

              {/* ── Title ── */}
              <section>
                <label
                  htmlFor="hook-title"
                  style={{ display: "block", fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,0.88)", marginBottom: 10 }}
                >
                  Title <span style={{ color: "#d45a5a" }}>*</span>
                </label>
                <input
                  id="hook-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Late night guitar idea..."
                  autoComplete="off"
                  style={{
                    display: "block",
                    width: "100%",
                    height: 52,
                    padding: "0 16px",
                    fontSize: 16,
                    borderRadius: 12,
                    background: "rgba(255,255,255,0.06)",
                    border: title ? "1.5px solid rgba(212,163,65,0.5)" : "1.5px solid rgba(255,255,255,0.14)",
                    color: "rgba(255,255,255,0.9)",
                    outline: "none",
                    boxShadow: title ? "0 0 0 3px rgba(212,163,65,0.08)" : "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                />
              </section>

              {/* ── Description ── */}
              <section>
                <label
                  htmlFor="hook-desc"
                  style={{ display: "block", fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,0.88)", marginBottom: 4 }}
                >
                  What's the vibe?{" "}
                  <span style={{ fontSize: 13, fontWeight: 400, color: "rgba(255,255,255,0.3)" }}>optional</span>
                </label>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", margin: "0 0 10px" }}>
                  Describe the feeling, context, or mood.
                </p>
                <textarea
                  id="hook-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="A loop I can't shake. Sounds like 3am and cathedral reverb..."
                  rows={3}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "14px 16px",
                    fontSize: 16,
                    lineHeight: 1.55,
                    borderRadius: 12,
                    background: "rgba(255,255,255,0.06)",
                    border: description ? "1.5px solid rgba(212,163,65,0.5)" : "1.5px solid rgba(255,255,255,0.14)",
                    color: "rgba(255,255,255,0.9)",
                    outline: "none",
                    resize: "none",
                    boxShadow: description ? "0 0 0 3px rgba(212,163,65,0.08)" : "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                />
              </section>

              {/* ── Emotional vibe ── */}
              <section>
                <p style={{ fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,0.88)", margin: "0 0 4px" }}>
                  Emotional vibe{" "}
                  <span style={{ fontSize: 13, fontWeight: 400, color: "rgba(255,255,255,0.3)" }}>optional</span>
                </p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", margin: "0 0 12px" }}>
                  Pick one that best describes the feeling
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {VIBES.map((v) => {
                    const sel = vibe === v;
                    return (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setVibe(sel ? "" : v)}
                        style={{
                          padding: "10px 18px",
                          fontSize: 14,
                          fontWeight: sel ? 600 : 400,
                          borderRadius: 99,
                          cursor: "pointer",
                          transition: "all 0.18s",
                          ...(sel ? {
                            background: "linear-gradient(135deg,#e0b050,#c89030)",
                            color: "#1a0f00",
                            border: "1.5px solid transparent",
                            boxShadow: "0 0 18px rgba(212,163,65,0.4)",
                          } : {
                            background: "rgba(255,255,255,0.055)",
                            border: "1.5px solid rgba(255,255,255,0.14)",
                            color: "rgba(255,255,255,0.65)",
                          }),
                        }}
                      >
                        {v}
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* ── Looking for ── */}
              <section>
                <p style={{ fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,0.88)", margin: "0 0 4px" }}>
                  Looking for{" "}
                  <span style={{ fontSize: 13, fontWeight: 400, color: "rgba(255,255,255,0.3)" }}>optional</span>
                </p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", margin: "0 0 12px" }}>
                  What skills do you want to collaborate with?
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {LOOKING_FOR_OPTIONS.map((tag) => {
                    const sel = lookingFor.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleLookingFor(tag)}
                        style={{
                          padding: "10px 18px",
                          fontSize: 14,
                          fontWeight: sel ? 600 : 400,
                          borderRadius: 99,
                          cursor: "pointer",
                          transition: "all 0.18s",
                          ...(sel ? {
                            background: "rgba(212,163,65,0.14)",
                            border: "1.5px solid rgba(212,163,65,0.55)",
                            color: "#d4a341",
                            boxShadow: "0 0 16px rgba(212,163,65,0.22)",
                          } : {
                            background: "rgba(255,255,255,0.045)",
                            border: "1.5px solid rgba(255,255,255,0.12)",
                            color: "rgba(255,255,255,0.58)",
                          }),
                        }}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* ── Room size ── */}
              <section>
                <p style={{ fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,0.88)", margin: "0 0 4px" }}>
                  Room size
                </p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", margin: "0 0 12px" }}>
                  How many creators can join?
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                  {[2, 3, 4].map((n) => {
                    const sel = maxSeats === n;
                    return (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setMaxSeats(n)}
                        style={{
                          padding: "14px 8px",
                          borderRadius: 14,
                          cursor: "pointer",
                          textAlign: "center",
                          transition: "all 0.18s",
                          ...(sel ? {
                            background: "rgba(212,163,65,0.12)",
                            border: "1.5px solid rgba(212,163,65,0.5)",
                            boxShadow: "0 0 18px rgba(212,163,65,0.18)",
                          } : {
                            background: "rgba(255,255,255,0.045)",
                            border: "1.5px solid rgba(255,255,255,0.11)",
                          }),
                        }}
                      >
                        <span style={{ display: "block", fontSize: 22, fontWeight: 700, color: sel ? "#d4a341" : "rgba(255,255,255,0.7)" }}>
                          {n}
                        </span>
                        <span style={{ display: "block", fontSize: 11, marginTop: 3, color: sel ? "rgba(212,163,65,0.75)" : "rgba(255,255,255,0.35)" }}>
                          {n === 2 ? "duo" : n === 3 ? "trio" : "quartet"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* ── Actions ── */}
              <div style={{ display: "flex", gap: 12, paddingTop: 4 }}>
                <button
                  type="button"
                  onClick={handleClose}
                  style={{
                    flex: 1,
                    height: 52,
                    borderRadius: 99,
                    background: "rgba(255,255,255,0.06)",
                    border: "1.5px solid rgba(255,255,255,0.12)",
                    color: "rgba(255,255,255,0.5)",
                    fontSize: 15,
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!canSubmit}
                  style={{
                    flex: 2,
                    height: 52,
                    borderRadius: 99,
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: canSubmit ? "pointer" : "default",
                    border: "none",
                    transition: "all 0.15s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    ...(canSubmit ? {
                      background: "linear-gradient(135deg,#e0b050,#c89030)",
                      color: "#1a0f00",
                      boxShadow: "0 4px 24px rgba(212,163,65,0.35)",
                    } : {
                      background: "rgba(255,255,255,0.06)",
                      color: "rgba(255,255,255,0.3)",
                    }),
                  }}
                >
                  {isLoading ? <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} /> : "Drop it"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
