import { Link, useLocation } from "wouter";
import { useClerk, useUser } from "@clerk/react";
import { useGetMyProfile } from "@workspace/api-client-react";
import logoImg from "@assets/creative-rooms-wordmark.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LayoutDashboard, Compass, Plus, LogOut, User as UserIcon, Settings, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [, setLocation] = useLocation();
  const { data: profile } = useGetMyProfile();

  const handleSignOut = () => {
    signOut({ redirectUrl: import.meta.env.BASE_URL.replace(/\/$/, "") || "/" });
  };

  const NavLinks = () => (
    <>
      <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors hover-elevate rounded-md">
        <LayoutDashboard className="w-4 h-4" />
        <span>Dashboard</span>
      </Link>
      <Link href="/discover" className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors hover-elevate rounded-md">
        <Compass className="w-4 h-4" />
        <span>Discover</span>
      </Link>
      <Link href="/rooms/new" className="flex items-center gap-3 px-3 py-2 text-sm text-primary hover:text-primary/80 transition-colors hover-elevate rounded-md font-medium">
        <Plus className="w-4 h-4" />
        <span>New Room</span>
      </Link>
    </>
  );

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background relative overflow-hidden">
      <div className="bg-noise" />
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/discover">
              <img
                src={logoImg}
                alt="Creative Rooms"
                style={{ height: 24, width: "auto", objectFit: "contain" }}
              />
            </Link>
            <nav className="hidden md:flex items-center gap-2">
              <NavLinks />
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none">
                <Avatar className="h-8 w-8 border border-border/50 hover-elevate transition-all">
                  <AvatarImage src={profile?.avatarUrl || user?.imageUrl} />
                  <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                    {profile?.displayName?.charAt(0).toUpperCase() || user?.firstName?.charAt(0).toUpperCase() || '?'}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-popover/95 backdrop-blur-md border-border/50">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-0.5 leading-none">
                    <p className="font-medium text-sm">{profile?.displayName || user?.fullName}</p>
                    <p className="text-xs text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</p>
                  </div>
                </div>
                <DropdownMenuSeparator className="bg-border/50" />
                {profile && (
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href={`/profile/${profile.id}`} className="flex w-full items-center gap-2 text-muted-foreground hover:text-foreground">
                      <UserIcon className="w-4 h-4" />
                      <span>View Profile</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/profile/edit" className="flex w-full items-center gap-2 text-muted-foreground hover:text-foreground">
                    <Settings className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive cursor-pointer flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80vw] sm:w-[350px] bg-background border-border">
                <nav className="flex flex-col gap-4 mt-8">
                  <NavLinks />
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8 relative z-10">
        {children}
      </main>
    </div>
  );
}