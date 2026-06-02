import { useState } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { RoomsRightRail } from "@/components/rooms/rooms-right-rail";
import { RoomsToolbar } from "@/components/rooms/rooms-toolbar";
import { RoomCard } from "@/components/rooms/room-card";
import { AsyncStateBanner } from "@/components/ui/async-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useFilteredRoomsOverview } from "@/hooks/use-supabase-rooms";
import type { RoomFilterTab } from "@/lib/rooms-demo-data";

function RoomCardSkeleton() {
  return <Skeleton className="h-[280px] w-full rounded-2xl bg-muted/25" />;
}

export function RoomsPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<RoomFilterTab>("All rooms");

  const { filtered, isLoading, isError, error } = useFilteredRoomsOverview(
    activeTab,
    search,
  );

  return (
    <PageShell className="cr-page--rooms" rail={<RoomsRightRail />}>
      <div className="cr-rooms-page">
        <RoomsToolbar
          search={search}
          onSearchChange={setSearch}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {isError && (
          <AsyncStateBanner
            state="error"
            message={error?.message ?? "Could not load rooms from Supabase. Showing demo data."}
            className="mb-4"
          />
        )}

        <div className="cr-rooms-feed">
          {isLoading ? (
            <div className="cr-rooms-overview-grid">
              {[1, 2, 3, 4].map((i) => (
                <RoomCardSkeleton key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="cr-rooms-empty">
              <p className="text-sm text-[#b39b85]">No rooms match — try another filter.</p>
            </div>
          ) : (
            <div className="cr-rooms-overview-grid">
              {filtered.map((item, index) => (
                <RoomCard
                  key={item.room.id}
                  variant="overview"
                  room={item.room}
                  index={index}
                  overview={item}
                />
              ))}
            </div>
          )}

          <button type="button" className="cr-rooms-load-more">
            Load more rooms
          </button>
        </div>
      </div>
    </PageShell>
  );
}
