import { useQuery } from "@tanstack/react-query";
import type { Room } from "@workspace/api-client-react";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { fetchRooms } from "@/lib/supabase/rooms";
import { roomsToOverviewItems } from "@/lib/supabase/room-mappers";
import type { RoomOverviewItem } from "@/lib/rooms-demo-data";
import {
  DEMO_ROOMS_OVERVIEW,
  filterRoomOverview,
  type RoomFilterTab,
} from "@/lib/rooms-demo-data";

export const supabaseRoomsQueryKey = ["supabase", "rooms"] as const;

export function useSupabaseRooms() {
  const enabled = isSupabaseConfigured();

  return useQuery({
    queryKey: supabaseRoomsQueryKey,
    queryFn: () => fetchRooms(true),
    enabled,
    staleTime: 30_000,
  });
}

export function useRoomsOverviewSource() {
  const { data, isLoading, isError, error, isFetched } = useSupabaseRooms();
  const configured = isSupabaseConfigured();

  const hasLiveData = Boolean(data && data.length > 0);
  const useDemo = !configured || (!isLoading && isFetched && !hasLiveData);

  const overviewItems: RoomOverviewItem[] = hasLiveData
    ? roomsToOverviewItems(data as Room[])
    : DEMO_ROOMS_OVERVIEW;

  return {
    configured,
    overviewItems,
    isLoading: configured && isLoading,
    isError: configured && isError,
    error: error instanceof Error ? error : null,
    isDemo: useDemo,
    rooms: data ?? [],
  };
}

export function useFilteredRoomsOverview(tab: RoomFilterTab, search: string) {
  const { overviewItems, ...rest } = useRoomsOverviewSource();

  const filtered = filterRoomOverview(overviewItems, tab, search);

  return { filtered, overviewItems, ...rest };
}
