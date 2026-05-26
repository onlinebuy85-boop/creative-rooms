import { useParams, Link } from "wouter";
import { useGetProfile, useGetMyProfile } from "@workspace/api-client-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Calendar, Music, Sparkles, Wand2, ArrowLeft, Settings } from "lucide-react";
import { format } from "date-fns";

export function ProfilePage() {
  const params = useParams<{ id: string }>();
  const profileId = Number(params.id);
  
  const { data: currentUser } = useGetMyProfile();
  const { data: profile, isLoading } = useGetProfile(profileId, { 
    query: { enabled: !!profileId, queryKey: ['getProfile', profileId] } 
  });

  const isOwnProfile = currentUser?.id === profileId;

  if (isLoading || !profile) {
    return (
      <div className="max-w-3xl mx-auto py-8 animate-in fade-in duration-500">
        <Skeleton className="h-48 w-full rounded-xl bg-muted/30 mb-8" />
        <div className="flex gap-6">
          <Skeleton className="w-32 h-32 rounded-full shrink-0 -mt-16 bg-muted/50 border-4 border-background" />
          <div className="space-y-4 flex-1 pt-2">
            <Skeleton className="h-8 w-48 bg-muted/50" />
            <Skeleton className="h-4 w-full bg-muted/30" />
            <Skeleton className="h-4 w-3/4 bg-muted/30" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-6">
        <Button variant="ghost" size="sm" className="text-muted-foreground -ml-3" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
          </Link>
        </Button>
      </div>

      <div className="relative rounded-2xl overflow-hidden border border-border/40 bg-card/20 backdrop-blur shadow-sm">
        {/* Cover abstract */}
        <div className="h-32 sm:h-48 bg-muted relative overflow-hidden">
          <img 
            src="/assets/images/hero-bg.png" 
            alt="Cover" 
            className="w-full h-full object-cover opacity-30 mix-blend-screen"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>

        <div className="px-6 sm:px-8 pb-8">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-end -mt-12 sm:-mt-16 mb-6 relative z-10">
            <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-background shadow-lg">
              <AvatarImage src={profile.avatarUrl || undefined} className="object-cover" />
              <AvatarFallback className="text-2xl bg-muted text-muted-foreground">
                {profile.displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
              <div className="space-y-1">
                <h1 className="font-serif text-3xl font-medium tracking-tight text-foreground">
                  {profile.displayName}
                </h1>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" /> Joined {format(new Date(profile.createdAt), 'MMMM yyyy')}
                </p>
              </div>
              
              {isOwnProfile && (
                <Button variant="outline" className="border-border/50 bg-background/50 backdrop-blur w-full sm:w-auto" asChild>
                  <Link href="/profile/edit">
                    <Settings className="w-4 h-4 mr-2" /> Edit Profile
                  </Link>
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <section className="space-y-3">
                <h2 className="text-sm font-medium text-foreground/80 uppercase tracking-widest flex items-center">
                  <Wand2 className="w-4 h-4 mr-2 text-primary" /> About
                </h2>
                <div className="p-4 rounded-xl bg-background/50 border border-border/40 text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
                  {profile.bio || "This creator hasn't written a bio yet."}
                </div>
              </section>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <section className="space-y-3">
                  <h2 className="text-sm font-medium text-foreground/80 uppercase tracking-widest flex items-center">
                    <Music className="w-4 h-4 mr-2 text-primary" /> Musical Style
                  </h2>
                  <div className="p-4 rounded-xl bg-background/50 border border-border/40 h-full">
                    <p className="text-sm text-muted-foreground">
                      {profile.musicalStyle || "Not specified."}
                    </p>
                  </div>
                </section>
                
                <section className="space-y-3">
                  <h2 className="text-sm font-medium text-foreground/80 uppercase tracking-widest flex items-center">
                    <Sparkles className="w-4 h-4 mr-2 text-primary" /> Emotional Vibe
                  </h2>
                  <div className="p-4 rounded-xl bg-background/50 border border-border/40 h-full">
                    <p className="text-sm text-muted-foreground">
                      {profile.emotionalVibe || "Not specified."}
                    </p>
                  </div>
                </section>
              </div>
            </div>

            <div className="space-y-8">
              <section className="space-y-3">
                <h2 className="text-sm font-medium text-foreground/80 uppercase tracking-widest">
                  Genres
                </h2>
                <div className="flex flex-wrap gap-2">
                  {profile.genres && profile.genres.length > 0 ? (
                    profile.genres.map(genre => (
                      <Badge key={genre} variant="secondary" className="bg-secondary/40 text-secondary-foreground hover:bg-secondary/60 font-normal border-transparent">
                        {genre}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground italic">None added</span>
                  )}
                </div>
              </section>

              <section className="space-y-3">
                <h2 className="text-sm font-medium text-foreground/80 uppercase tracking-widest">
                  Inspirations
                </h2>
                <div className="p-4 rounded-xl bg-background/50 border border-border/40 text-sm text-muted-foreground">
                  {profile.inspirations || "None added"}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
