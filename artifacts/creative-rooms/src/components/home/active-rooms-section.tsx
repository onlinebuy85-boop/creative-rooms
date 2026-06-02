import { Link } from "wouter";
import type { Room } from "@workspace/api-client-react";
import { RoomCard } from "@/components/rooms/room-card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  mergePresenceWithDemo,
  resolveRoomsForDisplay,
} from "@/lib/discover-demo-data";

interface ActiveRoomsSectionProps {
  rooms?: Room[];
  isLoading?: boolean;
  presence?: Record<number, number>;
  currentProfileId?: number;
  title?: string;
  limit?: number;
  layout?: "grid" | "list";
}

function SkeletonTile() {
  return (
    <Skeleton className="cr-room-card-skeleton w-full rounded-2xl bg-muted/25" />
  );
}

export function ActiveRoomsSection({
  rooms,
  isLoading,
  presence,
  currentProfileId,
  title = "Active rooms",
  limit = 4,
  layout = "grid",
}: ActiveRoomsSectionProps) {
  const { list, isDemo, showSkeleton } = resolveRoomsForDisplay(rooms, isLoading, limit);
  const presenceMap = mergePresenceWithDemo(presence, isDemo);
  const gridClass =
    layout === "grid" ? "cr-rooms-grid" : "grid grid-cols-1 sm:grid-cols-2 gap-3";

  return (
    <section className="cr-section cr-active-rooms-section cr-active-rooms-overlap">
      <div className="cr-section-header">
        <h2 className="cr-section-title">{title}</h2>
        <Link href="/discover" className="cr-section-link">
          View all
        </Link>
      </div>

      {showSkeleton ? (
        <div className={gridClass}>
          {[1, 2, 3, 4].map((i) => (
            <SkeletonTile key={i} />
          ))}
        </div>
      ) : (
        <div className={gridClass}>
          {list.map((room, index) => (
            <div key={room.id} className="cr-room-card-slot">
              <RoomCard
                room={room}
                index={index}
                currentProfileId={currentProfileId}
                liveCount={presenceMap[room.id]}
                compact
                demo={isDemo}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
