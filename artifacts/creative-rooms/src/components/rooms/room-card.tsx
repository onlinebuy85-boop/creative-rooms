import { Link } from "wouter";
import { Room } from "@workspace/api-client-react";
import { Users, Music, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RoomCardProps {
  room: Room;
}

export function RoomCard({ room }: RoomCardProps) {
  const getCoverArt = (id: number) => {
    return id % 2 === 0 
      ? "/assets/images/room-cover-1.png"
      : "/assets/images/room-cover-2.png";
  };

  return (
    <Link href={`/rooms/${room.id}`}>
      <div className="group relative overflow-hidden rounded-lg border border-border/40 bg-card/40 hover:bg-card/60 transition-all duration-500 hover:border-primary/30 flex flex-col h-full cursor-pointer hover-elevate">
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent z-10" />
        <div className="h-48 w-full overflow-hidden relative bg-muted">
          <img 
            src={room.coverImageUrl || getCoverArt(room.id)} 
            alt={room.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
          />
          {room.isActive && (
            <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-2 py-1 rounded-full bg-background/80 backdrop-blur border border-primary/20 text-xs font-medium text-primary">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Active
            </div>
          )}
        </div>
        
        <div className="relative z-20 flex flex-col flex-1 p-5 pt-0 -mt-10">
          <h3 className="font-serif text-xl font-medium tracking-tight text-foreground line-clamp-1 mb-1">{room.name}</h3>
          
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              {room.memberCount}/{room.maxMembers}
            </span>
            {room.ownerName && (
              <span className="flex items-center gap-1.5 line-clamp-1">
                <Music className="w-3.5 h-3.5" />
                {room.ownerName}
              </span>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
            {room.description || "A quiet space for collaboration."}
          </p>
          
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {room.vibe && (
              <Badge variant="secondary" className="bg-secondary/50 hover:bg-secondary/80 text-xs font-normal px-2 py-0 h-5 text-secondary-foreground border-transparent">
                {room.vibe}
              </Badge>
            )}
            {room.genres?.slice(0, 2).map(genre => (
              <Badge key={genre} variant="outline" className="border-border/50 text-xs font-normal px-2 py-0 h-5 text-muted-foreground">
                {genre}
              </Badge>
            ))}
            {(room.genres?.length || 0) > 2 && (
              <Badge variant="outline" className="border-border/50 text-xs font-normal px-2 py-0 h-5 text-muted-foreground">
                +{(room.genres?.length || 0) - 2}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}