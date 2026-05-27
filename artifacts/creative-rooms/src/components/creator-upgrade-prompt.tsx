import { X, Lock, Check } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  reason?: string;
  onActivate: () => void;
  activating?: boolean;
}

const FEATURE_LIST = [
  "Upload hooks",
  "Join live rooms",
  "Chat & collaborate",
  "Create rooms",
];

const COPY: Record<string, { headline: string; body: string }> = {
  "write in chat": {
    headline: "Speak into the room.",
    body: "Share your ideas.\nJoin the room.\nCreate from the heart.",
  },
  "record audio": {
    headline: "Capture the moment.",
    body: "Share your ideas.\nJoin the room.\nCreate from the heart.",
  },
  "share demos": {
    headline: "Share your music.",
    body: "Share your ideas.\nJoin the room.\nCreate from the heart.",
  },
  "create a room": {
    headline: "Open your own room.",
    body: "Share your ideas.\nJoin the room.\nCreate from the heart.",
  },
  "drop a hook": {
    headline: "Send a signal into the world.",
    body: "Share your ideas.\nJoin the room.\nCreate from the heart.",
  },
  "join a hook": {
    headline: "Answer the call.",
    body: "Share your ideas.\nJoin the room.\nCreate from the heart.",
  },
  "join voice": {
    headline: "Step into the space.",
    body: "Share your ideas.\nJoin the room.\nCreate from the heart.",
  },
};

const DEFAULT = {
  headline: "Become a Creator Member",
  body: "Share your ideas.\nJoin the room.\nCreate from the heart.",
};

export function CreatorUpgradePrompt({ open, onClose, reason = "", onActivate, activating }: Props) {
  if (!open) return null;

  const copy = COPY[reason.toLowerCase()] ?? DEFAULT;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(5,3,10,0.82)", backdropFilter: "blur(20px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[360px] rounded-3xl overflow-hidden flex flex-col"
        style={{
          background: "linear-gradient(168deg, #100c1c 0%, #09070e 100%)",
          border: "1px solid rgba(212,163,65,0.15)",
          boxShadow: "0 40px 80px -8px rgba(0,0,0,0.85)",
          animation: "promptIn 0.22s cubic-bezier(0.16,1,0.3,1) both",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient top glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-36 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse, rgba(212,163,65,0.12) 0%, transparent 70%)",
            filter: "blur(20px)",
          }}
        />

        {/* Dismiss */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center transition-colors hover:bg-white/10 z-10"
          style={{ color: "rgba(255,255,255,0.25)" }}
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <div className="relative px-7 pt-9 pb-7">
          {/* Lock icon */}
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{
              background: "rgba(212,163,65,0.08)",
              border: "1px solid rgba(212,163,65,0.18)",
            }}
          >
            <Lock className="w-5 h-5" style={{ color: "rgba(212,163,65,0.7)" }} />
          </div>

          {/* Headline */}
          <h2
            className="font-serif text-center leading-tight mb-4"
            style={{ fontSize: "1.4rem", color: "rgba(255,255,255,0.9)" }}
          >
            {copy.headline}
          </h2>

          {/* Body — line-break aware */}
          <div className="text-center mb-6">
            {copy.body.split("\n").map((line, i) => (
              <p key={i} className="text-[13px] leading-relaxed" style={{ color: "rgba(255,255,255,0.38)" }}>
                {line}
              </p>
            ))}
          </div>

          {/* Feature checklist */}
          <div
            className="rounded-2xl px-5 py-4 mb-6 space-y-2.5"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            {FEATURE_LIST.map((feat) => (
              <div key={feat} className="flex items-center gap-3">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(212,163,65,0.12)", border: "1px solid rgba(212,163,65,0.22)" }}
                >
                  <Check className="w-2.5 h-2.5" style={{ color: "#d4a341" }} />
                </div>
                <span className="text-[12.5px] font-light" style={{ color: "rgba(255,255,255,0.55)" }}>
                  {feat}
                </span>
              </div>
            ))}
          </div>

          {/* Primary CTA */}
          <button
            type="button"
            onClick={onActivate}
            disabled={activating}
            className="w-full rounded-2xl text-[13.5px] font-semibold transition-all hover:brightness-110 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              height: 50,
              background: activating
                ? "rgba(212,163,65,0.3)"
                : "linear-gradient(135deg, #e0b050, #c89030)",
              color: "#1a0f00",
              boxShadow: activating ? "none" : "0 0 28px -6px rgba(212,163,65,0.5)",
            }}
          >
            {activating ? "Joining…" : "Become a Creator"}
          </button>

          {/* Secondary dismiss */}
          <button
            type="button"
            onClick={onClose}
            className="w-full mt-3 py-2 text-[12px] font-light transition-colors hover:text-white/40"
            style={{ color: "rgba(255,255,255,0.22)" }}
          >
            Maybe later
          </button>

          {/* Quiet micro-moment */}
          <p
            className="text-center text-[11px] font-light italic mt-5"
            style={{ color: "rgba(212,163,65,0.22)" }}
          >
            Heartfelt creations only.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes promptIn {
          from { opacity: 0; transform: translateY(14px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
