import { Link } from "wouter";
import { Room } from "@workspace/api-client-react";

interface RoomCardProps {
  room: Room;
  index?: number;
}

const PALETTES = [
  { from: "#0d1520", to: "#1a2840", accent: "60,165,250",   glow: "rgba(60,165,250,0.18)" },
  { from: "#1a0d20", to: "#2e1840", accent: "192,132,252",  glow: "rgba(192,132,252,0.18)" },
  { from: "#1a0f06", to: "#2e1e0a", accent: "251,146,60",   glow: "rgba(251,146,60,0.2)"  },
  { from: "#0d1a10", to: "#162a1a", accent: "74,222,128",   glow: "rgba(74,222,128,0.18)" },
];

const AVATAR_COLORS = ["#7c4a1e","#1e3a5f","#4a1d6e","#7f1d1d","#14532d","#1a3a2a"];

function atmosphericLine(room: Room): string {
  if (room.description && room.description.trim().length > 6) return room.description;
  const vibe = (room.vibe || "").toLowerCase();
  if (vibe.includes("ambient")) return "Space for slow textures and quiet creation.";
  if (vibe.includes("acoustic")) return "Warm instruments and honest songwriting.";
  if (vibe.includes("late night") || vibe.includes("midnight")) return "For unfinished thoughts and late melodies.";
  if (vibe.includes("pop")) return "Atmospheric collaboration and cinematic textures.";
  if (vibe.includes("jazz") || vibe.includes("soul")) return "Human imperfections. Live instruments. Warmth.";
  if (vibe.includes("experimental")) return "Sound without limits. Explore freely.";
  const genre = room.genres?.[0]?.toLowerCase() || "";
  if (genre.includes("folk")) return "Stories told through strings and silence.";
  if (genre.includes("electronic")) return "Machines and hearts making music together.";
  return "A quiet place to create together.";
}

/* Mini waveform — appears on hover */
function CardWaveform({ accent }: { accent: string }) {
  const heights = [3, 6, 4, 8, 5, 9, 4, 7, 3, 6, 5, 8, 4];
  return (
    <div className="flex items-end gap-[2px]" style={{ height: 16 }}>
      {heights.map((h, i) => (
        <div
          key={i}
          className="rounded-full transition-all duration-300"
          style={{
            width: 2,
            height: `${h * 10}%`,
            background: `rgba(${accent},0.7)`,
            animation: `breathe ${1.6 + (i % 5) * 0.28}s ease-in-out infinite`,
            animationDelay: `${i * 0.07}s`,
          }}
        />
      ))}
    </div>
  );
}

export function RoomCard({ room, index = 0 }: RoomCardProps) {
  const palette = PALETTES[index % PALETTES.length];
  const tagline = atmosphericLine(room);
  const spotsLeft = (room.maxMembers || 4) - (room.memberCount || 0);
  const isFull = spotsLeft <= 0;

  return (
    <Link href={`/rooms/${room.id}`}>
      <div
        className="group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500"
        style={{
          aspectRatio: "4/3",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 4px 28px rgba(0,0,0,0.5)",
          transform: "translateZ(0)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.transform = "scale(1.025) translateZ(0)";
          (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 48px rgba(0,0,0,0.6), 0 0 40px ${palette.glow}`;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.transform = "scale(1) translateZ(0)";
          (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 28px rgba(0,0,0,0.5)";
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/20 to-black/15" />

        {/* Hover glow from bottom — accent colour */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: `radial-gradient(ellipse at 50% 100%, rgba(${palette.accent},0.22) 0%, transparent 65%)` }}
        />

        {/* Top badges row */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          {/* Vibe pill */}
          {(room.vibe || room.genres?.[0]) && (
            <span
              className="text-[10px] tracking-wider uppercase px-2.5 py-0.5 rounded-full"
              style={{
                background: "rgba(0,0,0,0.45)",
                backdropFilter: "blur(6px)",
                color: "rgba(255,255,255,0.42)",
                border: "1px solid rgba(255,255,255,0.09)",
              }}
            >
              {room.vibe || room.genres?.[0]}
            </span>
          )}

          {/* Live indicator */}
          {room.isActive && (
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium"
              style={{
                background: "rgba(0,0,0,0.55)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(74,222,128,0.32)",
                color: "rgba(74,222,128,0.9)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "#4ade80", animation: "pulse-dot 2s ease-in-out infinite" }}
              />
              Live
            </div>
          )}
        </div>

        {/* Spots-left indicator — when nearly full */}
        {!isFull && spotsLeft <= 2 && (
          <div
            className="absolute top-10 right-3 mt-1"
          >
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
        <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-2">
          {/* Room name */}
          <h3
            className="font-serif leading-tight text-white group-hover:text-white/96 transition-colors"
            style={{ fontSize: "clamp(1.05rem, 1.6vw, 1.3rem)" }}
          >
            {room.name}
          </h3>

          {/* Tagline */}
          <p
            className="text-[11.5px] font-light leading-snug line-clamp-2"
            style={{ color: "rgba(255,255,255,0.4)", fontStyle: "italic" }}
          >
            "{tagline}"
          </p>

          {/* Members + waveform row */}
          <div className="flex items-center justify-between mt-0.5">
            <div className="flex items-center gap-2.5">
              {/* Avatar stack — slightly larger for readability */}
              <div className="flex -space-x-2">
                {Array.from({ length: Math.min(room.memberCount || 0, 4) }).map((_, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full border-[1.5px] flex items-center justify-center text-[8px] font-semibold"
                    style={{
                      background: AVATAR_COLORS[i % AVATAR_COLORS.length],
                      borderColor: "rgba(0,0,0,0.8)",
                      color: "rgba(255,255,255,0.7)",
                    }}
                  />
                ))}
                {(room.memberCount || 0) === 0 && (
                  <div
                    className="w-6 h-6 rounded-full border-[1.5px]"
                    style={{
                      background: "rgba(255,255,255,0.07)",
                      borderColor: "rgba(255,255,255,0.12)",
                      borderStyle: "dashed",
                    }}
                  />
                )}
              </div>

              <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.32)" }}>
                {room.memberCount || 0} creating
              </span>

            </div>

            {/* Waveform — appears on hover, accent coloured */}
            <div
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ paddingBottom: "1px" }}
            >
              <CardWaveform accent={palette.accent} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
