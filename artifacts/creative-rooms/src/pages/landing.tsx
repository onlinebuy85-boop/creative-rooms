import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Monitor, Share2, Users, ShieldCheck } from "lucide-react";
import studioImg from "@assets/ChatGPT_Image_26_maj_2026_10_58_42_1779785928727.png";

const ROOM_CARDS = [
  {
    name: "Midnight Frequencies",
    genre: "Ambient · Folk",
    members: 2,
    max: 3,
    from: "#1a304f",
    via: "#253d68",
    to: "#0d1e33",
    dot: "#60a5fa",
    glow: "rgba(96,165,250,0.3)",
  },
  {
    name: "Late Night Writing",
    genre: "Lyrics · Melodies",
    members: 2,
    max: 4,
    from: "#2a1e50",
    via: "#3e2d72",
    to: "#180f38",
    dot: "#c084fc",
    glow: "rgba(192,132,252,0.3)",
  },
  {
    name: "Soul in the Static",
    genre: "Neo-Soul · R&B",
    members: 3,
    max: 4,
    from: "#3a2008",
    via: "#5a3414",
    to: "#201204",
    dot: "#fb923c",
    glow: "rgba(251,146,60,0.32)",
  },
  {
    name: "Fragile Things",
    genre: "Dream Pop · Indie",
    members: 2,
    max: 3,
    from: "#301e48",
    via: "#4a2d68",
    to: "#1c1030",
    dot: "#fda4af",
    glow: "rgba(253,164,175,0.25)",
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
            animation: `waveBar 1.4s ease-in-out infinite`,
            animationDelay: `${i * 0.09}s`,
          }}
        />
      ))}
    </div>
  );
}

export function LandingPage() {
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

  return (
    <div className="bg-[#080608] text-foreground overflow-x-hidden">
      <div className="bg-noise" />

      {/* ── FULL-SCREEN HERO (single viewport, everything visible) ── */}
      <section className="relative w-full" style={{ minHeight: "100dvh" }}>

        {/* Full-bleed photo — covers entire section */}
        <div className="absolute inset-0 z-0">
          <img
            src={studioImg}
            alt=""
            className="w-full h-full object-cover object-center"
          />
          {/* Strong left gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/88 via-black/45 to-black/15" />
          {/* Top fade */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" />
          {/* Bottom fade to blend into cards area */}
          <div className="absolute bottom-0 left-0 right-0 h-2/5 bg-gradient-to-t from-black/95 via-black/60 to-transparent" />
        </div>

        {/* ── NAV ── */}
        <header className="relative z-10 flex items-center justify-between px-10 pt-7 max-w-screen-xl mx-auto">
          <div className="flex items-center gap-2.5">
            <img src={`${basePath}/logo.svg`} alt="Creative Rooms" className="w-7 h-7 opacity-80" />
            <span className="font-serif text-[17px] tracking-wide text-white/85">Creative Rooms</span>
          </div>
          <nav className="hidden md:flex items-center gap-9">
            {["Rooms", "People", "Inspiration", "About"].map((item) => (
              <span key={item} className="text-[13px] text-white/55 hover:text-white/85 transition-colors cursor-pointer tracking-wide">
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

        {/* ── NOW IN SESSION card (top right) ── */}
        <div className="absolute top-20 right-10 hidden lg:block z-20">
          <div className="rounded-2xl p-4 w-60"
            style={{
              background: "rgba(14,10,20,0.82)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.14)",
              boxShadow: "0 8px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}>
            <p className="text-white/40 text-[10px] tracking-widest uppercase mb-3">Now in session</p>
            <div className="flex items-center mb-3">
              {AVATARS.map((a, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-semibold"
                  style={{
                    background: a.color,
                    border: "2px solid rgba(14,10,20,0.8)",
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
              <p className="text-white/50 text-xs">4 people creating</p>
              <Waveform />
            </div>
          </div>
        </div>

        {/* ── MAIN HERO CONTENT ── */}
        <div className="relative z-10 px-10 max-w-screen-xl mx-auto" style={{ paddingTop: "clamp(80px, 14vh, 140px)" }}>
          <div className="max-w-xl space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <h1
              className="font-serif leading-[0.95] tracking-tight text-white drop-shadow-2xl"
              style={{ fontSize: "clamp(3.5rem, 8vw, 6rem)" }}
            >
              Creative<br />
              <span style={{ color: "rgba(255,255,255,0.72)" }}>Rooms</span>
            </h1>
            <p className="text-[15px] text-white/55 font-light leading-relaxed">
              Real people. Real music.<br />Create together.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <Button
                className="h-11 px-6 rounded-full font-medium border-0 transition-all hover:scale-105 text-white"
                style={{ background: "#7c5cbf", boxShadow: "0 0 28px -4px rgba(124,92,191,0.55)" }}
                asChild
              >
                <Link href="/sign-up">Enter Creative Rooms</Link>
              </Button>
              <Button
                variant="outline"
                className="h-11 px-6 rounded-full border-white/20 bg-white/5 text-white/75 hover:bg-white/10 hover:text-white backdrop-blur-sm font-medium"
                asChild
              >
                <Link href="/discover">Explore Rooms</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* ── BOTTOM PANEL: rooms + features ── */}
        <div
          className="relative z-10 px-10 max-w-screen-xl mx-auto"
          style={{ paddingTop: "clamp(48px, 9vh, 88px)", paddingBottom: "clamp(36px, 5vh, 60px)" }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12 items-end">

            {/* ── Left: room cards */}
            <div>
              <div className="mb-5">
                <h2 className="font-serif text-[1.4rem] text-white/85 mb-0.5">Join a Room</h2>
                <p className="text-white/35 text-xs tracking-wide">Find your people. Create something real.</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {ROOM_CARDS.map((room) => (
                  <Link href="/discover" key={room.name}>
                    <div
                      className="group relative rounded-xl overflow-hidden cursor-pointer border transition-all duration-300 hover:scale-[1.03] hover:border-white/20"
                      style={{
                        aspectRatio: "9/11",
                        background: `linear-gradient(160deg, ${room.from}, ${room.via}, ${room.to})`,
                        borderColor: "rgba(255,255,255,0.12)",
                        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.07), 0 6px 24px rgba(0,0,0,0.5)`,
                      }}
                    >
                      <div className="absolute inset-0"
                        style={{ background: `radial-gradient(ellipse at 40% 20%, ${room.glow} 0%, transparent 65%)` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <div className="w-1.5 h-1.5 rounded-full mb-1.5" style={{ background: room.dot, boxShadow: `0 0 8px ${room.dot}` }} />
                        <p className="text-white/90 text-[12px] font-medium leading-tight mb-0.5 font-serif">{room.name}</p>
                        <p className="text-white/40 text-[10px] mb-2">{room.genre}</p>
                        <div className="flex items-center gap-1.5">
                          <div className="flex -space-x-1">
                            {Array.from({ length: room.members }).map((_, i) => (
                              <div key={i} className="w-3 h-3 rounded-full bg-white/25 border border-white/10" />
                            ))}
                          </div>
                          <span className="text-white/30 text-[10px]">{room.members} / {room.max}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-4">
                <Link href="/discover" className="text-white/30 hover:text-white/60 text-xs transition-colors">
                  View all rooms →
                </Link>
              </div>
            </div>

            {/* ── Right: features + quote */}
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-[1.35rem] text-white/85 mb-4 leading-tight">
                  Share. Create. Connect.
                </h2>
                <ul className="space-y-3">
                  {[
                    { icon: Monitor,     label: "High quality voice & video" },
                    { icon: Share2,      label: "Share ideas & demos" },
                    { icon: Users,       label: "Real time collaboration" },
                    { icon: ShieldCheck, label: "Safe, respectful, creative space" },
                  ].map(({ icon: Icon, label }) => (
                    <li key={label} className="flex items-center gap-3 text-white/45 text-[12px]">
                      <Icon className="w-3.5 h-3.5 text-white/25 shrink-0" />
                      {label}
                    </li>
                  ))}
                </ul>
              </div>

              <blockquote className="pl-4" style={{ borderLeft: "2px solid rgba(251,146,60,0.35)" }}>
                <p className="font-serif text-[0.95rem] italic leading-relaxed"
                  style={{ color: "rgba(251,191,36,0.75)" }}>
                  "Music is better when<br />we build it together."
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
