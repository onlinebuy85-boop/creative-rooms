import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import heroImg from "@assets/ChatGPT_Image_26_maj_2026_11_33_28_1779788136339.png";
import logoImg from "../assets/images/creative-rooms-logo-v3.png";

/* ── Live signal chips ─────────────────────────────────────────── */
const LIVE_SIGNALS = [
  { text: "3 hooks dropping right now" },
  { text: "Midnight Frequencies — 1 spot left" },
  { text: "Someone needs a vocalist" },
  { text: "New room forming · Dreamy" },
  { text: "Soul in the Static is live" },
];

function LiveChip({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-1.5 rounded-full shrink-0"
      style={{
        background: "rgba(255,255,255,0.045)",
        border: "1px solid rgba(255,255,255,0.09)",
        backdropFilter: "blur(8px)",
        animation: `pageIn 0.6s ease both`,
        animationDelay: `${delay}ms`,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{
          background: "#4ade80",
          animation: "pulse-dot 2s ease-in-out infinite",
          animationDelay: `${delay * 0.5}ms`,
        }}
      />
      <span
        className="text-[11px] font-light tracking-wide whitespace-nowrap"
        style={{ color: "rgba(255,255,255,0.52)" }}
      >
        {text}
      </span>
    </div>
  );
}

/* ── Floating dust particles ───────────────────────────────────── */
const PARTICLES = [
  { x: 8, y: 72, size: 2, dur: 9, delay: 0 },
  { x: 14, y: 55, size: 1.5, dur: 12, delay: 2 },
  { x: 22, y: 80, size: 1, dur: 8, delay: 4 },
  { x: 5, y: 40, size: 2.5, dur: 14, delay: 1 },
  { x: 30, y: 65, size: 1, dur: 10, delay: 3 },
  { x: 18, y: 30, size: 2, dur: 11, delay: 5 },
  { x: 35, y: 85, size: 1.5, dur: 13, delay: 0.5 },
  { x: 12, y: 20, size: 1, dur: 9, delay: 6 },
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

        {/* Heavy left vignette, lighter right */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(100deg, rgba(5,3,10,0.95) 0%, rgba(5,3,10,0.78) 35%, rgba(5,3,10,0.38) 62%, rgba(5,3,10,0.12) 100%)",
          }}
        />

        {/* Top & bottom fades */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/75" />

        {/* Warm ambient light — breathes slowly */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: "-5%",
            top: "5%",
            width: "55%",
            height: "70%",
            background: "radial-gradient(ellipse at 30% 40%, rgba(180,110,20,0.11) 0%, rgba(140,80,10,0.04) 45%, transparent 70%)",
            animation: "warm-glow 6s ease-in-out infinite",
          }}
        />

        {/* Secondary cool-purple ambient from upper right */}
        <div
          className="absolute pointer-events-none"
          style={{
            right: "15%",
            top: "0%",
            width: "40%",
            height: "50%",
            background: "radial-gradient(ellipse, rgba(80,40,120,0.06) 0%, transparent 65%)",
            animation: "warm-glow 8s ease-in-out infinite",
            animationDelay: "3s",
          }}
        />
      </div>

      {/* ── FLOATING DUST PARTICLES ──────────────────────────── */}
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: `rgba(212,163,65,${0.15 + (i % 3) * 0.1})`,
              animation: `float-up ${p.dur}s ease-in-out infinite`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* ── NAV ─────────────────────────────────────────────── */}
      <header className="relative z-10 flex items-center justify-between px-10 pt-6 max-w-[1280px] mx-auto">

        {/* Brand — deliberately large and iconic */}
        <Link href="/">
          <div className="relative group cursor-pointer">
            {/* Atmospheric warm glow behind waveform */}
            <div
              className="absolute pointer-events-none"
              style={{
                left: -16,
                top: "50%",
                transform: "translateY(-50%)",
                width: 130,
                height: 110,
                background: "radial-gradient(ellipse at 38% 50%, rgba(200,130,20,0.28) 0%, rgba(212,163,65,0.07) 50%, transparent 72%)",
                animation: "warm-glow 4s ease-in-out infinite",
              }}
            />
            <img
              src={logoImg}
              alt="Creative Rooms"
              style={{
                height: 96,
                width: "auto",
                objectFit: "contain",
                position: "relative",
                filter: "brightness(1.2) drop-shadow(0 0 18px rgba(212,163,65,0.45))",
                transition: "filter 0.4s ease, transform 0.3s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLImageElement).style.filter =
                  "brightness(1.4) drop-shadow(0 0 30px rgba(212,163,65,0.75))";
                (e.currentTarget as HTMLImageElement).style.transform = "scale(1.025)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLImageElement).style.filter =
                  "brightness(1.2) drop-shadow(0 0 18px rgba(212,163,65,0.45))";
                (e.currentTarget as HTMLImageElement).style.transform = "scale(1)";
              }}
            />
          </div>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-9">
          {["Rooms", "People", "Inspiration", "About"].map((item, i) => (
            <span
              key={item}
              className="text-[13px] tracking-wide cursor-pointer transition-colors hover:text-white/80"
              style={{
                color: i === 0 ? "rgba(212,163,65,0.9)" : "rgba(255,255,255,0.42)",
                borderBottom: i === 0 ? "1px solid rgba(212,163,65,0.45)" : "none",
                paddingBottom: i === 0 ? "2px" : "0",
              }}
            >
              {item}
            </span>
          ))}
        </nav>

        {/* Auth CTAs */}
        <div className="flex items-center gap-4">
          <Link href="/sign-in">
            <span
              className="text-[13px] tracking-wide cursor-pointer transition-colors hover:text-white"
              style={{ color: "rgba(255,255,255,0.38)" }}
            >
              Log in
            </span>
          </Link>
          <Link href="/sign-up">
            <button
              className="px-5 py-2 rounded-full text-[13px] font-semibold transition-all hover:brightness-110 hover:scale-[1.03]"
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

      {/* ── HERO COPY ────────────────────────────────────────── */}
      <section className="relative z-10 px-10 pt-20 pb-36 max-w-[1280px] mx-auto">
        <div className="max-w-[580px]">

          {/* Live activity chips — subtle platform pulse */}
          <div className="flex flex-wrap gap-2 mb-8">
            {LIVE_SIGNALS.slice(0, 3).map((s, i) => (
              <LiveChip key={i} text={s.text} delay={i * 120} />
            ))}
          </div>

          {/* Headline */}
          <h1
            className="font-serif font-normal leading-[1.06] tracking-tight mb-7 text-white"
            style={{
              fontSize: "clamp(2.7rem, 5.5vw, 4.4rem)",
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
            className="text-[15px] font-light leading-relaxed mb-8 max-w-[430px]"
            style={{
              color: "rgba(255,255,255,0.42)",
              animation: "pageIn 0.8s ease both",
              animationDelay: "350ms",
            }}
          >
            Intimate creative rooms for musicians, producers, singers and songwriters.
            Drop a hook. Find a collaborator. Make something that matters.
          </p>

          {/* CTAs */}
          <div
            className="flex items-center gap-4"
            style={{ animation: "pageIn 0.8s ease both", animationDelay: "500ms" }}
          >
            <Link href="/sign-up">
              <Button
                className="h-12 px-8 rounded-full font-semibold text-[14px] tracking-wide transition-all hover:scale-[1.03] hover:brightness-110"
                style={{
                  background: "linear-gradient(135deg,#e0b050,#c89030)",
                  color: "#1a0f00",
                  border: "none",
                }}
              >
                Find your room
              </Button>
            </Link>
            <Link href="/discover">
              <button
                className="flex items-center gap-2.5 h-12 px-6 rounded-full text-[13px] font-light tracking-wide transition-all hover:bg-white/8"
                style={{
                  border: "1px solid rgba(255,255,255,0.16)",
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Browse sessions
              </button>
            </Link>
          </div>

          {/* More live signals — scrolling below CTAs */}
          <div
            className="flex gap-2 mt-7 overflow-hidden"
            style={{ animation: "pageIn 0.8s ease both", animationDelay: "700ms" }}
          >
            {LIVE_SIGNALS.slice(3).map((s, i) => (
              <LiveChip key={i} text={s.text} delay={800 + i * 120} />
            ))}
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full shrink-0"
              style={{
                background: "rgba(212,163,65,0.06)",
                border: "1px solid rgba(212,163,65,0.14)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#d4a341", animation: "breathe 1.8s ease-in-out infinite" }} />
              <span className="text-[11px] font-light" style={{ color: "rgba(212,163,65,0.6)" }}>
                7 rooms active now
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── MOOD STRIP ───────────────────────────────────────── */}
      <section
        className="relative z-10 border-t border-white/[0.05] px-10 py-7 max-w-[1280px] mx-auto"
        style={{ animation: "pageIn 0.8s ease both", animationDelay: "900ms" }}
      >
        <div className="flex items-center gap-12 flex-wrap">
          {[
            { num: "2–4", label: "creators per room" },
            { num: "Live", label: "voice & text sessions" },
            { num: "∞", label: "hooks waiting" },
          ].map(({ num, label }) => (
            <div key={label} className="flex items-baseline gap-3">
              <span
                className="font-serif text-[2rem] font-light"
                style={{ color: "rgba(212,163,65,0.78)" }}
              >
                {num}
              </span>
              <span
                className="text-[12px] tracking-wide"
                style={{ color: "rgba(255,255,255,0.27)" }}
              >
                {label}
              </span>
            </div>
          ))}

          {/* Faint ambient waveform — rightmost of the strip */}
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
