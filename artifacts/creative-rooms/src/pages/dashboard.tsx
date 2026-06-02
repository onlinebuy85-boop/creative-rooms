import { useGetMyRooms, useGetMyProfile } from "@workspace/api-client-react";
import { RoomCard } from "@/components/rooms/room-card";
import { Link } from "wouter";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { FeaturedStudioCard } from "@/components/home/featured-studio-card";
import { PageShell } from "@/components/layout/page-shell";
import { UtilityRail } from "@/components/home/utility-rail";

/** Rooms-focused center column; rail + sidebar come from AppLayout */
export function DashboardPage() {
  const { data: profile, isLoading: profileLoading } = useGetMyProfile();
  const { data: rooms, isLoading: roomsLoading } = useGetMyRooms();

  if (profileLoading || roomsLoading) {
    return (
      <PageShell className="cr-page--discover" rail={<UtilityRail />}>
        <div className="cr-center-feed">
          <Skeleton className="h-44 w-full rounded-2xl bg-muted/25" />
          <div className="cr-rooms-grid">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="aspect-[5/4] rounded-2xl bg-muted/25" />
            ))}
          </div>
        </div>
      </PageShell>
    );
  }

  const hasRooms = rooms && rooms.length > 0;
  const firstName = profile?.displayName?.split(" ")[0];

  return (
    <PageShell className="cr-page--discover" rail={<UtilityRail />}>
    <div className="cr-center-feed">
      <div className="cr-center-toolbar">
        <h1 className="font-serif text-xl text-foreground/95">
          Your rooms{firstName ? `, ${firstName}` : ""}
        </h1>
        <Link href="/rooms/new" className="cr-toolbar-btn">
          <Plus className="w-4 h-4" />
          New room
        </Link>
      </div>

      <FeaturedStudioCard />

      <section className="cr-section">
        <div className="cr-section-header">
          <h2 className="cr-section-title">Your sessions</h2>
        </div>
        {hasRooms ? (
          <div className="cr-rooms-grid">
            {rooms.map((room, index) => (
              <RoomCard key={room.id} room={room} index={index} currentProfileId={profile?.id} compact />
            ))}
          </div>
        ) : (
          <div className="cr-rail-panel py-10 text-center">
            <p className="text-sm text-muted-foreground font-light mb-4">No sessions yet.</p>
            <Link href="/rooms/new" className="cr-btn-primary inline-flex h-9 px-5 rounded-xl text-sm items-center">
              Create room
            </Link>
          </div>
        )}
      </section>
    </div>
    </PageShell>
  );
}
