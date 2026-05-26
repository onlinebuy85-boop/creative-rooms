import { useListRooms } from "@workspace/api-client-react";
import { RoomCard } from "@/components/rooms/room-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Music2 } from "lucide-react";

export function DiscoverPage() {
  const { data: rooms, isLoading } = useListRooms();

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="space-y-3 pb-6 border-b border-border/40">
        <h1 className="font-serif text-3xl md:text-4xl tracking-tight">
          Discover <span className="text-primary italic">Sessions</span>.
        </h1>
        <p className="text-muted-foreground text-lg font-light max-w-2xl">
          Browse open rooms looking for collaborators. Find a vibe that matches yours.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-64 rounded-lg bg-muted/30" />
          ))}
        </div>
      ) : rooms && rooms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room, index) => (
            <div key={room.id} className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both" style={{ animationDelay: `${index * 100}ms` }}>
              <RoomCard room={room} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 px-4 text-center border border-dashed border-border/40 rounded-xl bg-card/10">
          <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center text-muted-foreground mb-6">
            <Music2 className="w-8 h-8 opacity-50" />
          </div>
          <h3 className="font-serif text-2xl mb-3">It's quiet right now</h3>
          <p className="text-muted-foreground max-w-md mx-auto font-light">
            There are no open rooms available at the moment. Why not start your own session and invite others to join?
          </p>
        </div>
      )}
    </div>
  );
}
