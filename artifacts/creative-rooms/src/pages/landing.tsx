import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { useUser } from "@clerk/react";
import heroImg from "@assets/ChatGPT_Image_26_maj_2026_11_33_28_1779820980322.png";
import logoImg from "../assets/images/creative-rooms-logo-v4.png";

/* ── More particles for a denser atmospheric field ── */
const PARTICLES = [
  { x: 8,  y: 72, size: 2,   dur: 9,  delay: 0   },
  { x: 14, y: 55, size: 1.5, dur: 12, delay: 2   },
  { x: 22, y: 80, size: 1,   dur: 8,  delay: 4   },
  { x: 5,  y: 40, size: 2.5, dur: 14, delay: 1   },
  { x: 30, y: 65, size: 1,   dur: 10, delay: 3   },
  { x: 18, y: 30, size: 2,   dur: 11, delay: 5   },
  { x: 35, y: 85, size: 1.5, dur: 13, delay: 0.5 },
  { x: 12, y: 20, size: 1,   dur: 9,  delay: 6   },
  { x: 42, y: 48, size: 1.5, dur: 11, delay: 2.5 },
  { x: 28, y: 92, size: 1,   dur: 10, delay: 4.5 },
  { x: 7,  y: 58, size: 2,   dur: 13, delay: 1.5 },
  { x: 38, y: 22, size: 1,   dur: 15, delay: 3.5 },
  { x: 20, y: 14, size: 1.5, dur: 12, delay: 7   },
  { x: 32, y: 44, size: 1,   dur: 9,  delay: 0.8 },
];

/* ── Scroll fade-in ── */
function useFadeIn(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

export function LandingPage() {
  const { isSignedIn } = useUser();
  const manifestoRef = useFadeIn(0.06);
  const featRef      = useFadeIn(0.08);
  const quoteRef     = useFadeIn(0.08);
  const lennonRef    = useFadeIn(0.04);
  const footRef      = useFadeIn(0.05);

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
        {/* Desktop vignette */}
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            background: "linear-gradient(100deg, rgba(5,3,10,0.84) 0%, rgba(5,3,10,0.56) 38%, rgba(5,3,10,0.26) 65%, rgba(5,3,10,0.08) 100%)",
          }}
        />
        {/* Mobile vignette */}
        <div
          className="absolute inset-0 md:hidden"
          style={{
            background: "linear-gradient(180deg, rgba(5,3,10,0.82) 0%, rgba(5,3,10,0.44) 30%, rgba(5,3,10,0.28) 55%, rgba(5,3,10,0.80) 100%)",
          }}
        />
        <div
          className="absolute md:hidden pointer-events-none"
          style={{
            top: 0, left: 0, right: 0, height: "62%",
            background: "linear-gradient(180deg, rgba(5,3,10,0.55) 0%, rgba(5,3,10,0.35) 45%, transparent 100%)",
          }}
        />
        <div className="absolute inset-0 hidden md:block bg-gradient-to-b from-transparent via-transparent to-black/80" />
        {/* Warm ambient lamp glow */}
        <div
          className="absolute pointer-events-none hidden md:block"
          style={{
            left: "-5%", top: "5%", width: "55%", height: "70%",
            background: "radial-gradient(ellipse at 30% 40%, rgba(212,150,40,0.18) 0%, rgba(160,90,15,0.06) 45%, transparent 72%)",
            animation: "warm-glow 8s ease-in-out infinite",
            mixBlendMode: "screen",
          }}
        />
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
        {/* Film grain */}
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
            object-position: 50% 35%;
            filter: saturate(1.1) contrast(1.06) brightness(1.08) !important;
          }
        }
        .cr-landing-logo { height: 32px; }
        @media (min-width: 640px)  { .cr-landing-logo { height: 36px; } }
        @media (min-width: 1024px) { .cr-landing-logo { height: 40px; } }
        @media (min-width: 1280px) { .cr-landing-logo { height: 44px; } }

        .cr-btn-enter {
          background: linear-gradient(135deg,#e0b050,#c89030);
          color: #1a0f00;
          height: 58px;
          min-width: 210px;
          box-shadow: 0 0 34px rgba(212,163,65,0.26), 0 4px 18px rgba(0,0,0,0.4);
          font-weight: 700;
          font-size: 15px;
          letter-spacing: 0.03em;
          border-radius: 16px;
          border: none;
          transition: all 0.32s ease;
          display: flex; align-items: center; justify-content: center;
        }
        .cr-btn-enter:hover {
          box-shadow: 0 0 56px rgba(212,163,65,0.46), 0 6px 28px rgba(0,0,0,0.48);
          transform: scale(1.025);
          filter: brightness(1.1);
        }
        .cr-btn-enter:active { transform: scale(0.98); }

        .cr-nav-link {
          position: relative;
          color: rgba(255,255,255,0.4);
          font-size: 13px;
          letter-spacing: 0.035em;
          cursor: pointer;
          transition: color 0.2s ease;
        }
        .cr-nav-link:hover { color: rgba(255,255,255,0.75); }
        .cr-nav-link::after {
          content: '';
          position: absolute;
          left: 0; bottom: -3px;
          width: 0; height: 1px;
          background: rgba(212,163,65,0.45);
          transition: width 0.25s ease;
        }
        .cr-nav-link:hover::after { width: 100%; }

        .cr-ghost-btn {
          height: 52px;
          padding: 0 32px;
          border-radius: 14px;
          background: rgba(212,163,65,0.07);
          border: 1px solid rgba(212,163,65,0.2);
          color: rgba(212,163,65,0.8);
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.28s ease;
        }
        .cr-ghost-btn:hover {
          background: rgba(212,163,65,0.12);
          border-color: rgba(212,163,65,0.35);
          color: rgba(212,163,65,0.95);
          transform: scale(1.03);
          box-shadow: 0 0 28px rgba(212,163,65,0.15);
        }
      `}</style>

      {/* ── FLOATING DUST ── */}
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`, top: `${p.y}%`,
              width: `${p.size}px`, height: `${p.size}px`,
              background: `rgba(212,163,65,${0.12 + (i % 3) * 0.09})`,
              animation: `float-up ${p.dur}s ease-in-out infinite`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* ── NAV ── */}
      <header className="relative z-10 flex items-center justify-between gap-4 px-5 md:px-10 pt-6 md:pt-8 max-w-[1280px] mx-auto">
        <Link href="/">
          <div className="relative cursor-pointer flex items-center" style={{ isolation: "isolate" }}>
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
              width={924}
              height={177}
              className="cr-landing-logo"
              draggable={false}
              style={{
                width: "auto", objectFit: "contain", position: "relative",
                filter: "saturate(1.1) contrast(1.08)",
                imageRendering: "auto",
              }}
            />
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-9">
          {[
            { label: "Rooms", href: "/discover" },
            { label: "Hooks", href: "/hooks"    },
            { label: "About", href: "/about"    },
          ].map(({ label, href }) => (
            <Link key={label} href={href}>
              <span className="cr-nav-link">{label}</span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4 md:gap-5">
          {isSignedIn ? (
            <Link href="/discover">
              <span
                className="text-[12px] md:text-[13px] tracking-[0.05em] cursor-pointer transition-colors hover:text-amber-400/75"
                style={{ color: "rgba(212,163,65,0.6)" }}
              >
                Go to rooms →
              </span>
            </Link>
          ) : (
            <Link href="/sign-in">
              <span
                className="text-[12px] md:text-[13px] tracking-[0.05em] cursor-pointer transition-colors"
                style={{ color: "rgba(255,255,255,0.38)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.65)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.38)"; }}
              >
                Log in
              </span>
            </Link>
          )}
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative z-10 px-5 md:px-10 pt-20 md:pt-28 pb-16 md:pb-32 max-w-[1280px] mx-auto">
        <div className="max-w-[580px]">

          {/* Eyebrow */}
          <p
            className="text-[10.5px] tracking-[0.22em] uppercase mb-6 font-medium"
            style={{
              color: "rgba(212,163,65,0.52)",
              animation: "pageIn 0.6s ease both",
            }}
          >
            A space for honest music
          </p>

          {/* Headline */}
          <h1
            className="font-serif font-normal leading-[1.06] tracking-tight mb-7 md:mb-9 text-white"
            style={{
              fontSize: "clamp(2.5rem, 5.6vw, 4.8rem)",
              animation: "pageIn 0.7s ease both",
              animationDelay: "70ms",
            }}
          >
            Where music is<br />
            made between<br />
            <em className="not-italic" style={{ color: "rgba(212,163,65,0.9)" }}>real people.</em>
          </h1>

          {/* Sub */}
          <p
            className="text-[14.5px] md:text-[15.5px] font-light leading-[1.82] mb-10 md:mb-12 max-w-[420px]"
            style={{
              color: "rgba(255,255,255,0.46)",
              animation: "pageIn 0.7s ease both",
              animationDelay: "150ms",
            }}
          >
            Intimate rooms for musicians, producers, and songwriters.
            Two to four people. No audience. Just the work.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6"
            style={{ animation: "pageIn 0.7s ease both", animationDelay: "240ms" }}
          >
            <Link href="/discover">
              <button className="cr-btn-enter w-full sm:w-auto">
                Enter the room
              </button>
            </Link>
          </div>

        </div>
      </section>

      {/* ── MANIFESTO ── quiet brand statement, cinematic ── */}
      <div ref={manifestoRef.ref}>
        <section
          className="relative z-10 px-5 md:px-10 py-24 md:py-44 text-center overflow-hidden"
          style={{
            opacity:    manifestoRef.visible ? 1 : 0,
            transform:  manifestoRef.visible ? "translateY(0)" : "translateY(36px)",
            transition: "opacity 1.4s cubic-bezier(0.16,1,0.3,1), transform 1.4s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          {/* Ambient glow — wide, warm, very faint */}
          <div
            className="absolute pointer-events-none"
            style={{
              left: "50%", top: "50%",
              width: "min(900px, 100vw)", height: 560,
              transform: "translate(-50%, -50%)",
              background: "radial-gradient(ellipse, rgba(212,140,40,0.065) 0%, rgba(160,90,15,0.022) 48%, transparent 72%)",
              animation: "warm-glow 16s ease-in-out infinite",
            }}
          />

          {/* Top hairline */}
          <div
            className="mx-auto mb-16 md:mb-24"
            style={{
              width: 56,
              height: 1,
              background: "linear-gradient(90deg, transparent, rgba(212,163,65,0.32), transparent)",
            }}
          />

          <div className="relative max-w-[740px] mx-auto">
            {/* The statement — large, breathing, serif */}
            <p
              className="font-serif font-normal leading-[1.28] tracking-tight"
              style={{
                fontSize: "clamp(1.8rem, 4vw, 3.5rem)",
                color: "rgba(255,255,255,0.87)",
                opacity:    manifestoRef.visible ? 1 : 0,
                transition: "opacity 1.2s ease 120ms",
              }}
            >
              Creative Room is a home for musicians and creative people
              looking for inspiration, collaboration, and{" "}
              <em
                className="not-italic"
                style={{ color: "rgba(212,163,65,0.84)" }}
              >
                real human connection through music.
              </em>
            </p>

            {/* Micro-copy — quiet, italic, muted */}
            <p
              className="text-[13px] md:text-[14.5px] font-light leading-[1.9] mt-9 md:mt-11 max-w-[440px] mx-auto"
              style={{
                color: "rgba(255,255,255,0.25)",
                fontStyle: "italic",
                opacity:    manifestoRef.visible ? 1 : 0,
                transition: "opacity 1.2s ease 480ms",
              }}
            >
              Not another music app. A place where unfinished ideas become something real together.
            </p>
          </div>

          {/* Bottom hairline */}
          <div
            className="mx-auto mt-16 md:mt-24"
            style={{
              width: 56,
              height: 1,
              background: "linear-gradient(90deg, transparent, rgba(212,163,65,0.18), transparent)",
            }}
          />
        </section>
      </div>

      {/* ── WHAT THIS IS ── emotional, honest ── */}
      <div ref={featRef.ref}>
        <section
          className="relative z-10 border-t px-5 md:px-10 py-12 md:py-16 max-w-[1280px] mx-auto"
          style={{
            borderColor: "rgba(255,255,255,0.04)",
            opacity: featRef.visible ? 1 : 0,
            transform: featRef.visible ? "translateY(0)" : "translateY(22px)",
            transition: "opacity 0.95s ease, transform 0.95s ease",
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
            {[
              {
                label: "Just people",
                sub: "Two to four creators. No crowd. No noise. The right size for real work.",
                icon: (
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="rgba(212,163,65,0.68)" strokeWidth="1.5" strokeLinecap="round">
                    <circle cx="9" cy="7" r="4" /><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" /><path d="M16 3.13a4 4 0 0 1 0 7.75M21 21v-2a4 4 0 0 0-3-3.87" />
                  </svg>
                ),
              },
              {
                label: "Actually live",
                sub: "Voice, chat, and shared takes. Not async. Not delayed. Right now, together.",
                icon: (
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="rgba(212,163,65,0.68)" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
                  </svg>
                ),
              },
              {
                label: "Drop a fragment",
                sub: "The half-finished riff. The lyric at 2am. The melody you can't stop humming.",
                icon: (
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="rgba(212,163,65,0.68)" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M3 18v-6a9 9 0 0 1 18 0v6" /><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z" /><path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                  </svg>
                ),
              },
              {
                label: "Nothing to perform for",
                sub: "No likes. No followers. No algorithm watching. Just you and the music.",
                icon: (
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="rgba(212,163,65,0.68)" strokeWidth="1.5" strokeLinecap="round">
                    <circle cx="12" cy="12" r="9" /><path d="M8 12h8" />
                  </svg>
                ),
              },
            ].map(({ label, sub, icon }, i) => (
              <div
                key={label}
                className="flex flex-col group"
                style={{
                  opacity: featRef.visible ? 1 : 0,
                  transform: featRef.visible ? "translateY(0)" : "translateY(16px)",
                  transition: `opacity 0.8s ease ${i * 100}ms, transform 0.8s ease ${i * 100}ms`,
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-110 group-hover:border-amber-400/20"
                  style={{
                    background: "rgba(212,163,65,0.055)",
                    border: "1px solid rgba(212,163,65,0.1)",
                  }}
                >
                  {icon}
                </div>
                <p className="text-[13px] font-medium mb-2" style={{ color: "rgba(255,255,255,0.80)" }}>
                  {label}
                </p>
                <p className="text-[12px] font-light leading-[1.75]" style={{ color: "rgba(255,255,255,0.34)" }}>
                  {sub}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── PAYOFF ── real, grounded, story-driven ── */}
      <div ref={quoteRef.ref}>
        <section
          className="relative z-10 px-5 md:px-10 py-24 md:py-36 text-center overflow-hidden"
          style={{
            opacity: quoteRef.visible ? 1 : 0,
            transform: quoteRef.visible ? "translateY(0)" : "translateY(28px)",
            transition: "opacity 1.1s ease, transform 1.1s ease",
          }}
        >
          {/* Ambient glow — subtle, warm */}
          <div
            className="absolute pointer-events-none"
            style={{
              left: "50%", top: "50%",
              width: 600, height: 440,
              transform: "translate(-50%, -50%)",
              background: "radial-gradient(ellipse, rgba(212,163,65,0.04) 0%, transparent 68%)",
              animation: "warm-glow 12s ease-in-out infinite",
            }}
          />

          <div className="relative max-w-[520px] mx-auto">

            {/* Two-line story — large serif, staggered */}
            <p
              className="font-serif font-normal leading-[1.15] tracking-tight"
              style={{
                fontSize: "clamp(2rem, 4.6vw, 3.9rem)",
                color: "rgba(255,255,255,0.88)",
                opacity: quoteRef.visible ? 1 : 0,
                transition: "opacity 1.0s ease 80ms",
              }}
            >
              Some rooms last one night.
            </p>
            <p
              className="font-serif font-normal leading-[1.15] tracking-tight mt-1"
              style={{
                fontSize: "clamp(2rem, 4.6vw, 3.9rem)",
                color: "rgba(212,163,65,0.82)",
                opacity: quoteRef.visible ? 1 : 0,
                transition: "opacity 1.0s ease 260ms",
              }}
            >
              Some become bands.
            </p>

            {/* Grounded supporting line */}
            <p
              className="text-[13.5px] md:text-[15px] font-light leading-[1.9] mt-10 max-w-[340px] mx-auto"
              style={{
                color: "rgba(255,255,255,0.26)",
                opacity: quoteRef.visible ? 1 : 0,
                transition: "opacity 1.0s ease 420ms",
              }}
            >
              The best ideas usually arrive unfinished.
              This is where they find each other.
            </p>

            {/* CTAs */}
            <div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12"
              style={{
                opacity: quoteRef.visible ? 1 : 0,
                transition: "opacity 1.0s ease 580ms",
              }}
            >
              <Link href="/sign-up">
                <button className="cr-ghost-btn">Find your people</button>
              </Link>
              <Link href="/discover">
                <span
                  className="cursor-pointer text-[13px] tracking-[0.04em] transition-colors hover:text-white/50"
                  style={{ color: "rgba(255,255,255,0.24)" }}
                >
                  or explore sessions →
                </span>
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* ── LENNON QUOTE ── discovered, not announced ── */}
      <div ref={lennonRef.ref}>
        <div
          className="relative z-10 flex flex-col items-center px-5 py-16 md:py-20"
          style={{
            opacity:    lennonRef.visible ? 1 : 0,
            transition: "opacity 2s ease",
          }}
        >
          {/* Tiny waveform — muted gold, no motion */}
          <div className="flex items-end gap-[2.5px] mb-7" style={{ height: 12 }}>
            {[4, 7, 5, 10, 7, 12, 8, 10, 6, 8, 4, 7, 5].map((h, i) => (
              <div
                key={i}
                className="rounded-full"
                style={{
                  width: 1.5,
                  height: h,
                  background: "rgba(212,163,65,0.22)",
                }}
              />
            ))}
          </div>

          {/* The quote */}
          <blockquote className="text-center max-w-[380px]">
            <p
              className="font-serif font-normal leading-[1.65] tracking-wide"
              style={{
                fontSize: "clamp(0.82rem, 1.6vw, 0.95rem)",
                color: "rgba(255, 240, 200, 0.42)",
                fontStyle: "italic",
              }}
            >
              "Music is everybody's possession."
            </p>
            <footer
              className="mt-4 text-[10.5px] tracking-[0.14em] uppercase"
              style={{ color: "rgba(255,255,255,0.18)" }}
            >
              — John Lennon
            </footer>
          </blockquote>
        </div>
      </div>

      {/* ── CLOSING LINE ── */}
      <div ref={footRef.ref}>
        <section
          className="relative z-10 border-t px-5 md:px-10 py-9 max-w-[1280px] mx-auto"
          style={{
            borderColor: "rgba(255,255,255,0.03)",
            opacity: footRef.visible ? 1 : 0,
            transition: "opacity 1.2s ease",
          }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
            <p
              className="text-[11.5px] font-light tracking-[0.08em]"
              style={{ color: "rgba(255,255,255,0.18)", fontStyle: "italic" }}
            >
              The room is always open.
            </p>
            <div className="flex items-center gap-7">
              {[
                { label: "Rooms", href: "/discover" },
                { label: "Hooks", href: "/hooks"    },
                { label: "About", href: "/about"    },
              ].map(({ label, href }) => (
                <Link key={label} href={href}>
                  <span
                    className="text-[12px] tracking-wide cursor-pointer transition-colors hover:text-white/40"
                    style={{ color: "rgba(255,255,255,0.18)" }}
                  >
                    {label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
