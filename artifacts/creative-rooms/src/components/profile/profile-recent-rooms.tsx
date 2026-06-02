import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { RoomCard } from "@/components/rooms/room-card";
import type { RoomOverviewItem } from "@/lib/rooms-demo-data";

interface ProfileRecentRoomsProps {
  rooms: RoomOverviewItem[];
}

export function ProfileRecentRooms({ rooms }: ProfileRecentRoomsProps) {
  return (
    <section className="cr-profile-section">
      <header className="cr-profile-section-header">
        <h2 className="cr-profile-section-title">Recent rooms</h2>
        <Link href="/rooms" className="cr-profile-section-link">
          View all rooms
          <ArrowRight className="w-4 h-4" />
        </Link>
      </header>

      <div className="cr-profile-recent-rooms cr-rooms-page">
        <div className="cr-profile-rooms-grid cr-rooms-overview-grid">
          {rooms.map((item, index) => (
            <RoomCard
              key={item.room.id}
              variant="overview"
              room={item.room}
              index={index}
              overview={item}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
