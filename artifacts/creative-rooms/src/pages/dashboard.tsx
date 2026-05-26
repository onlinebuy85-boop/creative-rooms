import { useGetMyRooms, useGetMyProfile } from "@workspace/api-client-react";
import { RoomCard } from "@/components/rooms/room-card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Plus, Compass, Music2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardPage() {
  const { data: profile, isLoading: profileLoading } = useGetMyProfile();
  const { data: rooms, isLoading: roomsLoading } = useGetMyRooms();

  if (profileLoading || roomsLoading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64 bg-muted/50" />
          <Skeleton className="h-5 w-48 bg-muted/50" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-64 rounded-lg bg-muted/30" />
          ))}
        </div>
      </div>
    );
  }

  const hasRooms = rooms && rooms.length > 0;

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/40">
        <div className="space-y-2">
          <h1 className="font-serif text-3xl md:text-4xl tracking-tight">
            Welcome back, <span className="text-primary italic">{profile?.displayName?.split(' ')[0]}</span>.
          </h1>
          <p className="text-muted-foreground text-lg font-light">
            The studio is warm. Your rooms are waiting.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-border/50 bg-card/30 backdrop-blur" asChild>
            <Link href="/discover">
              <Compass className="w-4 h-4 mr-2" /> Discover
            </Link>
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground border-primary-border shadow-sm" asChild>
            <Link href="/rooms/new">
              <Plus className="w-4 h-4 mr-2" /> New Room
            </Link>
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="font-serif text-2xl">Your Sessions</h2>
        
        {hasRooms ? (
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
            <h3 className="font-serif text-2xl mb-3">No active sessions</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-8 font-light">
              You haven't joined or created any rooms yet. Start a new session to invite collaborators, or explore open rooms to find your people.
            </p>
            <div className="flex gap-4">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground border-primary-border" asChild>
                <Link href="/rooms/new">Create Room</Link>
              </Button>
              <Button variant="outline" className="border-border/50" asChild>
                <Link href="/discover">Browse Open Rooms</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}