import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useGetMyProfile, useCreateProfile } from "@workspace/api-client-react";
import { useUser } from "@clerk/react";
import { ArrowRight, Loader2, Check } from "lucide-react";
import logoImg from "../assets/images/creative-room-logo.png";

/* ── Step definitions ──────────────────────────────────────── */
const STEPS = [
  {
    question: "What do you create?",
    sub: "Select everything that feels like you.",
    options: [
      "Songwriting", "Production", "Guitar", "Piano", "Vocals",
      "Poetry", "Lyrics", "Live instruments", "Ambient soundscapes",
      "Storytelling", "Experimental music", "Mixing & mastering",
    ],
  },
  {
    question: "What inspires you?",
    sub: "Artists, sounds, moods — whatever moves you.",
    options: [
      "Pink Floyd", "Bon Iver", "Radiohead", "Nick Drake", "Portishead",
      "Cinematic", "Analog", "Dreamy", "Emotional", "Acoustic",
      "Ambient", "Soulful", "Nostalgic", "Lo-fi", "Orchestral",
    ],
  },
  {
    question: "What kind of creative\nenergy are you looking for?",
    sub: "How do you want to work with others?",
    options: [
      "Late night writing", "Calm collaboration", "Live jam sessions",
      "Emotional songwriting", "Experimental creativity",
      "Deep conversations", "Organic music making", "Focused production",
    ],
  },
];

/* ── Tag chip ────────────────────────────────────────────────── */
function Tag({
  label,
  selected,
  onToggle,
}: {
  label: string;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="group relative px-4 py-2 rounded-full text-[13px] font-medium border transition-all duration-200 text-left"
      style={{
        background: selected ? "rgba(212,163,65,0.14)" : "rgba(255,255,255,0.04)",
        borderColor: selected ? "rgba(212,163,65,0.55)" : "rgba(255,255,255,0.10)",
        color: selected ? "rgba(212,163,65,0.95)" : "rgba(255,255,255,0.52)",
        boxShadow: selected ? "0 0 14px -4px rgba(212,163,65,0.25)" : "none",
      }}
    >
      {selected && (
        <Check
          className="inline-block w-3 h-3 mr-1.5 opacity-80"
          style={{ color: "rgba(212,163,65,0.9)" }}
        />
      )}
      {label}
    </button>
  );
}

/* ── Step dots ─────────────────────────────────────────────── */
function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="rounded-full transition-all duration-400"
          style={{
            width: i === current ? 20 : 6,
            height: 6,
            background: i === current
              ? "rgba(212,163,65,0.85)"
              : i < current
              ? "rgba(212,163,65,0.35)"
              : "rgba(255,255,255,0.15)",
          }}
        />
      ))}
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────── */
export function ProfileSetupPage() {
  const [, setLocation] = useLocation();
  const { user } = useUser();
  const { data: profile, isLoading: isProfileLoading } = useGetMyProfile();
  const createProfile = useCreateProfile();

  /* Onboarding state */
  const [screen, setScreen] = useState<"intro" | 0 | 1 | 2>("intro");
  const [displayName, setDisplayName] = useState("");
  const [selections, setSelections] = useState<string[][]>([[], [], []]);

  /* Pre-fill name from Clerk */
  useEffect(() => {
    if (user?.fullName && !displayName) {
      setDisplayName(user.fullName);
    }
  }, [user]);

  /* If profile already exists, skip to discover */
  useEffect(() => {
    if (profile && !isProfileLoading) {
      setLocation("/discover");
    }
  }, [profile, isProfileLoading, setLocation]);

  if (isProfileLoading) return null;

  /* ── Helpers ── */
  function toggle(stepIdx: number, option: string) {
    setSelections((prev) => {
      const next = [...prev];
      const arr = next[stepIdx];
      next[stepIdx] = arr.includes(option)
        ? arr.filter((x) => x !== option)
        : [...arr, option];
      return next;
    });
  }

  function advance() {
    if (screen === "intro") { setScreen(0); return; }
    if (screen === 0) { setScreen(1); return; }
    if (screen === 1) { setScreen(2); return; }
    if (screen === 2) { finish(); }
  }

  function finish() {
    const roles = selections[0];
    const insps = selections[1];
    const energy = selections[2];
    createProfile.mutate(
      {
        data: {
          displayName: displayName.trim() || user?.fullName || "Creator",
          musicalStyle: roles.join(", "),
          inspirations: insps.join(", "),
          emotionalVibe: energy.join(", "),
          genres: roles,
        },
      },
      {
        onSuccess: () => setLocation("/discover"),
      }
    );
  }

  /* ── Layout wrapper ── */
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-between overflow-hidden"
      style={{ background: "#0a080c" }}
    >
      {/* Subtle grain */}
      <div className="bg-noise pointer-events-none" />

      {/* Ambient glow — top left */}
      <div
        className="pointer-events-none absolute top-0 left-0 w-[600px] h-[400px] opacity-25"
        style={{
          background: "radial-gradient(ellipse at 20% 10%, rgba(212,163,65,0.18) 0%, transparent 65%)",
        }}
      />
      {/* Ambient glow — bottom right */}
      <div
        className="pointer-events-none absolute bottom-0 right-0 w-[500px] h-[400px] opacity-20"
        style={{
          background: "radial-gradient(ellipse at 80% 90%, rgba(124,92,191,0.2) 0%, transparent 65%)",
        }}
      />

      {/* ── BRAND ── */}
      <div className="w-full flex justify-center pt-8 relative z-10">
        <img
          src={logoImg}
          alt="Creative Rooms"
          style={{ height: 26, width: "auto", objectFit: "contain", opacity: 0.82 }}
        />
      </div>

      {/* ── STEP CONTENT ── */}
      <div
        key={String(screen)}
        className="relative z-10 flex flex-col items-center px-6 w-full max-w-2xl"
        style={{ animation: "stepIn 0.45s ease both" }}
      >
        {screen === "intro" ? (
          /* ── INTRO SCREEN ── */
          <div className="text-center space-y-6 w-full max-w-md">
            <div className="space-y-2">
              <h1 className="font-serif text-white" style={{ fontSize: "clamp(2.4rem, 5vw, 3.4rem)" }}>
                Let's set the tone.
              </h1>
              <p className="text-[15px] font-light" style={{ color: "rgba(255,255,255,0.45)" }}>
                Three quick questions to find you the right rooms.
              </p>
            </div>

            <div className="space-y-1 text-left">
              <label
                className="text-[11px] tracking-widest uppercase"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                What should we call you?
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name or alias"
                className="w-full rounded-xl px-5 py-3.5 text-[15px] outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.88)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(212,163,65,0.45)";
                  e.target.style.boxShadow = "0 0 20px -6px rgba(212,163,65,0.25)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255,255,255,0.12)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
          </div>
        ) : (
          /* ── CREATIVE QUESTION STEPS ── */
          <div className="space-y-8 w-full">
            <div className="space-y-2 text-center">
              <h2
                className="font-serif text-white leading-tight whitespace-pre-line"
                style={{ fontSize: "clamp(2rem, 4.5vw, 3rem)" }}
              >
                {STEPS[screen as number].question}
              </h2>
              <p className="text-[14px]" style={{ color: "rgba(255,255,255,0.4)" }}>
                {STEPS[screen as number].sub}
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5 justify-center">
              {STEPS[screen as number].options.map((opt) => (
                <Tag
                  key={opt}
                  label={opt}
                  selected={selections[screen as number].includes(opt)}
                  onToggle={() => toggle(screen as number, opt)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── BOTTOM BAR ── */}
      <div className="relative z-10 w-full max-w-2xl flex items-center justify-between px-6 pb-10">
        {/* Step dots (hidden on intro) */}
        {screen !== "intro" ? (
          <StepDots current={screen as number} total={3} />
        ) : (
          <div />
        )}

        {/* CTA */}
        <button
          type="button"
          onClick={advance}
          disabled={createProfile.isPending}
          className="flex items-center gap-2 font-medium rounded-full px-7 py-3 text-[14px] transition-all hover:scale-[1.04] disabled:opacity-50 active:scale-[0.97]"
          style={{
            background: "linear-gradient(135deg, #e0b050, #c89030)",
            color: "#1a0f00",
            boxShadow: "0 0 28px -6px rgba(212,163,65,0.5)",
          }}
        >
          {createProfile.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Setting up…
            </>
          ) : screen === 2 ? (
            <>
              Enter Creative Rooms
              <ArrowRight className="w-4 h-4" />
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      <style>{`
        @keyframes stepIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
