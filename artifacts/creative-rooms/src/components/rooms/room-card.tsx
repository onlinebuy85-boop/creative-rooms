import { Link, useLocation } from "wouter";
import { Room } from "@workspace/api-client-react";
import { RoomManageMenu } from "./room-manage-menu";

interface RoomCardProps {
  room: Room;
  index?: number;
  currentProfileId?: number;
  liveCount?: number;
}

const PALETTES = [
  { from: "#0d1520", to: "#1a2840", accent: "60,165,250",   glow: "rgba(60,165,250,0.18)" },
  { from: "#1a0d20", to: "#2e1840", accent: "192,132,252",  glow: "rgba(192,132,252,0.18)" },
  { from: "#1a0f06", to: "#2e1e0a", accent: "251,146,60",   glow: "rgba(251,146,60,0.2)"  },
  { from: "#0d1a10", to: "#162a1a", accent: "74,222,128",   glow: "rgba(74,222,128,0.18)" },
];

const AVATAR_COLORS = ["#7c4a1e","#1e3a5f","#4a1d6e","#7f1d1d","#14532d","#1a3a2a"];

/* Deterministic atmospheric empty-room phrases — never fake metrics */
const EMPTY_PHRASES = [
  "Waiting for the first sound",
  "Open for collaborators",
  "Quiet room",
  "Room forming",
  "Listening for someone",
  "Still and waiting",
  "An empty studio",
  "Open session",
];

function emptyPhrase(roomId: number): string {
  return EMPTY_PHRASES[roomId % EMPTY_PHRASES.length];
}

/* Mini waveform — always gently alive, brightens when people are present */
function CardWaveform({ accent, active }: { accent: string; active: boolean }) {
  const heights = [3, 6, 4, 8, 5, 9, 4, 7, 3, 6, 5, 8, 4];
  return (
    <div className="flex items-end gap-[2px]" style={{ height: 16 }}>
      {heights.map((h, i) => (
        <div
          key={i}
          className="rounded-full transition-all duration-500"
          style={{
            width: 2,
            height: `${h * 10}%`,
            background: active
              ? `rgba(${accent},0.75)`
              : `rgba(${accent},0.28)`,
            animation: active
              ? `breathe ${1.6 + (i % 5) * 0.28}s ease-in-out infinite`
              : `breathe ${3.2 + (i % 5) * 0.5}s ease-in-out infinite`,
            animationDelay: `${i * 0.07}s`,
          }}
        />
      ))}
    </div>
  );
}

export function RoomCard({ room, index = 0, currentProfileId, liveCount }: RoomCardProps) {
  const [, setLocation] = useLocation();
  const palette = PALETTES[index % PALETTES.length];
  const spotsLeft = (room.maxMembers || 4) - (room.memberCount || 0);
  const isFull = spotsLeft <= 0;
  const isOwner = !!currentProfileId && currentProfileId === room.ownerId;

  /* Real live presence — undefined means still loading, treat as empty */
  const realCount = liveCount ?? 0;
  const isLive = realCount > 0;

  /* Genre tags — up to 3, shown as minimal editorial pills */
  const genreTags = (room.genres ?? []).slice(0, 3);

  return (
    <Link href={`/rooms/${room.id}`}>
      <div
        className="group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500"
        style={{
          aspectRatio: "4/3",
          border: isLive
            ? "1px solid rgba(255,255,255,0.10)"
            : "1px solid rgba(255,255,255,0.06)",
          boxShadow: isLive
            ? `0 4px 32px rgba(0,0,0,0.5), 0 0 0 1px ${palette.glow}`
            : "0 4px 24px rgba(0,0,0,0.45)",
          transform: "translateZ(0)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.transform = "scale(1.025) translateZ(0)";
          (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 48px rgba(0,0,0,0.6), 0 0 40px ${palette.glow}`;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.transform = "scale(1) translateZ(0)";
          (e.currentTarget as HTMLElement).style.boxShadow = isLive
            ? `0 4px 32px rgba(0,0,0,0.5), 0 0 0 1px ${palette.glow}`
            : "0 4px 24px rgba(0,0,0,0.45)";
        }}
      >
        {/* Background */}
        {room.coverImageUrl ? (
          <img
            src={room.coverImageUrl}
            alt={room.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div
            className="absolute inset-0 transition-opacity duration-500"
            style={{ background: `linear-gradient(145deg, ${palette.from} 0%, ${palette.to} 100%)` }}
          />
        )}

        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/25 to-black/12" />

        {/* Resting ambient glow */}
        <div
          className="absolute inset-0 transition-opacity duration-700"
          style={{
            background: `radial-gradient(ellipse at 50% 100%, rgba(${palette.accent},${isLive ? 0.14 : 0.06}) 0%, transparent 60%)`,
          }}
        />
        {/* Hover glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: `radial-gradient(ellipse at 50% 100%, rgba(${palette.accent},0.26) 0%, transparent 65%)` }}
        />

        {/* Owner manage menu */}
        {isOwner && (
          <div
            className="absolute top-2.5 right-2.5 z-10"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          >
            <RoomManageMenu
              roomId={room.id}
              roomName={room.name}
              isOwner={true}
              isMember={true}
              onSuccess={(redirect) => { if (redirect) setLocation("/discover"); }}
            />
          </div>
        )}

        {/* Top badges row */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          {/* Mood / vibe pill */}
          {(room.vibe || room.genres?.[0]) && (
            <span
              className="text-[10px] tracking-wider uppercase px-2.5 py-0.5 rounded-full"
              style={{
                background: "rgba(0,0,0,0.45)",
                backdropFilter: "blur(6px)",
                color: "rgba(255,255,255,0.38)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {room.vibe || room.genres?.[0]}
            </span>
          )}

          {/* Live indicator — only when real people are present */}
          {isLive && (
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium"
              style={{
                background: "rgba(0,0,0,0.55)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(74,222,128,0.28)",
                color: "rgba(74,222,128,0.88)",
                animation: "ambient-flicker 6s ease-in-out infinite",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "#4ade80", animation: "glow-ring 2.4s ease-in-out infinite" }}
              />
              Live
            </div>
          )}
        </div>

        {/* Spots-left indicator — only when actually live and nearly full */}
        {!isFull && spotsLeft <= 2 && isLive && (
          <div className="absolute top-10 right-3 mt-1">
            <span
              className="text-[10px] px-2 py-0.5 rounded-full"
              style={{
                background: "rgba(212,163,65,0.12)",
                border: "1px solid rgba(212,163,65,0.25)",
                color: "rgba(212,163,65,0.75)",
              }}
            >
              {spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} left
            </span>
          </div>
        )}

        {/* Card body */}
        <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-2.5">

          {/* Room name */}
          <h3
            className="font-serif leading-tight text-white group-hover:text-white/96 transition-colors"
            style={{ fontSize: "clamp(1.05rem, 1.6vw, 1.3rem)" }}
          >
            {room.name}
          </h3>

          {/* Genre tags — real data only, no invented copy */}
          {genreTags.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              {genreTags.map((g) => (
                <span
                  key={g}
                  className="text-[9.5px] tracking-[0.05em] uppercase"
                  style={{ color: "rgba(255,255,255,0.28)" }}
                >
                  {g}
                </span>
              ))}
            </div>
          )}

          {/* Presence row */}
          <div className="flex items-center justify-between">

            {isLive ? (
              /* Real presence — actual people are here */
              <div className="flex items-center gap-2.5">
                <div className="flex -space-x-2">
                  {Array.from({ length: Math.min(realCount, 4) }).map((_, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full border-[1.5px] flex items-center justify-center"
                      style={{
                        background: AVATAR_COLORS[i % AVATAR_COLORS.length],
                        borderColor: "rgba(0,0,0,0.8)",
                      }}
                    />
                  ))}
                </div>
                <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.42)" }}>
                  {realCount === 1 ? "1 creating" : `${realCount} creating`}
                </span>
              </div>
            ) : (
              /* Empty — atmospheric state, never fake metrics */
              <div className="flex items-center gap-2">
                <div
                  className="w-5 h-5 rounded-full border-[1px]"
                  style={{
                    background: "rgba(212,163,65,0.03)",
                    borderColor: "rgba(212,163,65,0.18)",
                    borderStyle: "dashed",
                    animation: "breathe 4s ease-in-out infinite",
                  }}
                />
                <span
                  className="text-[10.5px] font-light"
                  style={{ color: "rgba(255,255,255,0.24)", fontStyle: "italic" }}
                >
                  {emptyPhrase(room.id)}
                </span>
              </div>
            )}

            {/* Waveform — always present, intensity reflects live state */}
            <div
              className={`transition-opacity duration-500 ${isLive ? "opacity-70 group-hover:opacity-100" : "opacity-15 group-hover:opacity-40"}`}
              style={{ paddingBottom: "1px" }}
            >
              <CardWaveform accent={palette.accent} active={isLive} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
