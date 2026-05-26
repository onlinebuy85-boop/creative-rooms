import { useState } from "react";
import { useListRooms, useGetMyProfile, getGetMyProfileQueryKey } from "@workspace/api-client-react";
import { useUser } from "@clerk/react";
import { RoomCard } from "@/components/rooms/room-card";
import { GuestSignupPrompt } from "@/components/guest-prompt";
import { Link } from "wouter";
import { Plus } from "lucide-react";

function SkeletonCard() {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        aspectRatio: "4/3",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.05)",
        animation: "skeletonPulse 1.8s ease-in-out infinite",
      }}
    />
  );
}

export function DiscoverPage() {
  const { data: rooms, isLoading } = useListRooms();
  const { isSignedIn } = useUser();
  const { data: profile } = useGetMyProfile({ query: { enabled: !!isSignedIn, queryKey: getGetMyProfileQueryKey() } });
  const [guestPromptReason, setGuestPromptReason] = useState<string | null>(null);

  const handleNewRoom = () => {
    if (!isSignedIn) {
      setGuestPromptReason("create a room");
    }
  };

  return (
    <div className="space-y-10 px-6 py-8" style={{ animation: "pageIn 0.6s ease both" }}>

      {/* ── Header ── */}
      <div className="flex items-end justify-between gap-6">
        <div className="space-y-2">
          <h1
            className="font-serif tracking-tight text-white"
            style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", lineHeight: 1.05 }}
          >
            Find your room.
          </h1>
          <p
            className="text-[14px] font-light max-w-md leading-relaxed"
            style={{ color: "rgba(255,255,255,0.42)" }}
          >
            Open sessions waiting for collaborators. Each room is a different energy.
          </p>
        </div>

        {isSignedIn ? (
          <Link
            href="/rooms/new"
            className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-medium transition-all hover:scale-[1.04] hover:brightness-110"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.65)",
            }}
          >
            <Plus className="w-4 h-4" />
            New room
          </Link>
        ) : (
          <button
            type="button"
            onClick={handleNewRoom}
            className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-medium transition-all hover:scale-[1.04] hover:brightness-110"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.65)",
            }}
          >
            <Plus className="w-4 h-4" />
            New room
          </button>
        )}
      </div>

      {/* ── Room grid ── */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : rooms && rooms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {rooms.map((room, index) => (
            <div
              key={room.id}
              style={{
                animation: `pageIn 0.5s ease both`,
                animationDelay: `${index * 80}ms`,
              }}
            >
              <RoomCard room={room} index={index} currentProfileId={profile?.id} />
            </div>
          ))}
        </div>
      ) : (
        /* ── Empty state ── */
        <div
          className="flex flex-col items-center justify-center py-28 text-center rounded-2xl"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            <svg
              viewBox="0 0 24 24"
              className="w-7 h-7"
              fill="none"
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="1.5"
            >
              <path d="M9 18V5l12-2v13" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          </div>
          <h3 className="font-serif text-[1.4rem] text-white/70 mb-3">
            The rooms are quiet tonight.
          </h3>
          <p
            className="text-[13px] max-w-xs font-light leading-relaxed mb-8"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            No active sessions yet. Start the first one and invite someone to create with.
          </p>
          {isSignedIn ? (
            <Link
              href="/rooms/new"
              className="flex items-center gap-2 px-7 py-3 rounded-full text-[13.5px] font-semibold transition-all hover:scale-[1.03]"
              style={{
                background: "linear-gradient(135deg, #e0b050, #c89030)",
                color: "#1a0f00",
                boxShadow: "0 0 28px -6px rgba(212,163,65,0.4)",
              }}
            >
              <Plus className="w-4 h-4" />
              Start a room
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => setGuestPromptReason("create a room")}
              className="flex items-center gap-2 px-7 py-3 rounded-full text-[13.5px] font-semibold transition-all hover:scale-[1.03]"
              style={{
                background: "linear-gradient(135deg, #e0b050, #c89030)",
                color: "#1a0f00",
                boxShadow: "0 0 28px -6px rgba(212,163,65,0.4)",
              }}
            >
              <Plus className="w-4 h-4" />
              Start a room
            </button>
          )}
        </div>
      )}

      <GuestSignupPrompt
        open={!!guestPromptReason}
        reason={guestPromptReason ?? ""}
        onClose={() => setGuestPromptReason(null)}
      />

      <style>{`
        @keyframes pageIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes skeletonPulse {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
