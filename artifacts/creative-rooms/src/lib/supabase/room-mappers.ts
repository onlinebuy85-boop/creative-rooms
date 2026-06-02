import type { Room } from "@workspace/api-client-react";
import type { RoomOverviewItem } from "@/lib/rooms-demo-data";

/** Map API/Supabase room rows to overview cards without changing UI components. */
export function roomToOverviewItem(room: Room, index = 0): RoomOverviewItem {
  const genres = room.genres ?? [];
  const genreLabel = genres.slice(0, 3).join(" · ") || "Open collab";
  const memberCount = room.memberCount ?? 1;
  const ownerInitial = (room.ownerName?.[0] ?? "C").toUpperCase();

  const status =
    memberCount >= (room.maxMembers ?? 4)
      ? ("in_progress" as const)
      : memberCount <= 1
        ? ("just_started" as const)
        : ("live" as const);

  const statusLabels: Record<RoomOverviewItem["status"], string> = {
    live: "LIVE",
    just_started: "JUST STARTED",
    looking_vocals: "LOOKING FOR VOCALS",
    looking_guitar: "LOOKING FOR GUITAR",
    in_progress: "IN PROGRESS",
  };

  return {
    room,
    status,
    statusLabel: statusLabels[status],
    peopleCount: memberCount,
    description: room.description ?? `${room.name} — pull up and add something.`,
    genreRow: genreLabel,
    spaceGenre: genres[0] ?? "Open",
    spaceMood: room.vibe ?? "Chill",
    spaceGoal: "Collaboration",
    moodTag: room.vibe ?? genres[0] ?? "Chill",
    href: `/rooms/${room.id}`,
    avatarInitials: [ownerInitial],
    filterTags: ["collab", ...(genres[0] ? [genres[0].toLowerCase()] : [])],
  };
}

export function roomsToOverviewItems(rooms: Room[]): RoomOverviewItem[] {
  return rooms.map((room, index) => roomToOverviewItem(room, index));
}
