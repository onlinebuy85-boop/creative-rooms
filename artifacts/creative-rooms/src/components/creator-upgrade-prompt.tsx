import { X, Sparkles } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  reason?: string;
  onActivate: () => void;
  activating?: boolean;
}

const COPY: Record<string, { headline: string; body: string }> = {
  "write in chat": {
    headline: "Speak into the room.",
    body: "Chat is open to creator members. Join the creative space to write, collaborate and be heard.",
  },
  "record audio": {
    headline: "Capture the moment.",
    body: "Recording is for creator members. Step inside the space to start capturing ideas.",
  },
  "share demos": {
    headline: "Share your music.",
    body: "Demo uploads are open to creator members. Join to drop your work into the room.",
  },
  "create a room": {
    headline: "Open your own room.",
    body: "Creator members can open rooms and invite collaborators. It only takes a moment.",
  },
  "drop a hook": {
    headline: "Send a signal into the world.",
    body: "Dropping hooks is for creator members. Join to share your idea and find who hears it.",
  },
  "join a hook": {
    headline: "Answer the call.",
    body: "Joining hooks is for creator members. Step inside to collaborate on this idea.",
  },
};

const DEFAULT = {
  headline: "Join the creative space.",
  body: "Creator membership unlocks chat, recording, uploads, and collaboration. Anyone can listen — creators participate.",
};

export function CreatorUpgradePrompt({ open, onClose, reason = "", onActivate, activating }: Props) {
  if (!open) return null;

  const copy = COPY[reason.toLowerCase()] ?? DEFAULT;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(5,3,10,0.75)", backdropFilter: "blur(16px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[420px] rounded-3xl overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #0f0b1a 0%, #0a0714 100%)",
          border: "1px solid rgba(212,163,65,0.18)",
          boxShadow: "0 40px 80px -8px rgba(0,0,0,0.8), 0 0 0 1px rgba(212,163,65,0.06) inset",
          animation: "promptIn 0.24s cubic-bezier(0.16,1,0.3,1) both",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse, rgba(212,163,65,0.14) 0%, transparent 70%)",
            filter: "blur(24px)",
          }}
        />

        {/* Dismiss */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative px-8 py-11 text-center">
          {/* Icon */}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-7"
            style={{
              background: "rgba(212,163,65,0.08)",
              border: "1px solid rgba(212,163,65,0.22)",
            }}
          >
            <Sparkles className="w-7 h-7" style={{ color: "#d4a341" }} />
          </div>

          <p
            className="text-[10px] font-semibold tracking-[0.22em] uppercase mb-4"
            style={{ color: "rgba(212,163,65,0.5)" }}
          >
            Creator Membership
          </p>

          <h2
            className="font-serif text-[1.55rem] tracking-tight mb-4 leading-tight"
            style={{ color: "rgba(255,255,255,0.92)" }}
          >
            {copy.headline}
          </h2>

          <p
            className="text-[13.5px] leading-relaxed mb-9 max-w-[300px] mx-auto"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            {copy.body}
          </p>

          <button
            type="button"
            onClick={onActivate}
            disabled={activating}
            className="w-full h-13 rounded-2xl text-[14px] font-semibold transition-all hover:brightness-110 hover:scale-[1.02] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              height: 52,
              background: activating
                ? "rgba(212,163,65,0.3)"
                : "linear-gradient(135deg, #e0b050, #c89030)",
              color: "#1a0f00",
              boxShadow: activating ? "none" : "0 0 32px -8px rgba(212,163,65,0.55)",
            }}
          >
            {activating ? "Joining…" : "Become a Creator Member"}
          </button>

          <p
            className="text-[11px] mt-5 leading-relaxed"
            style={{ color: "rgba(255,255,255,0.16)" }}
          >
            Free during early access. No card required.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes promptIn {
          from { opacity: 0; transform: translateY(16px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
