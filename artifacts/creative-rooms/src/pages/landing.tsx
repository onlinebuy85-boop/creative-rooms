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

/* ── Avatar cluster ── */
const AVATAR_COLORS = ["#7c4a1e","#1e3a5f","#4a1d6e","#14532d","#7f1d1d"];
function AvatarCluster({ count = 4 }: { count?: number }) {
  return (
    <div className="flex -space-x-2">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="w-7 h-7 rounded-full border-[1.5px] flex-shrink-0"
          style={{
            background: AVATAR_COLORS[i % AVATAR_COLORS.length],
            borderColor: "rgba(8,5,14,0.9)",
            boxShadow: "0 1px 4px rgba(0,0,0,0.4)",
          }}
        />
      ))}
    </div>
  );
}

/* ── Live activity card (desktop right panel + mobile list) ── */
interface ActivityCardProps {
  dot?: string;
  label: string;
  sub: string;
  avatars?: number;
  delay?: number;
}
function ActivityCard({ dot = "#4ade80", label, sub, avatars = 3, delay = 0 }: ActivityCardProps) {
  return (
    <div
      className="flex items-center justify-between gap-4 px-4 py-3 rounded-xl"
      style={{
        background: "rgba(8,5,14,0.78)",
        border: "1px solid rgba(255,255,255,0.10)",
        backdropFilter: "blur(16px)",
        animation: "pageIn 0.7s ease both",
        animationDelay: `${delay}ms`,
        minWidth: 240,
      }}
    >
      <div className="flex items-start gap-2.5 min-w-0">
        <span
          className="mt-0.5 w-2 h-2 rounded-full flex-shrink-0"
          style={{ background: dot, animation: "pulse-dot 2.4s ease-in-out infinite", animationDelay: `${delay * 0.5}ms` }}
        />
        <div className="min-w-0">
          <p className="text-[12px] font-medium text-white/85 leading-tight truncate">{label}</p>
          <p className="text-[11px] font-light leading-tight mt-0.5 truncate" style={{ color: "rgba(255,255,255,0.38)" }}>{sub}</p>
        </div>
      </div>
      <AvatarCluster count={avatars} />
    </div>
  );
}

/* ── Feature pillar icon ── */
function PillarIcon({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
      style={{ background: "rgba(212,163,65,0.08)", border: "1px solid rgba(212,163,65,0.14)" }}
    >
      {children}
    </div>
  );
}

/* ── Live activity data ── */
const ACTIVITY = [
  { label: "A room is forming",     sub: "2 producers joining",         dot: "#4ade80", avatars: 2 },
  { label: "Late-night session",    sub: "Session active now",          dot: "#4ade80", avatars: 3 },
  { label: "Live recording",        sub: "Someone just dropped a hook", dot: "#fbbf24", avatars: 2 },
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
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(100deg, rgba(5,3,10,0.97) 0%, rgba(5,3,10,0.82) 38%, rgba(5,3,10,0.42) 65%, rgba(5,3,10,0.1) 100%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/80" />
        <div
          className="absolute pointer-events-none"
          style={{
            left: "-5%", top: "5%", width: "55%", height: "70%",
            background: "radial-gradient(ellipse at 30% 40%, rgba(180,110,20,0.12) 0%, rgba(140,80,10,0.04) 45%, transparent 70%)",
            animation: "warm-glow 6s ease-in-out infinite",
          }}
        />
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
        <Link href="/">
          <div className="relative group cursor-pointer">
            <div
              className="absolute pointer-events-none"
              style={{
                left: -20, top: "50%", transform: "translateY(-50%)",
                width: 220, height: 130,
                background: "radial-gradient(ellipse at 30% 50%, rgba(200,120,15,0.42) 0%, rgba(212,163,65,0.12) 45%, transparent 70%)",
                animation: "warm-glow 3.5s ease-in-out infinite",
              }}
            />
            <div
              className="absolute pointer-events-none"
              style={{
                left: -4, top: "50%", transform: "translateY(-50%)",
                width: 90, height: 70,
                background: "radial-gradient(ellipse at 35% 50%, rgba(212,163,65,0.22) 0%, transparent 65%)",
                animation: "breathe 2.2s ease-in-out infinite",
                animationDelay: "0.8s",
              }}
            />
            <img
              src={logoImg}
              alt="Creative Rooms"
              style={{
                width: "clamp(200px, 26vw, 310px)",
                height: "auto",
                objectFit: "contain",
                position: "relative",
                filter: "brightness(1.5) drop-shadow(0 0 30px rgba(212,163,65,0.75)) drop-shadow(0 0 10px rgba(212,163,65,0.45))",
                transition: "filter 0.4s ease, transform 0.3s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLImageElement).style.filter =
                  "brightness(1.7) drop-shadow(0 0 44px rgba(212,163,65,0.92)) drop-shadow(0 0 14px rgba(212,163,65,0.6))";
                (e.currentTarget as HTMLImageElement).style.transform = "scale(1.025)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLImageElement).style.filter =
                  "brightness(1.5) drop-shadow(0 0 30px rgba(212,163,65,0.75)) drop-shadow(0 0 10px rgba(212,163,65,0.45))";
                (e.currentTarget as HTMLImageElement).style.transform = "scale(1)";
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
              style={{ color: "rgba(255,255,255,0.35)" }}
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

      {/* ── HERO SECTION ── */}
      <section className="relative z-10 px-5 md:px-10 pt-8 md:pt-16 pb-16 md:pb-28 max-w-[1280px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10 md:gap-6">

          {/* ── LEFT: Copy column ── */}
          <div className="max-w-[520px]">

            {/* LIVE NOW bar */}
            <div
              className="inline-flex items-center gap-2.5 mb-7 md:mb-8"
              style={{ animation: "pageIn 0.5s ease both", animationDelay: "0ms" }}
            >
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                style={{
                  background: "rgba(74,222,128,0.08)",
                  border: "1px solid rgba(74,222,128,0.2)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: "#4ade80", animation: "pulse-dot 2s ease-in-out infinite" }}
                />
                <span className="text-[11px] font-semibold tracking-widest uppercase" style={{ color: "rgba(74,222,128,0.85)" }}>
                  Live Now
                </span>
              </div>
              <span className="text-[12px] font-light" style={{ color: "rgba(255,255,255,0.32)" }}>
                Sessions active around the world
              </span>
            </div>

            {/* Headline */}
            <h1
              className="font-serif font-normal leading-[1.06] tracking-tight mb-5 md:mb-6 text-white"
              style={{
                fontSize: "clamp(2.5rem, 5.5vw, 4.5rem)",
                animation: "pageIn 0.7s ease both",
                animationDelay: "80ms",
              }}
            >
              Where music is<br />
              made between<br />
              <em className="not-italic" style={{ color: "rgba(212,163,65,0.9)" }}>real people.</em>
            </h1>

            {/* Sub */}
            <p
              className="text-[14px] md:text-[15px] font-light leading-relaxed mb-8 max-w-[400px]"
              style={{
                color: "rgba(255,255,255,0.42)",
                animation: "pageIn 0.7s ease both",
                animationDelay: "160ms",
              }}
            >
              Intimate creative rooms for musicians, producers, singers and songwriters.
              Drop a hook. Find a collaborator. Make something that matters.
            </p>

            {/* CTAs */}
            <div
              className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5"
              style={{ animation: "pageIn 0.7s ease both", animationDelay: "240ms" }}
            >
              {/* PRIMARY: Explore rooms — no login needed */}
              <Link href="/discover">
                <button
                  className="w-full sm:w-auto flex flex-col items-center justify-center gap-0.5 px-8 rounded-2xl font-semibold transition-all hover:scale-[1.03] hover:brightness-110 active:scale-[0.98]"
                  style={{
                    background: "linear-gradient(135deg,#e0b050,#c89030)",
                    color: "#1a0f00",
                    height: "60px",
                    minWidth: "180px",
                    boxShadow: "0 0 36px rgba(212,163,65,0.36), 0 4px 22px rgba(0,0,0,0.45)",
                  }}
                >
                  <span className="text-[14px] font-bold tracking-wide">Explore rooms</span>
                  <span className="text-[10px] font-medium opacity-60 tracking-wide">No signup needed to explore</span>
                </button>
              </Link>

              {/* SECONDARY: Join free — ghost */}
              <Link href="/sign-up">
                <button
                  className="w-full sm:w-auto flex items-center justify-center px-8 rounded-2xl font-medium text-[14px] tracking-wide transition-all hover:bg-white/8 hover:border-white/25 active:scale-[0.98]"
                  style={{
                    height: "60px",
                    minWidth: "140px",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "rgba(255,255,255,0.72)",
                    background: "rgba(255,255,255,0.04)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  Join free
                </button>
              </Link>
            </div>

            {/* Tagline */}
            <p
              className="text-[12px] font-light tracking-wide mb-8"
              style={{
                color: "rgba(255,255,255,0.28)",
                animation: "pageIn 0.6s ease both",
                animationDelay: "320ms",
              }}
            >
              Listen first. Join when it feels right.
            </p>

            {/* Social proof */}
            <div
              className="flex items-center gap-3"
              style={{ animation: "pageIn 0.6s ease both", animationDelay: "380ms" }}
            >
              <AvatarCluster count={4} />
              <div>
                <p className="text-[12px] font-light" style={{ color: "rgba(255,255,255,0.6)" }}>
                  People are connecting worldwide
                </p>
                <p className="text-[11px] font-light mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                  Tokyo • London • LA • Stockholm • São Paulo
                </p>
              </div>
            </div>

            {/* Mobile-only: activity cards */}
            <div
              className="md:hidden flex flex-col gap-2.5 mt-8"
              style={{ animation: "pageIn 0.6s ease both", animationDelay: "420ms" }}
            >
              {ACTIVITY.map((a, i) => (
                <ActivityCard key={i} {...a} delay={420 + i * 50} />
              ))}
            </div>
          </div>

          {/* ── RIGHT: Activity cards — desktop only ── */}
          <div
            className="hidden md:flex flex-col gap-3 flex-shrink-0"
            style={{ animation: "pageIn 0.6s ease both", animationDelay: "300ms" }}
          >
            {ACTIVITY.map((a, i) => (
              <ActivityCard key={i} {...a} delay={300 + i * 80} />
            ))}
          </div>

        </div>
      </section>

      {/* ── FEATURE PILLARS ── */}
      <section
        className="relative z-10 border-t border-white/[0.05] px-5 md:px-10 py-8 md:py-10 max-w-[1280px] mx-auto"
        style={{ animation: "pageIn 0.6s ease both", animationDelay: "450ms" }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {[
            {
              label: "Real-time rooms",
              sub: "Jump in. Listen. Create.",
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(212,163,65,0.75)" strokeWidth="1.6" strokeLinecap="round">
                  <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
                </svg>
              ),
            },
            {
              label: "Share hooks",
              sub: "Drop ideas. Get inspired.",
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(212,163,65,0.75)" strokeWidth="1.6" strokeLinecap="round">
                  <path d="M9 12a3 3 0 1 0 6 0 3 3 0 0 0-6 0" /><path d="M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1M5.6 18.4l2.1-2.1m8.6-8.6 2.1-2.1" />
                </svg>
              ),
            },
            {
              label: "Find collaborators",
              sub: "Connect with real humans.",
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(212,163,65,0.75)" strokeWidth="1.6" strokeLinecap="round">
                  <circle cx="9" cy="7" r="4" /><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" /><path d="M16 3.13a4 4 0 0 1 0 7.75M21 21v-2a4 4 0 0 0-3-3.87" />
                </svg>
              ),
            },
            {
              label: "Global community",
              sub: "One room. Many worlds.",
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(212,163,65,0.75)" strokeWidth="1.6" strokeLinecap="round">
                  <circle cx="12" cy="12" r="9" /><path d="M12 3c-2 3-3 5.5-3 9s1 6 3 9M12 3c2 3 3 5.5 3 9s-1 6-3 9M3 12h18" />
                </svg>
              ),
            },
          ].map(({ label, sub, icon }) => (
            <div key={label} className="flex flex-col">
              <PillarIcon>{icon}</PillarIcon>
              <p className="text-[13px] font-medium text-white/80 mb-1">{label}</p>
              <p className="text-[11px] font-light" style={{ color: "rgba(255,255,255,0.3)" }}>{sub}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
