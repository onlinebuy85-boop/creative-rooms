import { Link } from "wouter";
import heroImg from "@assets/ChatGPT_Image_26_maj_2026_11_33_28_1779788136339.png";
import logoImg from "../assets/images/creative-rooms-logo-v4.png";

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
          alt=""
          className="hero-photo w-full h-full object-cover"
          style={{ imageRendering: "auto" }}
        />
        {/* Desktop vignette — left-heavy for landscape composition */}
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            background: "linear-gradient(100deg, rgba(5,3,10,0.96) 0%, rgba(5,3,10,0.80) 38%, rgba(5,3,10,0.42) 65%, rgba(5,3,10,0.1) 100%)",
          }}
        />
        {/* Mobile vignette — softer top→bottom so warm lamp light stays visible */}
        <div
          className="absolute inset-0 md:hidden"
          style={{
            background: "linear-gradient(180deg, rgba(5,3,10,0.86) 0%, rgba(5,3,10,0.55) 35%, rgba(5,3,10,0.4) 60%, rgba(5,3,10,0.78) 100%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />
        <div
          className="absolute pointer-events-none"
          style={{
            left: "-5%", top: "5%", width: "55%", height: "70%",
            background: "radial-gradient(ellipse at 30% 40%, rgba(180,110,20,0.12) 0%, rgba(140,80,10,0.04) 45%, transparent 70%)",
            animation: "warm-glow 6s ease-in-out infinite",
          }}
        />
      </div>

      <style>{`
        .hero-photo { object-position: 60% 30%; }
        @media (min-width: 768px) { .hero-photo { object-position: center 20%; } }
      `}</style>

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
        <Link href="/">
          <div className="relative cursor-pointer">
            {/* Subtle ambient warmth behind the logo — cinematic, not aggressive */}
            <div
              className="absolute pointer-events-none"
              style={{
                left: -16, top: "50%", transform: "translateY(-50%)",
                width: 180, height: 90,
                background: "radial-gradient(ellipse at 30% 50%, rgba(212,163,65,0.18) 0%, rgba(212,163,65,0.04) 50%, transparent 75%)",
                animation: "warm-glow 5s ease-in-out infinite",
              }}
            />
            <img
              src={logoImg}
              alt="Creative Room"
              style={{
                width: "clamp(240px, 62vw, 320px)",
                height: "auto",
                objectFit: "contain",
                position: "relative",
                filter: "brightness(1.15) drop-shadow(0 0 14px rgba(212,163,65,0.35))",
                transition: "filter 0.4s ease",
              }}
            />
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-9">
          {[
            { label: "Rooms", href: "/discover" },
            { label: "Hooks", href: "/hooks" },
            { label: "About", href: "/about" },
          ].map(({ label, href }) => (
            <Link key={label} href={href}>
              <span
                className="text-[13px] tracking-wide cursor-pointer transition-colors hover:text-white/80"
                style={{ color: "rgba(255,255,255,0.42)" }}
              >
                {label}
              </span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 md:gap-4">
          <Link href="/sign-in">
            <span
              className="text-[13px] tracking-wide cursor-pointer transition-colors hover:text-white hidden sm:inline"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Log in
            </span>
          </Link>
          <Link href="/sign-up">
            <button
              className="px-4 md:px-5 py-2 rounded-full text-[12px] md:text-[13px] font-semibold transition-all hover:brightness-110 hover:scale-[1.03]"
              style={{ background: "linear-gradient(135deg,#e0b050,#c89030)", color: "#1a0f00" }}
            >
              Join free
            </button>
          </Link>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative z-10 px-5 md:px-10 pt-12 md:pt-24 pb-20 md:pb-32 max-w-[1280px] mx-auto">
        <div className="max-w-[560px]">

          {/* Headline */}
          <h1
            className="font-serif font-normal leading-[1.06] tracking-tight mb-6 md:mb-7 text-white"
            style={{
              fontSize: "clamp(2.6rem, 5.5vw, 4.6rem)",
              animation: "pageIn 0.7s ease both",
            }}
          >
            Where music is<br />
            made between<br />
            <em className="not-italic" style={{ color: "rgba(212,163,65,0.9)" }}>real people.</em>
          </h1>

          {/* Sub */}
          <p
            className="text-[14px] md:text-[15px] font-light leading-relaxed mb-9 max-w-[420px]"
            style={{
              color: "rgba(255,255,255,0.5)",
              animation: "pageIn 0.7s ease both",
              animationDelay: "120ms",
            }}
          >
            Intimate creative rooms for musicians, producers, singers and songwriters.
            Drop a hook. Find a collaborator. Make something that matters.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row sm:items-center gap-3"
            style={{ animation: "pageIn 0.7s ease both", animationDelay: "220ms" }}
          >
            {/* PRIMARY */}
            <Link href="/discover">
              <button
                className="w-full sm:w-auto flex flex-col items-center justify-center gap-0.5 px-8 rounded-2xl font-semibold transition-all hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]"
                style={{
                  background: "linear-gradient(135deg,#e0b050,#c89030)",
                  color: "#1a0f00",
                  height: "60px",
                  minWidth: "200px",
                  boxShadow: "0 0 28px rgba(212,163,65,0.28), 0 4px 18px rgba(0,0,0,0.4)",
                }}
              >
                <span className="text-[14px] font-bold tracking-wide">Explore rooms</span>
                <span className="text-[10px] font-medium opacity-65 tracking-wide">No signup needed to explore</span>
              </button>
            </Link>

            {/* SECONDARY */}
            <Link href="/sign-up">
              <button
                className="w-full sm:w-auto flex items-center justify-center px-8 rounded-2xl font-medium text-[14px] tracking-wide transition-all hover:bg-white/8 active:scale-[0.98]"
                style={{
                  height: "60px",
                  minWidth: "140px",
                  border: "1px solid rgba(255,255,255,0.16)",
                  color: "rgba(255,255,255,0.78)",
                  background: "rgba(255,255,255,0.03)",
                  backdropFilter: "blur(8px)",
                }}
              >
                Join free
              </button>
            </Link>
          </div>

          {/* Tagline */}
          <p
            className="text-[12px] font-light tracking-wide mt-7"
            style={{
              color: "rgba(255,255,255,0.36)",
              animation: "pageIn 0.6s ease both",
              animationDelay: "320ms",
            }}
          >
            Listen first. Join when it feels right.
          </p>
        </div>
      </section>

      {/* ── WHAT THIS IS ── honest, descriptive — not engagement metrics */}
      <section
        className="relative z-10 border-t border-white/[0.05] px-5 md:px-10 py-10 md:py-12 max-w-[1280px] mx-auto"
        style={{ animation: "pageIn 0.6s ease both", animationDelay: "420ms" }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {[
            {
              label: "Small rooms",
              sub: "Two to four people. No audiences. No noise.",
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(212,163,65,0.75)" strokeWidth="1.6" strokeLinecap="round">
                  <circle cx="9" cy="7" r="4" /><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" /><path d="M16 3.13a4 4 0 0 1 0 7.75M21 21v-2a4 4 0 0 0-3-3.87" />
                </svg>
              ),
            },
            {
              label: "Live together",
              sub: "Chat, voice, and shared demos in real time.",
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(212,163,65,0.75)" strokeWidth="1.6" strokeLinecap="round">
                  <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
                </svg>
              ),
            },
            {
              label: "Share a hook",
              sub: "Drop the idea you can't stop humming.",
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(212,163,65,0.75)" strokeWidth="1.6" strokeLinecap="round">
                  <path d="M9 12a3 3 0 1 0 6 0 3 3 0 0 0-6 0" /><path d="M12 3v3m0 12v3M3 12h3m12 0h3" />
                </svg>
              ),
            },
            {
              label: "No social games",
              sub: "No likes, no follows, no feeds. Just the work.",
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(212,163,65,0.75)" strokeWidth="1.6" strokeLinecap="round">
                  <circle cx="12" cy="12" r="9" /><path d="M8 12h8" />
                </svg>
              ),
            },
          ].map(({ label, sub, icon }) => (
            <div key={label} className="flex flex-col">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ background: "rgba(212,163,65,0.06)", border: "1px solid rgba(212,163,65,0.12)" }}
              >
                {icon}
              </div>
              <p className="text-[13px] font-medium text-white/85 mb-1">{label}</p>
              <p className="text-[12px] font-light leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>{sub}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
