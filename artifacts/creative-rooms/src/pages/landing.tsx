import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import heroImg from "@assets/ChatGPT_Image_26_maj_2026_11_33_28_1779788136339.png";
import logoImg from "@assets/creative-rooms-wordmark.png";

const SOCIAL_AVATARS = [
  { initials: "LV", bg: "#7c4a1e" },
  { initials: "MD", bg: "#1e3a5f" },
  { initials: "RH", bg: "#4a1d6e" },
  { initials: "SK", bg: "#7f1d1d" },
  { initials: "AM", bg: "#14532d" },
];

export function LandingPage() {
  return (
    <div
      className="relative w-full overflow-x-hidden"
      style={{ minHeight: "100dvh", background: "#0a080c" }}
    >
      {/* ── HERO PHOTOGRAPH ─────────────────────────────────── */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImg}
          alt="Musicians collaborating in a warm apartment studio"
          className="w-full h-full object-cover"
          style={{ objectPosition: "center 20%" }}
        />

        {/* Dark vignette — heavy left, lighter right so the people breathe */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(100deg, rgba(5,3,10,0.93) 0%, rgba(5,3,10,0.72) 38%, rgba(5,3,10,0.35) 65%, rgba(5,3,10,0.15) 100%)",
          }}
        />

        {/* Subtle top & bottom fades */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70" />
      </div>

      {/* ── NAV ─────────────────────────────────────────────── */}
      <header className="relative z-10 flex items-center justify-between px-10 pt-7 max-w-[1280px] mx-auto">

        {/* Brand */}
        <Link href="/">
          <img
            src={logoImg}
            alt="Creative Rooms"
            style={{ height: 30, width: "auto", objectFit: "contain" }}
          />
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-9">
          {["Rooms", "People", "Inspiration", "About"].map((item, i) => (
            <span
              key={item}
              className="text-[13px] tracking-wide cursor-pointer transition-colors"
              style={{
                color: i === 0 ? "rgba(212,163,65,0.9)" : "rgba(255,255,255,0.48)",
                borderBottom: i === 0 ? "1px solid rgba(212,163,65,0.5)" : "none",
                paddingBottom: i === 0 ? "2px" : "0",
              }}
            >
              {item}
            </span>
          ))}
        </nav>

        {/* Log in */}
        <Button
          variant="outline"
          className="h-9 px-5 rounded-full border-white/22 bg-transparent text-white/70 hover:bg-white/8 hover:text-white text-[13px] tracking-wide"
          asChild
        >
          <Link href="/sign-in">Log in</Link>
        </Button>
      </header>

      {/* ── MAIN CONTENT ────────────────────────────────────── */}
      <div
        className="relative z-10 px-10 max-w-[1280px] mx-auto flex flex-col justify-center"
        style={{ paddingTop: "clamp(64px, 12vh, 110px)", minHeight: "calc(100dvh - 80px)" }}
      >
        <div
          className="max-w-[560px] space-y-7"
          style={{ animation: "fadeUp 0.9s ease both" }}
        >

          {/* ── HEADLINE ── */}
          <h1
            className="font-serif leading-[1.02] tracking-tight"
            style={{ fontSize: "clamp(3rem, 7.5vw, 5.4rem)" }}
          >
            <span className="block text-white drop-shadow-lg">Real people.</span>
            <span className="block text-white drop-shadow-lg">Real music.</span>
            <span className="block drop-shadow-lg">
              <span className="text-white">Create </span>
              <span style={{ color: "#d4a341" }}>together.</span>
            </span>
          </h1>

          {/* ── SUB-COPY ── */}
          <p
            className="text-[15px] leading-[1.7] max-w-[380px]"
            style={{ color: "rgba(255,255,255,0.52)" }}
          >
            Creative Rooms is a global community for music and lyrics.
            Join rooms, share ideas, and create something real.
          </p>

          {/* ── CTAs ── */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Button
              className="h-12 px-7 rounded-full text-[13.5px] font-semibold border-0 transition-all hover:scale-[1.03] hover:brightness-110 text-black"
              style={{
                background: "linear-gradient(135deg, #e0b050, #c89030)",
                boxShadow: "0 0 36px -6px rgba(212,163,65,0.65)",
              }}
              asChild
            >
              <Link href="/sign-up">Enter Creative Rooms</Link>
            </Button>

            <Button
              variant="outline"
              className="h-12 px-6 rounded-full border-white/20 bg-white/[0.05] text-white/70 hover:bg-white/10 hover:text-white backdrop-blur-sm text-[13.5px] font-medium flex items-center gap-2"
              asChild
            >
              <Link href="/discover">
                <Play className="w-3.5 h-3.5 fill-current" />
                Watch the vibe
              </Link>
            </Button>
          </div>

          {/* ── SOCIAL PROOF ── */}
          <div className="flex items-center gap-3 pt-2">
            {/* Overlapping avatars */}
            <div className="flex -space-x-2">
              {SOCIAL_AVATARS.map((a, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-[1.5px] flex items-center justify-center text-white text-[11px] font-semibold"
                  style={{
                    background: a.bg,
                    borderColor: "rgba(10,8,14,0.9)",
                    zIndex: SOCIAL_AVATARS.length - i,
                    position: "relative",
                    boxShadow: "0 1px 6px rgba(0,0,0,0.5)",
                  }}
                >
                  {a.initials}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {/* Live green dot */}
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  background: "#4ade80",
                  boxShadow: "0 0 7px 2px rgba(74,222,128,0.55)",
                  animation: "pulse 2.4s ease-in-out infinite",
                }}
              />
              <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.48)" }}>
                <span style={{ color: "rgba(255,255,255,0.72)" }}>2,847</span> creatives online now
              </span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.65; transform: scale(1.25); }
        }
      `}</style>
    </div>
  );
}
