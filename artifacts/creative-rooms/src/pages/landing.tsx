import { Link } from "wouter";
import heroImg from "@assets/ChatGPT_Image_26_maj_2026_11_33_28_1779788136339.png";
import logoImg from "../assets/images/creative-rooms-logo-v3.png";

/* ── Atmospheric signals — evocative, never fake-numeric ── */
const SIGNALS_TOP = [
  { text: "A room is forming" },
  { text: "Someone needs a vocalist" },
  { text: "Late-night session active" },
];
const SIGNALS_BOTTOM = [
  { text: "Hooks drifting tonight" },
  { text: "A feeling becoming a song" },
];

function LiveChip({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-1.5 rounded-full shrink-0"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(8px)",
        animation: `pageIn 0.7s ease both`,
        animationDelay: `${delay}ms`,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{
          background: "#4ade80",
          animation: "pulse-dot 2.4s ease-in-out infinite",
          animationDelay: `${delay * 0.4}ms`,
        }}
      />
      <span
        className="text-[11px] font-light tracking-wide whitespace-nowrap"
        style={{ color: "rgba(255,255,255,0.46)" }}
      >
        {text}
      </span>
    </div>
  );
}

/* ── Floating dust particles ── */
const PARTICLES = [
  { x: 8,  y: 72, size: 2,   dur: 9,  delay: 0 },
  { x: 14, y: 55, size: 1.5, dur: 12, delay: 2 },
  { x: 22, y: 80, size: 1,   dur: 8,  delay: 4 },
  { x: 5,  y: 40, size: 2.5, dur: 14, delay: 1 },
  { x: 30, y: 65, size: 1,   dur: 10, delay: 3 },
  { x: 18, y: 30, size: 2,   dur: 11, delay: 5 },
  { x: 35, y: 85, size: 1.5, dur: 13, delay: 0.5 },
  { x: 12, y: 20, size: 1,   dur: 9,  delay: 6 },
];

export function LandingPage() {
  return (
    <div
      className="relative w-full overflow-x-hidden"
      style={{ minHeight: "100dvh", background: "#0a080c" }}
    >
      {/* ── HERO PHOTOGRAPH ── */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImg}
          alt="Musicians collaborating in a warm apartment studio"
          className="w-full h-full object-cover"
          style={{ objectPosition: "center 20%" }}
        />
        {/* Heavy left vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(100deg, rgba(5,3,10,0.96) 0%, rgba(5,3,10,0.80) 35%, rgba(5,3,10,0.40) 62%, rgba(5,3,10,0.12) 100%)",
          }}
        />
        {/* Top fade — very soft so logo floats in the atmosphere, not in a dark box */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, rgba(5,3,10,0.18) 0%, rgba(5,3,10,0.0) 18%, rgba(5,3,10,0.0) 55%, rgba(5,3,10,0.72) 100%)",
          }}
        />
        {/* Warm ambient bloom — large pool behind logo area, no hard edges */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: "-8%", top: "-8%", width: "60%", height: "75%",
            background: "radial-gradient(ellipse at 28% 28%, rgba(190,120,18,0.18) 0%, rgba(160,95,10,0.08) 35%, rgba(100,55,5,0.02) 60%, transparent 75%)",
            animation: "warm-glow 5.5s ease-in-out infinite",
          }}
        />
        {/* Tighter cinematic light bloom directly around logo position */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: "-2%", top: "-4%", width: "32%", height: "38%",
            background: "radial-gradient(ellipse at 35% 35%, rgba(212,163,65,0.12) 0%, rgba(180,120,20,0.05) 45%, transparent 70%)",
            animation: "breathe 3.8s ease-in-out infinite",
            animationDelay: "0.6s",
          }}
        />
        {/* Cool-purple ambient from upper right */}
        <div
          className="absolute pointer-events-none"
          style={{
            right: "15%", top: "0%", width: "40%", height: "50%",
            background: "radial-gradient(ellipse, rgba(80,40,120,0.06) 0%, transparent 65%)",
            animation: "warm-glow 8s ease-in-out infinite",
            animationDelay: "3s",
          }}
        />
      </div>

      {/* ── FLOATING DUST PARTICLES ── */}
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`, top: `${p.y}%`,
              width: `${p.size}px`, height: `${p.size}px`,
              background: `rgba(212,163,65,${0.14 + (i % 3) * 0.09})`,
              animation: `float-up ${p.dur}s ease-in-out infinite`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* ── NAV ── */}
      <header className="relative z-10 flex items-center justify-between px-5 md:px-10 pt-5 md:pt-6 max-w-[1280px] mx-auto">
        {/* Brand */}
        <Link href="/">
          <div className="relative group cursor-pointer">
            {/* Atmospheric warm glow — now pulses with waveform rhythm */}
            <div
              className="absolute pointer-events-none"
              style={{
                left: -16, top: "50%", transform: "translateY(-50%)",
                width: 140, height: 120,
                background: "radial-gradient(ellipse at 38% 50%, rgba(200,130,20,0.32) 0%, rgba(212,163,65,0.08) 50%, transparent 72%)",
                animation: "warm-glow 3.5s ease-in-out infinite",
              }}
            />
            {/* Second glow layer — offset phase for waveform pulse feel */}
            <div
              className="absolute pointer-events-none"
              style={{
                left: -8, top: "50%", transform: "translateY(-50%)",
                width: 80, height: 60,
                background: "radial-gradient(ellipse at 40% 50%, rgba(212,163,65,0.14) 0%, transparent 65%)",
                animation: "breathe 2.2s ease-in-out infinite",
                animationDelay: "0.8s",
              }}
            />
            <img
              src={logoImg}
              alt="Creative Rooms"
              style={{
                height: "clamp(72px, 9vw, 104px)",
                width: "auto",
                objectFit: "contain",
                position: "relative",
                filter: "brightness(1.22) drop-shadow(0 0 20px rgba(212,163,65,0.48))",
                transition: "filter 0.4s ease, transform 0.3s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLImageElement).style.filter =
                  "brightness(1.42) drop-shadow(0 0 32px rgba(212,163,65,0.78))";
                (e.currentTarget as HTMLImageElement).style.transform = "scale(1.025)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLImageElement).style.filter =
                  "brightness(1.22) drop-shadow(0 0 20px rgba(212,163,65,0.48))";
                (e.currentTarget as HTMLImageElement).style.transform = "scale(1)";
              }}
            />
          </div>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-9">
          {[
            { label: "Rooms", href: "/discover" },
            { label: "Hooks", href: "/hooks" },
            { label: "About", href: "/about" },
          ].map(({ label, href }, i) => (
            <Link key={label} href={href}>
              <span
                className="text-[13px] tracking-wide cursor-pointer transition-colors hover:text-white/80"
                style={{
                  color: i === 0 ? "rgba(212,163,65,0.9)" : "rgba(255,255,255,0.42)",
                  borderBottom: i === 0 ? "1px solid rgba(212,163,65,0.45)" : "none",
                  paddingBottom: i === 0 ? "2px" : "0",
                }}
              >
                {label}
              </span>
            </Link>
          ))}
        </nav>

        {/* Auth CTAs */}
        <div className="flex items-center gap-3 md:gap-4">
          <Link href="/sign-in">
            <span
              className="text-[13px] tracking-wide cursor-pointer transition-colors hover:text-white hidden sm:inline"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              Log in
            </span>
          </Link>
          <Link href="/sign-up">
            <button
              className="px-4 md:px-5 py-2 rounded-full text-[12px] md:text-[13px] font-semibold transition-all hover:brightness-110 hover:scale-[1.03]"
              style={{
                background: "linear-gradient(135deg,#e0b050,#c89030)",
                color: "#1a0f00",
              }}
            >
              Join free
            </button>
          </Link>
        </div>
      </header>

      {/* ── HERO COPY ── */}
      {/* Mobile: reduced top padding so content is visible faster */}
      <section className="relative z-10 px-5 md:px-10 pt-10 md:pt-20 pb-20 md:pb-36 max-w-[1280px] mx-auto">
        <div className="max-w-[580px]">

          {/* Atmospheric signals — top row */}
          <div className="flex flex-wrap gap-2 mb-7 md:mb-8">
            {SIGNALS_TOP.map((s, i) => (
              <LiveChip key={i} text={s.text} delay={i * 100} />
            ))}
          </div>

          {/* Headline */}
          <h1
            className="font-serif font-normal leading-[1.06] tracking-tight mb-6 md:mb-7 text-white"
            style={{
              fontSize: "clamp(2.4rem, 5.5vw, 4.4rem)",
              animation: "pageIn 0.8s ease both",
              animationDelay: "200ms",
            }}
          >
            Where music is<br />
            made between<br />
            <em className="not-italic" style={{ color: "rgba(212,163,65,0.88)" }}>real people.</em>
          </h1>

          {/* Sub */}
          <p
            className="text-[14px] md:text-[15px] font-light leading-relaxed mb-7 md:mb-8 max-w-[430px]"
            style={{
              color: "rgba(255,255,255,0.4)",
              animation: "pageIn 0.8s ease both",
              animationDelay: "350ms",
            }}
          >
            Intimate creative rooms for musicians, producers, singers and songwriters.
            Drop a hook. Find a collaborator. Make something that matters.
          </p>

          {/* CTAs — clear hierarchy */}
          <div
            className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5"
            style={{ animation: "pageIn 0.8s ease both", animationDelay: "500ms" }}
          >
            {/* PRIMARY — dominant, glowing */}
            <Link href="/sign-up">
              <button
                className="w-full sm:w-auto h-13 px-8 rounded-full font-semibold text-[14px] tracking-wide transition-all hover:scale-[1.04] hover:brightness-110 active:scale-[0.98]"
                style={{
                  background: "linear-gradient(135deg,#e0b050,#c89030)",
                  color: "#1a0f00",
                  height: "52px",
                  boxShadow: "0 0 32px rgba(212,163,65,0.32), 0 4px 20px rgba(0,0,0,0.4)",
                }}
              >
                Find your room
              </button>
            </Link>

            {/* SECONDARY — quiet, text-only */}
            <Link href="/about">
              <span
                className="inline-flex items-center gap-1.5 text-[13px] font-light tracking-wide cursor-pointer transition-colors hover:text-white/60"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                Watch the vibe
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ opacity: 0.5 }}>
                  <path d="M2.5 6h7M6.5 3.5L9 6l-2.5 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
          </div>

          {/* Atmospheric signals — bottom row, quieter */}
          <div
            className="flex flex-wrap gap-2 mt-6 md:mt-7"
            style={{ animation: "pageIn 0.8s ease both", animationDelay: "700ms" }}
          >
            {SIGNALS_BOTTOM.map((s, i) => (
              <LiveChip key={i} text={s.text} delay={800 + i * 100} />
            ))}
            {/* Live sessions indicator — atmospheric, no fake counts */}
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full shrink-0"
              style={{
                background: "rgba(212,163,65,0.05)",
                border: "1px solid rgba(212,163,65,0.12)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "#d4a341", animation: "breathe 2s ease-in-out infinite" }}
              />
              <span className="text-[11px] font-light" style={{ color: "rgba(212,163,65,0.55)" }}>
                Live sessions open
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── MOOD STRIP ── */}
      <section
        className="relative z-10 border-t border-white/[0.05] px-5 md:px-10 py-6 md:py-7 max-w-[1280px] mx-auto"
        style={{ animation: "pageIn 0.8s ease both", animationDelay: "900ms" }}
      >
        <div className="flex items-center gap-8 md:gap-12 flex-wrap">
          {[
            { num: "2–4", label: "creators per room" },
            { num: "Live", label: "voice & text sessions" },
            { num: "∞",   label: "hooks waiting" },
          ].map(({ num, label }) => (
            <div key={label} className="flex items-baseline gap-2.5 md:gap-3">
              <span
                className="font-serif text-[1.7rem] md:text-[2rem] font-light"
                style={{ color: "rgba(212,163,65,0.78)" }}
              >
                {num}
              </span>
              <span className="text-[11px] md:text-[12px] tracking-wide" style={{ color: "rgba(255,255,255,0.27)" }}>
                {label}
              </span>
            </div>
          ))}

          {/* Ambient waveform — desktop only */}
          <div className="ml-auto hidden lg:flex items-end gap-[3px] h-8 opacity-20">
            {[4,7,5,9,6,8,4,10,7,5,8,4,6,9,5,7,4,8,6,5].map((h, i) => (
              <div
                key={i}
                className="w-[2px] rounded-full"
                style={{
                  height: `${h * 10}%`,
                  background: "#d4a341",
                  animation: `breathe ${2 + (i % 5) * 0.4}s ease-in-out infinite`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
