import { useMemo } from "react";
import {
  useListRooms,
  useListHooks,
  useGetMyProfile,
  useGetRoomsPresence,
  getGetMyProfileQueryKey,
  getGetRoomsPresenceQueryKey,
} from "@workspace/api-client-react";
import { useUser } from "@clerk/react";
import { useSupabaseRooms } from "@/hooks/use-supabase-rooms";
import { useSupabaseHooksList } from "@/hooks/use-supabase-hooks-list";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { FeaturedStudioCard } from "@/components/home/featured-studio-card";
import { ActiveRoomsSection } from "@/components/home/active-rooms-section";
import { RecentHooksSection } from "@/components/home/recent-hooks-section";

/** Discover center — reference rhythm (hero → overlapping rooms → hooks) */
export function HomeDashboard() {
  const { data: apiRooms, isLoading: apiRoomsLoading } = useListRooms();
  const { data: apiHooks, isLoading: apiHooksLoading } = useListHooks();
  const supabaseOn = isSupabaseConfigured();
  const { data: sbRooms, isLoading: sbRoomsLoading } = useSupabaseRooms();
  const { data: sbHooks, isLoading: sbHooksLoading } = useSupabaseHooksList();

  const rooms = useMemo(() => {
    if (apiRooms?.length) return apiRooms;
    if (supabaseOn && sbRooms?.length) return sbRooms;
    return apiRooms;
  }, [apiRooms, sbRooms, supabaseOn]);

  const hooks = useMemo(() => {
    if (apiHooks?.length) return apiHooks;
    if (supabaseOn && sbHooks?.length) return sbHooks;
    return apiHooks;
  }, [apiHooks, sbHooks, supabaseOn]);

  const roomsLoading =
    apiRoomsLoading || (supabaseOn && sbRoomsLoading && !apiRooms?.length);
  const hooksLoading =
    apiHooksLoading || (supabaseOn && sbHooksLoading && !apiHooks?.length);
  const { isSignedIn } = useUser();
  const { data: profile } = useGetMyProfile({
    query: { enabled: !!isSignedIn, queryKey: getGetMyProfileQueryKey() },
  });
  const { data: presence } = useGetRoomsPresence({
    query: { queryKey: getGetRoomsPresenceQueryKey(), refetchInterval: 6000 },
  });

  const presenceMap: Record<number, number> = {};
  if (presence) {
    for (const [roomId, count] of Object.entries(presence)) {
      presenceMap[Number(roomId)] = Number(count);
    }
  }

  return (
    <div className="cr-center-feed">
      <div className="cr-center-main">
        <FeaturedStudioCard />

        <ActiveRoomsSection
          rooms={rooms}
          isLoading={roomsLoading}
          presence={presenceMap}
          currentProfileId={profile?.id}
          layout="grid"
          limit={4}
        />

        <RecentHooksSection
          hooks={hooks}
          isLoading={hooksLoading}
          currentProfileId={profile?.id}
          limit={4}
        />
      </div>
    </div>
  );
}
