import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import heroImg from "@assets/ChatGPT_Image_26_maj_2026_11_33_28_1779788136339.png";
import logoImg from "../assets/images/creative-rooms-logo-v3.png";


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
            style={{
              height: 72,
              width: "auto",
              objectFit: "contain",
              filter: "brightness(1.15) drop-shadow(0 0 14px rgba(212,163,65,0.4))",
              transition: "filter 0.3s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLImageElement).style.filter =
                "brightness(1.3) drop-shadow(0 0 24px rgba(212,163,65,0.65))";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLImageElement).style.filter =
                "brightness(1.15) drop-shadow(0 0 14px rgba(212,163,65,0.4))";
            }}
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

        {/* Auth CTAs */}
        <div className="flex items-center gap-4">
          <Link href="/sign-in">
            <span
              className="text-[13px] tracking-wide cursor-pointer transition-colors hover:text-white"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              Log in
            </span>
          </Link>
          <Link href="/sign-up">
            <button
              className="px-5 py-2 rounded-full text-[13px] font-semibold transition-all hover:brightness-110"
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
      <section className="relative z-10 px-10 pt-28 pb-40 max-w-[1280px] mx-auto">
        <div className="max-w-[560px]">

          {/* Eyebrow */}
          <p
            className="text-[11px] tracking-[0.22em] uppercase mb-7 font-light"
            style={{ color: "rgba(212,163,65,0.7)" }}
          >
            Creative Rooms · Private Sessions
          </p>

          {/* Headline */}
          <h1
            className="font-serif font-normal leading-[1.07] tracking-tight mb-7 text-white"
            style={{ fontSize: "clamp(2.6rem, 5.5vw, 4.2rem)" }}
          >
            Where music is<br />
            made between<br />
            <em className="not-italic" style={{ color: "rgba(212,163,65,0.85)" }}>real people.</em>
          </h1>

          {/* Sub */}
          <p
            className="text-[15px] font-light leading-relaxed mb-10 max-w-[420px]"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            Intimate creative rooms for musicians, producers, singers and songwriters.
            Drop a hook. Find a collaborator. Make something that matters.
          </p>

          {/* CTAs */}
          <div className="flex items-center gap-4">
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
                className="flex items-center gap-2.5 h-12 px-6 rounded-full text-[13px] font-light tracking-wide transition-all hover:bg-white/10"
                style={{
                  border: "1px solid rgba(255,255,255,0.18)",
                  color: "rgba(255,255,255,0.65)",
                }}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Browse sessions
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── MOOD STRIP ───────────────────────────────────────── */}
      <section
        className="relative z-10 border-t border-white/[0.06] px-10 py-8 max-w-[1280px] mx-auto"
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
                style={{ color: "rgba(212,163,65,0.8)" }}
              >
                {num}
              </span>
              <span
                className="text-[12px] tracking-wide"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
