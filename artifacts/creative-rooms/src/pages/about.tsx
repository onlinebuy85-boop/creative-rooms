import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import logoImg from "../assets/images/creative-rooms-logo-v3.png";

/* ── Floating dust particles ── */
const PARTICLES = [
  { x: 12,  y: 15, size: 1.5, dur: 11, delay: 0 },
  { x: 78,  y: 8,  size: 1,   dur: 14, delay: 2 },
  { x: 25,  y: 42, size: 2,   dur: 9,  delay: 4 },
  { x: 88,  y: 35, size: 1.5, dur: 12, delay: 1 },
  { x: 5,   y: 68, size: 1,   dur: 10, delay: 3 },
  { x: 92,  y: 72, size: 2,   dur: 13, delay: 5 },
  { x: 45,  y: 20, size: 1,   dur: 8,  delay: 2.5 },
  { x: 65,  y: 85, size: 1.5, dur: 11, delay: 0.5 },
  { x: 18,  y: 90, size: 1,   dur: 15, delay: 6 },
  { x: 55,  y: 55, size: 2,   dur: 10, delay: 1.5 },
];

/* ── Fade-in on scroll hook ── */
function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return { ref, visible };
}

/* ── Fading text block ── */
function FadeBlock({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useFadeIn();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.9s ease ${delay}ms, transform 0.9s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ── Stanza — short poetic lines ── */
function Stanza({ lines }: { lines: string[] }) {
  const { ref, visible } = useFadeIn();
  return (
    <div ref={ref} className="space-y-2">
      {lines.map((line, i) => (
        <p
          key={i}
          className="text-[16px] md:text-[18px] font-light leading-relaxed"
          style={{
            color: "rgba(255,255,255,0.55)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: `opacity 0.8s ease ${i * 120}ms, transform 0.8s ease ${i * 120}ms`,
          }}
        >
          {line}
        </p>
      ))}
    </div>
  );
}

/* ── Breathing waveform ornament ── */
function WaveOrnament({ opacity = 0.18 }: { opacity?: number }) {
  const bars = [4,7,5,9,6,10,4,8,5,7,9,4,6,8,5,7,4,9,6,5,8,4,7,5];
  return (
    <div className="flex items-end gap-[3px]" style={{ height: 28, opacity }}>
      {bars.map((h, i) => (
        <div
          key={i}
          className="rounded-full"
          style={{
            width: 2.5,
            height: `${h * 10}%`,
            background: "#d4a341",
            animation: `breathe ${2 + (i % 6) * 0.35}s ease-in-out infinite`,
            animationDelay: `${i * 0.08}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════
   ABOUT PAGE
══════════════════════════════════════════ */
export function AboutPage() {
  return (
    <div
      className="relative w-full overflow-x-hidden"
      style={{ minHeight: "100dvh", background: "#07050c" }}
    >
      {/* ── Ambient light layers ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Deep warm pool from upper-left */}
        <div
          className="absolute"
          style={{
            left: "-10%", top: "-5%",
            width: "60%", height: "50%",
            background: "radial-gradient(ellipse at 30% 30%, rgba(160,90,10,0.12) 0%, rgba(120,60,5,0.05) 45%, transparent 70%)",
            animation: "warm-glow 7s ease-in-out infinite",
          }}
        />
        {/* Cool purple from right */}
        <div
          className="absolute"
          style={{
            right: "-5%", top: "20%",
            width: "40%", height: "40%",
            background: "radial-gradient(ellipse, rgba(70,30,100,0.07) 0%, transparent 65%)",
            animation: "warm-glow 10s ease-in-out infinite",
            animationDelay: "4s",
          }}
        />
        {/* Gold warmth at bottom */}
        <div
          className="absolute"
          style={{
            left: "20%", bottom: "5%",
            width: "60%", height: "35%",
            background: "radial-gradient(ellipse at 50% 80%, rgba(180,110,20,0.08) 0%, transparent 65%)",
            animation: "warm-glow 8s ease-in-out infinite",
            animationDelay: "2s",
          }}
        />
        {/* Gradient fade — top dark, mid warm, bottom dark */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, rgba(7,5,12,0.9) 0%, rgba(7,5,12,0.3) 30%, rgba(20,12,5,0.1) 60%, rgba(7,5,12,0.8) 100%)",
          }}
        />
      </div>

      {/* ── Floating particles ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: `rgba(212,163,65,${0.12 + (i % 3) * 0.08})`,
              animation: `float-up ${p.dur}s ease-in-out infinite`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* ── Nav ── */}
      <header
        className="relative z-10 flex items-center justify-between px-6 md:px-10 pt-6 max-w-[960px] mx-auto"
        style={{ animation: "pageIn 0.6s ease both" }}
      >
        <Link href="/">
          <img
            src={logoImg}
            alt="Creative Rooms"
            style={{
              height: 52,
              width: "auto",
              objectFit: "contain",
              filter: "brightness(1.15) drop-shadow(0 0 12px rgba(212,163,65,0.35))",
              transition: "filter 0.3s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLImageElement).style.filter =
                "brightness(1.35) drop-shadow(0 0 22px rgba(212,163,65,0.65))";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLImageElement).style.filter =
                "brightness(1.15) drop-shadow(0 0 12px rgba(212,163,65,0.35))";
            }}
          />
        </Link>
        <div className="flex items-center gap-5">
          <Link href="/discover">
            <span
              className="text-[13px] tracking-wide cursor-pointer transition-colors hover:text-white"
              style={{ color: "rgba(255,255,255,0.38)" }}
            >
              Rooms
            </span>
          </Link>
          <Link href="/sign-up">
            <button
              className="px-5 py-2 rounded-full text-[12px] font-semibold transition-all hover:brightness-110"
              style={{ background: "linear-gradient(135deg,#e0b050,#c89030)", color: "#1a0f00" }}
            >
              Join free
            </button>
          </Link>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="relative z-10 px-6 md:px-10 max-w-[720px] mx-auto">

        {/* ── Hero heading ── */}
        <div
          className="pt-16 md:pt-24 pb-12 md:pb-16"
          style={{ animation: "pageIn 0.8s ease both", animationDelay: "100ms" }}
        >
          {/* Eyebrow */}
          <p
            className="text-[11px] tracking-[0.25em] uppercase mb-8 font-light"
            style={{ color: "rgba(212,163,65,0.55)" }}
          >
            Creative Rooms
          </p>

          {/* Big serif headline */}
          <h1
            className="font-serif font-normal leading-[1.05] tracking-tight text-white mb-6"
            style={{ fontSize: "clamp(2.4rem, 6vw, 4rem)" }}
          >
            About<br />
            <em className="not-italic" style={{ color: "rgba(212,163,65,0.82)" }}>Creative Rooms</em>
          </h1>

          {/* Waveform ornament */}
          <WaveOrnament opacity={0.25} />
        </div>

        {/* ── Body — Section 1: What it isn't ── */}
        <div className="space-y-10 md:space-y-14">

          <FadeBlock>
            <div className="space-y-4">
              <p className="text-[16px] md:text-[18px] font-light leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                Creative Rooms is not a social media platform.
              </p>
              <p className="text-[16px] md:text-[18px] font-light leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                It's not an algorithm.
              </p>
              <p className="text-[16px] md:text-[18px] font-light leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                It's not about chasing streams, trends, or perfection.
              </p>
            </div>
          </FadeBlock>

          {/* ── Divider ── */}
          <FadeBlock delay={80}>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
              <div className="w-1 h-1 rounded-full" style={{ background: "rgba(212,163,65,0.35)", animation: "breathe 2s ease-in-out infinite" }} />
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
            </div>
          </FadeBlock>

          {/* ── What it is ── */}
          <FadeBlock delay={100}>
            <p
              className="font-serif font-normal leading-[1.2] tracking-tight"
              style={{
                fontSize: "clamp(1.4rem, 3.5vw, 2rem)",
                color: "rgba(255,255,255,0.88)",
              }}
            >
              Creative Rooms is a space for real people to create real music together.
            </p>
          </FadeBlock>

          <FadeBlock delay={60}>
            <p className="text-[16px] md:text-[18px] font-light leading-relaxed" style={{ color: "rgba(255,255,255,0.48)" }}>
              A place where unfinished ideas, late-night thoughts, melodies, voice notes, lyrics, hooks, textures, and emotions can meet another human being — somewhere in the signal between strangers.
            </p>
          </FadeBlock>

          <FadeBlock delay={80}>
            <p className="text-[16px] md:text-[18px] font-light leading-relaxed italic" style={{ color: "rgba(255,255,255,0.38)" }}>
              Because the best songs rarely come from isolation.
              <br />
              They happen between people.
            </p>
          </FadeBlock>

          {/* ── Poetic stanza: the sequence ── */}
          <FadeBlock delay={50}>
            <div
              className="px-6 py-7 rounded-3xl relative overflow-hidden"
              style={{
                background: "linear-gradient(155deg, rgba(212,163,65,0.05) 0%, rgba(10,8,16,0.7) 100%)",
                border: "1px solid rgba(212,163,65,0.1)",
              }}
            >
              {/* Ambient glow inside */}
              <div
                className="absolute -top-8 -left-8 w-32 h-32 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(212,163,65,0.1) 0%, transparent 70%)" }}
              />
              <Stanza lines={[
                "A hook dropped into the world.",
                "A producer hearing something in it.",
                "A vocalist joining unexpectedly.",
                "A room forming in real time.",
                "A feeling turning into a song.",
              ]} />
            </div>
          </FadeBlock>

          <FadeBlock delay={70}>
            <p
              className="font-serif font-normal leading-relaxed"
              style={{
                fontSize: "clamp(1.15rem, 2.8vw, 1.5rem)",
                color: "rgba(255,255,255,0.72)",
              }}
            >
              That's what Creative Rooms is built for.
            </p>
          </FadeBlock>

          {/* ── Three pillars ── */}
          <FadeBlock delay={60}>
            <div className="space-y-3">
              {[
                "Small rooms.",
                "Real collaboration.",
                "Human energy over algorithms.",
              ].map((line, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: "#d4a341", opacity: 0.6, animation: `breathe ${2 + i * 0.4}s ease-in-out infinite` }}
                  />
                  <p
                    className="text-[16px] md:text-[18px] font-light"
                    style={{ color: "rgba(255,255,255,0.6)" }}
                  >
                    {line}
                  </p>
                </div>
              ))}
            </div>
          </FadeBlock>

          {/* ── Divider ── */}
          <FadeBlock delay={80}>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
              <WaveOrnament opacity={0.15} />
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
            </div>
          </FadeBlock>

          {/* ── Who it's for ── */}
          <FadeBlock delay={70}>
            <p className="text-[16px] md:text-[18px] font-light leading-relaxed" style={{ color: "rgba(255,255,255,0.48)" }}>
              Whether you are a songwriter, producer, singer, musician, or someone with only a raw idea on your phone — you can enter a room, share something unfinished, and create with others who feel the same frequency.
            </p>
          </FadeBlock>

          {/* ── No pressure stanza ── */}
          <FadeBlock delay={60}>
            <div className="space-y-3">
              {[
                "No pressure to perform.",
                "No fake numbers.",
                "No polished industry walls.",
              ].map((line, i) => (
                <p
                  key={i}
                  className="text-[16px] md:text-[18px] font-light"
                  style={{ color: "rgba(255,255,255,0.38)", fontStyle: "italic" }}
                >
                  {line}
                </p>
              ))}
            </div>
          </FadeBlock>

          {/* ── Just signals ── */}
          <FadeBlock delay={80}>
            <div
              className="space-y-2 py-4"
              style={{ borderLeft: "2px solid rgba(212,163,65,0.2)", paddingLeft: "1.5rem" }}
            >
              {["Just signals.", "People.", "Music becoming real together."].map((line, i) => (
                <p
                  key={i}
                  className="font-serif font-normal"
                  style={{
                    fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)",
                    color: i === 2 ? "rgba(212,163,65,0.75)" : "rgba(255,255,255,0.65)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {line}
                </p>
              ))}
            </div>
          </FadeBlock>

          {/* ── Divider ── */}
          <FadeBlock delay={80}>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
              <div className="w-1 h-1 rounded-full" style={{ background: "rgba(212,163,65,0.35)", animation: "breathe 2.4s ease-in-out infinite" }} />
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
            </div>
          </FadeBlock>

          {/* ── Before the release ── */}
          <FadeBlock delay={70}>
            <p className="text-[15px] md:text-[17px] font-light leading-relaxed" style={{ color: "rgba(255,255,255,0.38)" }}>
              Creative Rooms exists for the moments that happen before the release.
              Before the mastering.
              Before the world hears the song.
            </p>
          </FadeBlock>

          {/* ── Final poetic close ── */}
          <FadeBlock delay={60}>
            <div className="space-y-3 pb-2">
              {["The fragile beginning.", "The spark.", "The room where it starts."].map((line, i) => (
                <p
                  key={i}
                  className="font-serif font-normal"
                  style={{
                    fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
                    color: i === 2 ? "rgba(212,163,65,0.72)" : "rgba(255,255,255,0.72)",
                    letterSpacing: "-0.015em",
                    lineHeight: 1.2,
                    opacity: 1 - i * 0.05,
                  }}
                >
                  {line}
                </p>
              ))}
            </div>
          </FadeBlock>

          {/* ── CTA ── */}
          <FadeBlock delay={120}>
            <div
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 py-8 mt-4"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
            >
              <Link href="/sign-up">
                <button
                  className="h-12 px-8 rounded-full font-semibold text-[14px] tracking-wide transition-all hover:scale-[1.03] hover:brightness-110"
                  style={{ background: "linear-gradient(135deg,#e0b050,#c89030)", color: "#1a0f00" }}
                >
                  Find your room
                </button>
              </Link>
              <Link href="/hooks">
                <span
                  className="text-[13px] font-light tracking-wide cursor-pointer transition-colors hover:text-white/80"
                  style={{ color: "rgba(255,255,255,0.38)" }}
                >
                  Browse hooks →
                </span>
              </Link>
            </div>
          </FadeBlock>

        </div>
      </main>

      {/* ── Footer ── */}
      <footer
        className="relative z-10 px-6 md:px-10 pb-10 pt-6 max-w-[720px] mx-auto"
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)", marginTop: "4rem" }}
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <WaveOrnament opacity={0.12} />
          <p className="text-[11px] tracking-wide" style={{ color: "rgba(255,255,255,0.18)" }}>
            Real people. Real music.{" "}
            <span style={{ color: "rgba(212,163,65,0.35)" }}>Create together.</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
