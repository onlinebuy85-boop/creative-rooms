import { Link } from "wouter";
import { X, Music2 } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  /** What action the user tried to take — shapes the copy */
  reason?: string;
}

const COPY: Record<string, { headline: string; body: string }> = {
  "join voice": {
    headline: "Hear and be heard.",
    body: "Voice is live in this room. Create a free profile to join the session.",
  },
  "share demos": {
    headline: "Share your music here.",
    body: "Drop a demo into the room. Create a free profile to start contributing.",
  },
  "write in chat": {
    headline: "Join the conversation.",
    body: "The room is talking. Create a free profile to write in chat.",
  },
  "record audio": {
    headline: "Start recording.",
    body: "Capture the moment. Create a free profile to record in this room.",
  },
  "create a room": {
    headline: "Start your own room.",
    body: "Invite collaborators, share demos, create together. It only takes a moment.",
  },
};

const DEFAULT = {
  headline: "Join the session.",
  body: "Create a free profile to collaborate, share music, and connect with other creators.",
};

export function GuestSignupPrompt({ open, onClose, reason = "" }: Props) {
  if (!open) return null;

  const copy = COPY[reason.toLowerCase()] ?? DEFAULT;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(5,3,10,0.7)", backdropFilter: "blur(14px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[400px] rounded-3xl overflow-hidden"
        style={{
          background: "#0e0b16",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 40px 80px -8px rgba(0,0,0,0.75)",
          animation: "promptIn 0.22s ease both",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-28 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse, rgba(212,163,65,0.18) 0%, transparent 72%)",
            filter: "blur(18px)",
          }}
        />

        {/* Dismiss */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
          style={{ color: "rgba(255,255,255,0.38)" }}
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative px-8 py-10 text-center">
          {/* Icon */}
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{
              background: "rgba(212,163,65,0.09)",
              border: "1px solid rgba(212,163,65,0.2)",
            }}
          >
            <Music2 className="w-6 h-6" style={{ color: "#d4a341" }} />
          </div>

          <h2
            className="font-serif text-[1.5rem] tracking-tight mb-3"
            style={{ color: "rgba(255,255,255,0.92)" }}
          >
            {copy.headline}
          </h2>

          <p
            className="text-[13.5px] leading-relaxed mb-8 max-w-[280px] mx-auto"
            style={{ color: "rgba(255,255,255,0.42)" }}
          >
            {copy.body}
          </p>

          <div className="flex flex-col gap-2.5">
            <Link href="/signup">
              <button
                type="button"
                onClick={onClose}
                className="w-full h-12 rounded-2xl text-[14px] font-semibold transition-all hover:brightness-110 hover:scale-[1.02]"
                style={{
                  background: "linear-gradient(135deg, #e0b050, #c89030)",
                  color: "#1a0f00",
                  boxShadow: "0 0 28px -8px rgba(212,163,65,0.55)",
                }}
              >
                Create a free profile
              </button>
            </Link>

            <Link href="/login">
              <button
                type="button"
                onClick={onClose}
                className="w-full h-11 rounded-2xl text-[13.5px] font-medium transition-all hover:bg-white/10"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.52)",
                }}
              >
                Log in
              </button>
            </Link>
          </div>

          <p className="text-[11px] mt-5" style={{ color: "rgba(255,255,255,0.18)" }}>
            Free forever. No credit card required.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes promptIn {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
