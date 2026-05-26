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
          loading="eager"
          decoding="async"
          fetchPriority="high"
          className="hero-photo w-full h-full object-cover"
          style={{
            imageRendering: "auto",
            filter: "saturate(1.08) contrast(1.06) brightness(1.02)",
            transform: "translateZ(0)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            willChange: "transform",
          }}
        />
        {/* Desktop vignette — left-heavy for landscape composition */}
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            background: "linear-gradient(100deg, rgba(5,3,10,0.96) 0%, rgba(5,3,10,0.80) 38%, rgba(5,3,10,0.42) 65%, rgba(5,3,10,0.1) 100%)",
          }}
        />
        {/* Mobile vignette — softer so the cinematic warmth and detail show through */}
        <div
          className="absolute inset-0 md:hidden"
          style={{
            background: "linear-gradient(180deg, rgba(5,3,10,0.78) 0%, rgba(5,3,10,0.42) 30%, rgba(5,3,10,0.28) 55%, rgba(5,3,10,0.72) 100%)",
          }}
        />
        {/* Mobile-only readability scrim around the headline area — keeps text legible without muddying the image */}
        <div
          className="absolute md:hidden pointer-events-none"
          style={{
            top: 0, left: 0, right: 0, height: "62%",
            background: "linear-gradient(180deg, rgba(5,3,10,0.55) 0%, rgba(5,3,10,0.35) 45%, transparent 100%)",
          }}
        />
        {/* Desktop bottom fade — deeper shadow tones for cinematic depth.
            Top kept very light so it doesn't double-darken the top-left corner where
            the left vignette is already 0.96 opacity. */}
        <div className="absolute inset-0 hidden md:block bg-gradient-to-b from-transparent via-transparent to-black/75" />
        {/* Desktop ambient warm light glow — lamp pool on the left of the photograph */}
        <div
          className="absolute pointer-events-none hidden md:block"
          style={{
            left: "-5%", top: "5%", width: "55%", height: "70%",
            background: "radial-gradient(ellipse at 30% 40%, rgba(212,150,40,0.18) 0%, rgba(160,90,15,0.06) 45%, transparent 72%)",
            animation: "warm-glow 8s ease-in-out infinite",
            mixBlendMode: "screen",
          }}
        />
        {/* Desktop secondary warm rim light — adds dimensional depth on the right */}
        <div
          className="absolute pointer-events-none hidden md:block"
          style={{
            right: "-8%", top: "10%", width: "45%", height: "65%",
            background: "radial-gradient(ellipse at 70% 50%, rgba(180,120,45,0.10) 0%, rgba(120,70,10,0.03) 50%, transparent 75%)",
            animation: "warm-glow-slow 13s ease-in-out infinite",
            animationDelay: "2s",
            mixBlendMode: "screen",
          }}
        />
        {/* Desktop film grain — subtle analog texture for cinematic feel */}
        <div
          className="absolute inset-0 hidden md:block pointer-events-none"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            opacity: 0.055,
            mixBlendMode: "overlay",
          }}
        />
      </div>

      <style>{`
        .hero-photo { object-position: 60% 30%; }
        @media (min-width: 768px) {
          .hero-photo {
            object-position: center 20%;
            /* Richer cinematic grade on desktop — deeper blacks, warmer mids, more contrast */
            filter: saturate(1.18) contrast(1.14) brightness(1.04) !important;
          }
        }
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
      <header className="relative z-10 flex items-center justify-between gap-4 px-5 md:px-10 pt-6 md:pt-8 max-w-[1280px] mx-auto">
        <Link href="/">
          <div
            className="relative cursor-pointer flex items-center"
            style={{ isolation: "isolate" }}
          >
            {/* Primary glow — drifts left↔right with a warm breath */}
            <div
              className="absolute pointer-events-none"
              style={{
                left: -16, top: "50%",
                width: "108%", height: 80,
                background: "radial-gradient(ellipse at 30% 50%, rgba(212,163,65,0.22) 0%, rgba(212,163,65,0.05) 50%, transparent 75%)",
                animation: "warm-glow-drift 9s ease-in-out infinite",
                mixBlendMode: "screen",
                transform: "translateY(-50%)",
              }}
            />
            {/* Secondary glow — counter-drifts at a slower pace for layered depth.
                Tightened margins to fit within the header's px-10 padding even at peak drift. */}
            <div
              className="absolute pointer-events-none"
              style={{
                left: -20, top: "50%",
                width: "114%", height: 100,
                background: "radial-gradient(ellipse at 55% 50%, rgba(224,176,80,0.14) 0%, rgba(180,110,20,0.05) 45%, transparent 75%)",
                animation: "warm-glow-drift-counter 14s ease-in-out infinite",
                animationDelay: "2s",
                mixBlendMode: "screen",
                transform: "translateY(-50%)",
              }}
            />
            <img
              src={logoImg}
              alt="Creative Room"
              decoding="sync"
              style={{
                height: "clamp(32px, 7vw, 44px)",
                width: "auto",
                objectFit: "contain",
                position: "relative",
                /* Crisp logo: lighter drop-shadow so edges stay sharp, no soft halo */
                filter: "brightness(1.08) contrast(1.05) drop-shadow(0 1px 2px rgba(0,0,0,0.5)) drop-shadow(0 0 6px rgba(212,163,65,0.28))",
                imageRendering: "auto",
                WebkitBackfaceVisibility: "hidden",
                backfaceVisibility: "hidden",
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

        <div className="flex items-center gap-4 md:gap-5">
          <Link href="/sign-in">
            <span
              className="text-[13px] tracking-wide cursor-pointer transition-colors hover:text-white/75 hidden sm:inline"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Log in
            </span>
          </Link>
          <Link href="/sign-up">
            <span
              className="text-[12px] md:text-[13px] tracking-wide cursor-pointer transition-colors hover:text-white/80"
              style={{ color: "rgba(255,255,255,0.46)" }}
            >
              Join free
            </span>
          </Link>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative z-10 px-5 md:px-10 pt-20 md:pt-28 pb-16 md:pb-28 max-w-[1280px] mx-auto">
        <div className="max-w-[560px]">

          {/* Headline */}
          <h1
            className="font-serif font-normal leading-[1.08] tracking-tight mb-7 md:mb-8 text-white"
            style={{
              fontSize: "clamp(2.4rem, 5.4vw, 4.6rem)",
              animation: "pageIn 0.7s ease both",
            }}
          >
            Where music is<br />
            made between<br />
            <em className="not-italic" style={{ color: "rgba(212,163,65,0.9)" }}>real people.</em>
          </h1>

          {/* Sub */}
          <p
            className="text-[14.5px] md:text-[15.5px] font-light leading-[1.75] mb-10 md:mb-11 max-w-[440px]"
            style={{
              color: "rgba(255,255,255,0.52)",
              animation: "pageIn 0.7s ease both",
              animationDelay: "140ms",
            }}
          >
            Intimate creative rooms for musicians, producers, singers and songwriters.
            Drop a hook. Find a collaborator. Make something that matters.
          </p>

          {/* CTAs — primary dominant, secondary quiet */}
          <div
            className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5"
            style={{ animation: "pageIn 0.7s ease both", animationDelay: "220ms" }}
          >
            {/* PRIMARY — the main door in */}
            <Link href="/discover">
              <button
                className="w-full sm:w-auto flex items-center justify-center px-9 rounded-2xl font-semibold transition-all hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]"
                style={{
                  background: "linear-gradient(135deg,#e0b050,#c89030)",
                  color: "#1a0f00",
                  height: "58px",
                  minWidth: "220px",
                  boxShadow: "0 0 32px rgba(212,163,65,0.32), 0 4px 18px rgba(0,0,0,0.4)",
                }}
              >
                <span className="text-[15px] font-bold tracking-wide">Explore rooms</span>
              </button>
            </Link>

            {/* SECONDARY — quiet text link, not a competing button */}
            <Link href="/sign-up">
              <span
                className="cursor-pointer inline-block text-[13px] tracking-wide transition-colors hover:text-white/80 text-center sm:text-left py-3 px-2 -my-3"
                style={{ color: "rgba(255,255,255,0.42)" }}
              >
                or join free
              </span>
            </Link>
          </div>

          {/* Guest access — single calm line, directly under primary action */}
          <p
            className="text-[12.5px] font-light tracking-wide mt-7 md:mt-8"
            style={{
              color: "rgba(255,255,255,0.42)",
              animation: "pageIn 0.6s ease both",
              animationDelay: "320ms",
            }}
          >
            Listen first. Join only if it feels right.
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
