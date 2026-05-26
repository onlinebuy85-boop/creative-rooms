import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Monitor, Share2, Users, ShieldCheck } from "lucide-react";
import studioImg from "@assets/ChatGPT_Image_26_maj_2026_10_58_42_1779785928727.png";
import logoImg from "@assets/creative-rooms-logo-transparent.png";
import cardsSpriteImg from "@assets/ChatGPT_Image_26_maj_2026_11_16_32_1779786999982.png";

/*
 * Room card sprite sheet is a 2×2 grid:
 *   [Midnight Frequencies] [Late Night Writing ]
 *   [Soul in the Static  ] [Fragile Things     ]
 *
 * background-size: 200% 200%  →  each card crops one quadrant
 * background-position: x% y%
 */
const ROOM_CARDS = [
  {
    name: "Midnight Frequencies",
    genre: "Ambient · Folk",
    members: 2,
    max: 3,
    bgPos: "0% 0%",
    dot: "#60a5fa",
    glowColor: "rgba(96,165,250,0.22)",
  },
  {
    name: "Late Night Writing",
    genre: "Lyrics & Melodies",
    members: 2,
    max: 4,
    bgPos: "100% 0%",
    dot: "#fbbf24",
    glowColor: "rgba(251,191,36,0.18)",
  },
  {
    name: "Soul in the Static",
    genre: "Neo-Soul · R&B",
    members: 3,
    max: 4,
    bgPos: "0% 100%",
    dot: "#fb923c",
    glowColor: "rgba(251,146,60,0.2)",
  },
  {
    name: "Fragile Things",
    genre: "Dream Pop · Indie",
    members: 2,
    max: 3,
    bgPos: "100% 100%",
    dot: "#c084fc",
    glowColor: "rgba(192,132,252,0.22)",
  },
];

const AVATARS = [
  { initials: "LV", color: "#92400e" },
  { initials: "MD", color: "#1e3a5f" },
  { initials: "RH", color: "#4c1d6e" },
  { initials: "SK", color: "#881337" },
];

function Waveform() {
  const bars = [3, 7, 11, 14, 9, 13, 7, 5, 10, 8, 12, 6, 9, 11, 7];
  return (
    <div className="flex items-center gap-[2px] h-4">
      {bars.map((h, i) => (
        <div
          key={i}
          className="w-[2px] rounded-full bg-amber-400/70"
          style={{
            height: `${h}px`,
            animation: "waveBar 1.4s ease-in-out infinite",
            animationDelay: `${i * 0.09}s`,
          }}
        />
      ))}
    </div>
  );
}

export function LandingPage() {
  return (
    <div className="bg-[#080608] text-foreground overflow-x-hidden">
      <div className="bg-noise" />

      {/* ── FULL-SCREEN HERO ─────────────────────────────── */}
      <section className="relative w-full" style={{ minHeight: "100dvh" }}>

        {/* Full-bleed studio photograph */}
        <div className="absolute inset-0 z-0">
          <img
            src={studioImg}
            alt=""
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/88 via-black/45 to-black/15" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-[45%] bg-gradient-to-t from-black/96 via-black/65 to-transparent" />
        </div>

        {/* ── NAV ── */}
        <header className="relative z-10 flex items-center justify-between px-10 pt-7 max-w-screen-xl mx-auto">
          <Link href="/" className="flex items-center gap-2.5">
            {/* Waveform circle icon — crop just the top portion of the transparent PNG */}
            <div
              className="shrink-0 rounded-full overflow-hidden"
              style={{
                width: 34,
                height: 34,
                backgroundImage: `url(${logoImg})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "110px auto",
                backgroundPosition: "center -2px",
                filter: "drop-shadow(0 0 8px rgba(212,163,65,0.5))",
              }}
            />
            <span
              className="font-serif text-[17px] tracking-wide"
              style={{ color: "rgba(255,255,255,0.85)" }}
            >
              Creative Rooms
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-9">
            {["Rooms", "People", "Inspiration", "About"].map((item) => (
              <span
                key={item}
                className="text-[13px] text-white/50 hover:text-white/85 transition-colors cursor-pointer tracking-wide"
              >
                {item}
              </span>
            ))}
          </nav>

          <Button
            variant="outline"
            className="border-white/20 bg-white/5 text-white/75 hover:bg-white/10 hover:text-white backdrop-blur-sm text-sm rounded-lg"
            asChild
          >
            <Link href="/sign-in">Log in</Link>
          </Button>
        </header>

        {/* ── NOW IN SESSION card ── */}
        <div className="absolute top-20 right-10 hidden lg:block z-20">
          <div
            className="rounded-2xl p-4 w-60"
            style={{
              background: "rgba(12,8,18,0.85)",
              backdropFilter: "blur(28px)",
              border: "1px solid rgba(255,255,255,0.13)",
              boxShadow:
                "0 8px 48px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.07)",
            }}
          >
            <p className="text-white/38 text-[10px] tracking-[0.18em] uppercase mb-3">
              Now in session
            </p>
            <div className="flex items-center mb-3">
              {AVATARS.map((a, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-semibold"
                  style={{
                    background: a.color,
                    border: "2px solid rgba(12,8,18,0.85)",
                    marginLeft: i > 0 ? "-7px" : "0",
                    zIndex: AVATARS.length - i,
                    position: "relative",
                  }}
                >
                  {a.initials}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <p className="text-white/48 text-xs">4 people creating</p>
              <Waveform />
            </div>
          </div>
        </div>

        {/* ── HERO HEADLINE + CTAs ── */}
        <div
          className="relative z-10 px-10 max-w-screen-xl mx-auto"
          style={{ paddingTop: "clamp(72px, 13vh, 130px)" }}
        >
          <div className="max-w-xl space-y-5">
            <h1
              className="font-serif leading-[0.93] tracking-tight text-white drop-shadow-2xl"
              style={{ fontSize: "clamp(3.5rem, 8vw, 6rem)" }}
            >
              Creative
              <br />
              <em
                className="not-italic"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                Rooms
              </em>
            </h1>

            <p className="text-[15px] font-light leading-relaxed" style={{ color: "rgba(255,255,255,0.52)" }}>
              Real people. Real music.
              <br />
              Create together.
            </p>

            <div className="flex items-center gap-3 pt-1">
              <Button
                className="h-11 px-7 rounded-full font-medium border-0 transition-all hover:scale-[1.03] text-white text-[13px]"
                style={{
                  background: "linear-gradient(135deg, #7c5cbf, #9b79d4)",
                  boxShadow: "0 0 32px -4px rgba(124,92,191,0.6)",
                }}
                asChild
              >
                <Link href="/sign-up">Enter Creative Rooms</Link>
              </Button>
              <Button
                variant="outline"
                className="h-11 px-7 rounded-full border-white/20 bg-white/[0.06] text-white/72 hover:bg-white/10 hover:text-white backdrop-blur-sm font-medium text-[13px]"
                asChild
              >
                <Link href="/discover">Explore Rooms</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* ── BOTTOM PANEL: room cards + features ── */}
        <div
          className="relative z-10 px-10 max-w-screen-xl mx-auto"
          style={{
            paddingTop: "clamp(44px, 8vh, 80px)",
            paddingBottom: "clamp(32px, 5vh, 56px)",
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_268px] gap-12 items-end">

            {/* ── Room cards ── */}
            <div>
              <div className="mb-5">
                <h2
                  className="font-serif text-[1.35rem] mb-0.5"
                  style={{ color: "rgba(255,255,255,0.82)" }}
                >
                  Join a Room
                </h2>
                <p className="text-[11px] tracking-widest" style={{ color: "rgba(255,255,255,0.32)" }}>
                  FIND YOUR PEOPLE · CREATE SOMETHING REAL
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {ROOM_CARDS.map((room) => (
                  <Link href="/discover" key={room.name}>
                    <div
                      className="group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:scale-[1.04] hover:z-10"
                      style={{
                        aspectRatio: "9/11",
                        backgroundImage: `url(${cardsSpriteImg})`,
                        backgroundSize: "200% 200%",
                        backgroundPosition: room.bgPos,
                        border: "1px solid rgba(255,255,255,0.10)",
                        boxShadow: `0 4px 32px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08)`,
                      }}
                    >
                      {/* Ambient colour glow */}
                      <div
                        className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-70"
                        style={{
                          background: `radial-gradient(ellipse at 50% 15%, ${room.glowColor} 0%, transparent 65%)`,
                        }}
                      />

                      {/* Deep bottom overlay — covers sprite sheet labels, gives text room */}
                      <div
                        className="absolute bottom-0 left-0 right-0"
                        style={{
                          background:
                            "linear-gradient(to top, rgba(3,1,8,0.98) 0%, rgba(3,1,8,0.90) 38%, rgba(3,1,8,0.72) 58%, transparent 100%)",
                          padding: "0 10px 10px",
                        }}
                      >
                        {/* Separator line */}
                        <div
                          className="w-full h-px mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{ background: "rgba(255,255,255,0.08)" }}
                        />

                        {/* Live dot */}
                        <div
                          className="w-1.5 h-1.5 rounded-full mb-1.5"
                          style={{
                            background: room.dot,
                            boxShadow: `0 0 7px 1px ${room.dot}`,
                          }}
                        />

                        <p className="font-serif text-[11.5px] leading-tight text-white/90 mb-[3px]">
                          {room.name}
                        </p>
                        <p className="text-[10px] mb-2.5" style={{ color: "rgba(255,255,255,0.38)" }}>
                          {room.genre}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex -space-x-1.5">
                            {Array.from({ length: room.members }).map((_, i) => (
                              <div
                                key={i}
                                className="w-[18px] h-[18px] rounded-full border border-white/20"
                                style={{
                                  background: `hsl(${i * 60 + 200}, 40%, 35%)`,
                                  boxShadow: "0 1px 4px rgba(0,0,0,0.4)",
                                }}
                              />
                            ))}
                          </div>
                          <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.28)" }}>
                            {room.members} / {room.max}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-4">
                <Link
                  href="/discover"
                  className="text-[11px] tracking-wide transition-colors"
                  style={{ color: "rgba(255,255,255,0.28)" }}
                >
                  View all rooms →
                </Link>
              </div>
            </div>

            {/* ── Features + quote ── */}
            <div className="space-y-6 pb-1">
              <div>
                <h2
                  className="font-serif text-[1.3rem] mb-4 leading-tight"
                  style={{ color: "rgba(255,255,255,0.82)" }}
                >
                  Share. Create.
                  <br />
                  Connect.
                </h2>
                <ul className="space-y-3.5">
                  {[
                    { icon: Monitor,     label: "High quality voice & video" },
                    { icon: Share2,      label: "Share ideas & demos" },
                    { icon: Users,       label: "Real time collaboration" },
                    { icon: ShieldCheck, label: "Safe, respectful, creative space" },
                  ].map(({ icon: Icon, label }) => (
                    <li key={label} className="flex items-center gap-3 text-[12px]" style={{ color: "rgba(255,255,255,0.42)" }}>
                      <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: "rgba(255,255,255,0.22)" }} />
                      {label}
                    </li>
                  ))}
                </ul>
              </div>

              <blockquote
                className="pl-4"
                style={{ borderLeft: "2px solid rgba(212,163,65,0.4)" }}
              >
                <p
                  className="font-serif text-[0.92rem] italic leading-relaxed"
                  style={{ color: "rgba(212,163,65,0.72)" }}
                >
                  "Music is better when
                  <br />
                  we build it together."
                </p>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes waveBar {
          0%, 100% { transform: scaleY(0.35); opacity: 0.45; }
          50%       { transform: scaleY(1);    opacity: 1;    }
        }
      `}</style>
    </div>
  );
}
