import { useState, useRef, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateHook, getListHooksQueryKey } from "@workspace/api-client-react";

function seededWave(id: number, bars = 48): number[] {
  let s = ((id * 1664525) + 1013904223) >>> 0;
  return Array.from({ length: bars }, () => {
    s = ((s * 1664525) + 1013904223) >>> 0;
    return (s % 65) + 18;
  });
}

function SuccessPanel({ onClose }: { onClose: () => void }) {
  const bars = seededWave((Date.now() % 10000) | 0);
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className="flex flex-col items-center justify-center py-14 px-6 gap-8 text-center"
      style={{ animation: "pageIn 0.5s ease both" }}
    >
      <div className="flex items-end justify-center gap-[3px] h-16 w-full">
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
        <p className="text-[14px] leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
          Your signal is out there.<br />Listening for someone who hears it.
        </p>
      </div>
      <div className="flex items-center gap-2.5">
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

import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, Music, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const VIBES = ["Melancholic", "Euphoric", "Raw", "Dreamy", "Intense", "Nostalgic", "Experimental"];

const LOOKING_FOR_OPTIONS = [
  "Vocals", "Lyrics", "Drums", "Bass", "Guitar", "Keys", "Production", "Strings", "Collaborator",
];

interface DropHookModalProps {
  open: boolean;
  onClose: () => void;
}

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createMutation = useCreateHook({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListHooksQueryKey() });
        setSucceeded(true);
      },
      onError: () => {
        toast({ title: "Something went wrong", description: "Couldn't drop the hook. Try again.", variant: "destructive" });
      },
    },
  });

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setVibe("");
    setLookingFor([]);
    setMaxSeats(3);
    setAudioFile(null);
    setSucceeded(false);
    onClose();
  };

  const toggleLookingFor = (tag: string) => {
    setLookingFor((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith("audio/")) {
      setAudioFile(file);
    }
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

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      {/* Bottom sheet on mobile, centered modal on sm+ */}
      <DialogContent className="drop-hook-sheet sm:max-w-[520px] bg-card border-border/60 p-0 overflow-hidden">
        {/* Gold top accent bar */}
        <div className="h-[2.5px] w-full flex-shrink-0" style={{ background: "linear-gradient(90deg,#e0b050,#c89030)" }} />

        {/* Mobile drag handle */}
        <div className="flex justify-center pt-3 pb-0 sm:hidden flex-shrink-0">
          <div className="w-10 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }} />
        </div>

        {succeeded ? (
          <SuccessPanel onClose={handleClose} />
        ) : (
          <div className="overflow-y-auto" style={{ maxHeight: "calc(94vh - 40px)" }}>
            <div className="px-5 pt-5 pb-2 sm:px-6 sm:pt-6">
              <DialogHeader>
                <DialogTitle className="font-serif text-[1.45rem] sm:text-xl text-foreground">
                  Drop a Hook
                </DialogTitle>
                <DialogDescription
                  className="text-[14px] sm:text-sm leading-relaxed mt-1"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                >
                  A short signal — a riff, a melody, a feeling. Drop it and see who shows up.
                </DialogDescription>
              </DialogHeader>
            </div>

            <form onSubmit={handleSubmit} className="px-5 pb-6 sm:px-6 sm:pb-7 space-y-7 sm:space-y-5">

              {/* ── Audio upload ── */}
              <div className="space-y-3">
                <label className="block text-[15px] sm:text-sm font-semibold sm:font-medium" style={{ color: "rgba(255,255,255,0.85)" }}>
                  Audio snippet <span style={{ color: "#d45a5a" }}>*</span>
                </label>
                {audioFile ? (
                  <div
                    className="flex items-center gap-4 px-4 py-4 rounded-xl"
                    style={{
                      background: "rgba(212,163,65,0.08)",
                      border: "1px solid rgba(212,163,65,0.35)",
                      boxShadow: "0 0 16px rgba(212,163,65,0.08)",
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(212,163,65,0.15)", border: "1px solid rgba(212,163,65,0.3)" }}
                    >
                      <Music className="w-5 h-5" style={{ color: "#d4a341" }} />
                    </div>
                    <span
                      className="text-[14px] font-medium flex-1 truncate"
                      style={{ color: "rgba(255,255,255,0.85)" }}
                    >
                      {audioFile.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => setAudioFile(null)}
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                      style={{
                        background: "rgba(255,255,255,0.07)",
                        color: "rgba(255,255,255,0.5)",
                      }}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    className="relative flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200"
                    style={{
                      padding: "2rem 1.25rem",
                      borderRadius: 16,
                      border: `2px dashed ${dragOver ? "rgba(212,163,65,0.7)" : "rgba(255,255,255,0.22)"}`,
                      background: dragOver ? "rgba(212,163,65,0.06)" : "rgba(255,255,255,0.025)",
                      boxShadow: dragOver ? "0 0 24px rgba(212,163,65,0.12)" : "none",
                    }}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center"
                      style={{
                        background: "rgba(212,163,65,0.1)",
                        border: "1px solid rgba(212,163,65,0.25)",
                      }}
                    >
                      <Upload className="w-6 h-6" style={{ color: "rgba(212,163,65,0.75)" }} />
                    </div>
                    <div className="text-center">
                      <p className="text-[15px] font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>
                        Tap to choose a file
                      </p>
                      <p className="text-[13px] mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
                        or drag &amp; drop here
                      </p>
                    </div>
                    <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.25)" }}>
                      MP3 · WAV · M4A &nbsp;·&nbsp; max 20 MB
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="audio/*"
                      className="hidden"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); }}
                    />
                  </div>
                )}
              </div>

              {/* ── Title ── */}
              <div className="space-y-2.5">
                <label
                  htmlFor="hook-title"
                  className="block text-[15px] sm:text-sm font-semibold sm:font-medium"
                  style={{ color: "rgba(255,255,255,0.85)" }}
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
                  className="w-full rounded-xl outline-none transition-all duration-200 placeholder:text-[rgba(255,255,255,0.25)]"
                  style={{
                    height: 52,
                    padding: "0 16px",
                    fontSize: 16,
                    background: "rgba(255,255,255,0.05)",
                    border: title
                      ? "1.5px solid rgba(212,163,65,0.45)"
                      : "1.5px solid rgba(255,255,255,0.12)",
                    color: "rgba(255,255,255,0.9)",
                    boxShadow: title ? "0 0 0 3px rgba(212,163,65,0.06)" : "none",
                  }}
                />
              </div>

              {/* ── Description ── */}
              <div className="space-y-2.5">
                <label
                  htmlFor="hook-desc"
                  className="block text-[15px] sm:text-sm font-semibold sm:font-medium"
                  style={{ color: "rgba(255,255,255,0.85)" }}
                >
                  What&rsquo;s the vibe?{" "}
                  <span className="text-[13px] font-normal" style={{ color: "rgba(255,255,255,0.3)" }}>
                    optional
                  </span>
                </label>
                <textarea
                  id="hook-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="A loop I can't shake. Sounds like 3am and cathedral reverb..."
                  className="w-full rounded-xl outline-none resize-none transition-all duration-200 placeholder:text-[rgba(255,255,255,0.25)] leading-relaxed"
                  rows={3}
                  style={{
                    padding: "14px 16px",
                    fontSize: 16,
                    background: "rgba(255,255,255,0.05)",
                    border: description
                      ? "1.5px solid rgba(212,163,65,0.45)"
                      : "1.5px solid rgba(255,255,255,0.12)",
                    color: "rgba(255,255,255,0.9)",
                    boxShadow: description ? "0 0 0 3px rgba(212,163,65,0.06)" : "none",
                  }}
                />
              </div>

              {/* ── Emotional vibe ── */}
              <div className="space-y-3">
                <div>
                  <p className="text-[15px] sm:text-sm font-semibold sm:font-medium" style={{ color: "rgba(255,255,255,0.85)" }}>
                    Emotional vibe{" "}
                    <span className="text-[13px] font-normal" style={{ color: "rgba(255,255,255,0.3)" }}>
                      optional
                    </span>
                  </p>
                  <p className="text-[12px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                    Pick one that best describes the feeling
                  </p>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {VIBES.map((v) => {
                    const sel = vibe === v;
                    return (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setVibe(sel ? "" : v)}
                        className="rounded-full transition-all duration-200 active:scale-95"
                        style={{
                          padding: "9px 18px",
                          fontSize: 14,
                          fontWeight: sel ? 600 : 400,
                          ...(sel
                            ? {
                                background: "linear-gradient(135deg,#e0b050,#c89030)",
                                color: "#1a0f00",
                                boxShadow: "0 0 16px rgba(212,163,65,0.35)",
                                border: "1.5px solid transparent",
                              }
                            : {
                                background: "rgba(255,255,255,0.05)",
                                border: "1.5px solid rgba(255,255,255,0.13)",
                                color: "rgba(255,255,255,0.65)",
                              }),
                        }}
                      >
                        {v}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── Looking for ── */}
              <div className="space-y-3">
                <div>
                  <p className="text-[15px] sm:text-sm font-semibold sm:font-medium" style={{ color: "rgba(255,255,255,0.85)" }}>
                    Looking for{" "}
                    <span className="text-[13px] font-normal" style={{ color: "rgba(255,255,255,0.3)" }}>
                      optional
                    </span>
                  </p>
                  <p className="text-[12px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                    What skills do you want to collaborate with?
                  </p>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {LOOKING_FOR_OPTIONS.map((tag) => {
                    const sel = lookingFor.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleLookingFor(tag)}
                        className="rounded-full transition-all duration-200 active:scale-95"
                        style={{
                          padding: "9px 18px",
                          fontSize: 14,
                          fontWeight: sel ? 600 : 400,
                          ...(sel
                            ? {
                                background: "rgba(212,163,65,0.14)",
                                border: "1.5px solid rgba(212,163,65,0.5)",
                                color: "#d4a341",
                                boxShadow: "0 0 14px rgba(212,163,65,0.2)",
                              }
                            : {
                                background: "rgba(255,255,255,0.04)",
                                border: "1.5px solid rgba(255,255,255,0.11)",
                                color: "rgba(255,255,255,0.55)",
                              }),
                        }}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── Room size ── */}
              <div className="space-y-3">
                <div>
                  <p className="text-[15px] sm:text-sm font-semibold sm:font-medium" style={{ color: "rgba(255,255,255,0.85)" }}>
                    Room size
                  </p>
                  <p className="text-[12px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                    How many creators can join?
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[2, 3, 4].map((n) => {
                    const sel = maxSeats === n;
                    return (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setMaxSeats(n)}
                        className="rounded-xl transition-all duration-200 active:scale-95 text-center"
                        style={{
                          padding: "14px 8px",
                          ...(sel
                            ? {
                                background: "rgba(212,163,65,0.12)",
                                border: "1.5px solid rgba(212,163,65,0.45)",
                                color: "#d4a341",
                                boxShadow: "0 0 16px rgba(212,163,65,0.18)",
                              }
                            : {
                                background: "rgba(255,255,255,0.04)",
                                border: "1.5px solid rgba(255,255,255,0.1)",
                                color: "rgba(255,255,255,0.5)",
                              }),
                        }}
                      >
                        <span className="block text-[18px] font-bold">{n}</span>
                        <span className="block text-[11px] mt-0.5" style={{ opacity: 0.7 }}>
                          {n === 1 ? "person" : "people"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── Actions ── */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleClose}
                  className="flex-1 rounded-full h-12 text-[15px]"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!canSubmit}
                  className="flex-1 h-12 rounded-full text-[15px] font-semibold transition-all"
                  style={
                    canSubmit
                      ? {
                          background: "linear-gradient(135deg,#e0b050,#c89030)",
                          color: "#1a0f00",
                          border: "none",
                          boxShadow: "0 4px 20px rgba(212,163,65,0.3)",
                        }
                      : { border: "none" }
                  }
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Drop it"}
                </Button>
              </div>

              {/* Safe area spacing for mobile home indicator */}
              <div className="sm:hidden h-4" />
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
