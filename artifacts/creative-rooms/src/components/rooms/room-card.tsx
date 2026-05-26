import { Link } from "wouter";
import { Room } from "@workspace/api-client-react";

interface RoomCardProps {
  room: Room;
  index?: number;
}

/* Per-room cinematic fallback palettes when no cover image is available */
const PALETTES = [
  { from: "#0d1520", to: "#1a2840", accent: "#60a5fa" },
  { from: "#1a0d20", to: "#2e1840", accent: "#c084fc" },
  { from: "#1a0f06", to: "#2e1e0a", accent: "#fb923c" },
  { from: "#0d1a10", to: "#162a1a", accent: "#4ade80" },
];

function atmosphericLine(room: Room): string {
  if (room.description && room.description.trim().length > 6) return room.description;
  const vibe = (room.vibe || "").toLowerCase();
  if (vibe.includes("ambient")) return "Space for slow textures and quiet creation.";
  if (vibe.includes("acoustic")) return "Warm instruments and honest songwriting.";
  if (vibe.includes("late night") || vibe.includes("midnight"))
    return "For unfinished thoughts and late melodies.";
  if (vibe.includes("pop")) return "Atmospheric collaboration and cinematic textures.";
  if (vibe.includes("jazz") || vibe.includes("soul"))
    return "Human imperfections. Live instruments. Warmth.";
  if (vibe.includes("experimental")) return "Sound without limits. Explore freely.";
  const genre = room.genres?.[0]?.toLowerCase() || "";
  if (genre.includes("folk")) return "Stories told through strings and silence.";
  if (genre.includes("electronic")) return "Machines and hearts making music together.";
  return "A quiet place to create together.";
}

const AVATAR_COLORS = ["#7c4a1e", "#1e3a5f", "#4a1d6e", "#7f1d1d", "#14532d", "#1a3a2a"];

export function RoomCard({ room, index = 0 }: RoomCardProps) {
  const palette = PALETTES[index % PALETTES.length];
  const tagline = atmosphericLine(room);

  return (
    <Link href={`/rooms/${room.id}`}>
      <div
        className="group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 hover:scale-[1.025] hover:shadow-2xl"
        style={{
          aspectRatio: "4/3",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 4px 32px rgba(0,0,0,0.45)",
        }}
      >
        {/* Background — cover image or gradient */}
        {room.coverImageUrl ? (
          <img
            src={room.coverImageUrl}
            alt={room.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div
            className="absolute inset-0 transition-opacity duration-500"
            style={{
              background: `linear-gradient(145deg, ${palette.from} 0%, ${palette.to} 100%)`,
            }}
          />
        )}

        {/* Vignette overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/20" />
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(ellipse at 50% 90%, ${palette.accent}22 0%, transparent 70%)`,
          }}
        />

        {/* Live indicator */}
        {room.isActive && (
          <div
            className="absolute top-3.5 right-3.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium"
            style={{
              background: "rgba(0,0,0,0.65)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(74,222,128,0.35)",
              color: "rgba(74,222,128,0.9)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: "#4ade80",
                animation: "pulse-dot 2s ease-in-out infinite",
              }}
            />
            Live
          </div>
        )}

        {/* Card body — bottom overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col gap-2">
          {/* Genre pill */}
          {(room.vibe || room.genres?.[0]) && (
            <span
              className="self-start text-[10px] tracking-wider uppercase px-2.5 py-0.5 rounded-full"
              style={{
                background: "rgba(255,255,255,0.07)",
                color: "rgba(255,255,255,0.45)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              {room.vibe || room.genres?.[0]}
            </span>
          )}

          {/* Room name */}
          <h3
            className="font-serif leading-tight text-white group-hover:text-white/95 transition-colors"
            style={{ fontSize: "clamp(1.1rem, 1.6vw, 1.35rem)" }}
          >
            {room.name}
          </h3>

          {/* Tagline */}
          <p
            className="text-[12px] font-light leading-snug line-clamp-2 italic"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            "{tagline}"
          </p>

          {/* Members row */}
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-2">
              {/* Overlapping avatar circles */}
              <div className="flex -space-x-1.5">
                {Array.from({ length: Math.min(room.memberCount || 0, 5) }).map((_, i) => (
                  <div
                    key={i}
                    className="w-5 h-5 rounded-full border"
                    style={{
                      background: AVATAR_COLORS[i % AVATAR_COLORS.length],
                      borderColor: "rgba(0,0,0,0.7)",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.4)",
                    }}
                  />
                ))}
              </div>
              <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.38)" }}>
                {room.memberCount || 0} creating
              </span>
            </div>

            <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.25)" }}>
              {room.memberCount || 0} / {room.maxMembers}
            </span>
          </div>
        </div>
      </div>

    </Link>
  );
}
