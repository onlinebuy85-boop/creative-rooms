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
      className="flex flex-col items-center justify-center py-10 px-6 gap-7 text-center"
      style={{ animation: "pageIn 0.5s ease both" }}
    >
      {/* Animated waveform */}
      <div className="flex items-end justify-center gap-[3px] h-14 w-full">
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
        <p className="font-serif text-[1.6rem] mb-2" style={{ color: "#d4a341" }}>
          Your hook is live.
        </p>
        <p className="text-[13px] leading-relaxed" style={{ color: "rgba(255,255,255,0.38)" }}>
          Your signal is out there.<br />Listening for someone who hears it.
        </p>
      </div>
      {/* Breathing dots */}
      <div className="flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full"
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, Music, X, CheckSquare, Square } from "lucide-react";
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
      <DialogContent className="sm:max-w-[520px] bg-card border-border/60 p-0 overflow-hidden">
        <div className="h-[2px] w-full" style={{ background: "linear-gradient(90deg,#e0b050,#c89030)" }} />

        {succeeded ? (
          <SuccessPanel onClose={handleClose} />
        ) : (
        <div className="p-6">
          <DialogHeader className="mb-5">
            <DialogTitle className="font-serif text-xl text-foreground">Drop a Hook</DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">
              A short signal — a riff, a melody, a feeling. Drop it and see who shows up.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Audio upload */}
            <div className="space-y-2">
              <Label className="text-sm text-foreground/80">Audio snippet <span className="text-destructive">*</span></Label>
              {audioFile ? (
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-primary/30 bg-primary/5">
                  <Music className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-sm text-foreground flex-1 truncate">{audioFile.name}</span>
                  <button type="button" onClick={() => setAudioFile(null)} className="text-muted-foreground hover:text-foreground">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  className={`relative flex flex-col items-center justify-center gap-2 px-4 py-6 rounded-lg border-2 border-dashed cursor-pointer transition-colors ${
                    dragOver ? "border-primary/60 bg-primary/5" : "border-border/40 hover:border-border/60 hover:bg-muted/30"
                  }`}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-5 h-5 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground text-center">
                    Drop an audio file or <span className="text-primary">click to browse</span>
                  </p>
                  <p className="text-xs text-muted-foreground/60">MP3, WAV, M4A · max 20MB</p>
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

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="hook-title" className="text-sm text-foreground/80">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="hook-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Late night guitar idea..."
                className="bg-input border-border/60 focus:border-primary/50"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="hook-desc" className="text-sm text-foreground/80">What's the vibe? <span className="text-muted-foreground/50 text-xs font-normal">(optional)</span></Label>
              <Textarea
                id="hook-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A loop I can't shake. Sounds like 3am and cathedral reverb..."
                className="bg-input border-border/60 focus:border-primary/50 resize-none h-20 text-sm"
              />
            </div>

            {/* Vibe */}
            <div className="space-y-2">
              <Label className="text-sm text-foreground/80">Emotional vibe <span className="text-muted-foreground/50 text-xs font-normal">(optional)</span></Label>
              <div className="flex flex-wrap gap-2">
                {VIBES.map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setVibe(vibe === v ? "" : v)}
                    className="text-xs px-3 py-1.5 rounded-full transition-all"
                    style={
                      vibe === v
                        ? { background: "linear-gradient(135deg,#e0b050,#c89030)", color: "#1a0f00", fontWeight: 600 }
                        : { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "hsl(30 15% 70%)" }
                    }
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Looking for */}
            <div className="space-y-2">
              <Label className="text-sm text-foreground/80">Looking for <span className="text-muted-foreground/50 text-xs font-normal">(optional)</span></Label>
              <div className="flex flex-wrap gap-2">
                {LOOKING_FOR_OPTIONS.map((tag) => {
                  const sel = lookingFor.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleLookingFor(tag)}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-all"
                      style={
                        sel
                          ? { background: "rgba(212,163,65,0.15)", border: "1px solid rgba(212,163,65,0.4)", color: "#d4a341" }
                          : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "hsl(30 10% 55%)" }
                      }
                    >
                      {sel ? <CheckSquare className="w-3 h-3" /> : <Square className="w-3 h-3" />}
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Max seats */}
            <div className="space-y-2">
              <Label className="text-sm text-foreground/80">Room size</Label>
              <div className="flex gap-2">
                {[2, 3, 4].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setMaxSeats(n)}
                    className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
                    style={
                      maxSeats === n
                        ? { background: "rgba(212,163,65,0.15)", border: "1px solid rgba(212,163,65,0.4)", color: "#d4a341" }
                        : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "hsl(30 10% 55%)" }
                    }
                  >
                    {n} people
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <Button type="button" variant="ghost" onClick={handleClose} className="flex-1">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!canSubmit}
                className="flex-1 font-semibold rounded-full transition-all hover:brightness-110"
                style={{ background: canSubmit ? "linear-gradient(135deg,#e0b050,#c89030)" : undefined, color: canSubmit ? "#1a0f00" : undefined, border: "none" }}
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Drop it"}
              </Button>
            </div>
          </form>
        </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
