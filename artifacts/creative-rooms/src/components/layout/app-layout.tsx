import { Link, useLocation } from "wouter";
import { useClerk, useUser } from "@clerk/react";
import { useGetMyProfile, getGetMyProfileQueryKey } from "@workspace/api-client-react";
import { BrandLogo } from "@/components/brand/brand-logo";
import { AppShell } from "@/components/layout/app-shell";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { UtilityRail } from "@/components/home/utility-rail";
import {
  Compass, Radio, Plus, User as UserIcon, Home, LayoutGrid,
} from "lucide-react";

function BottomNavItem({
  href,
  icon: Icon,
  label,
  active,
  avatarSrc,
  avatarFallback,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
  avatarSrc?: string;
  avatarFallback?: string;
}) {
  return (
    <Link href={href}>
      <div className="relative flex flex-col items-center gap-1 py-2 px-3 min-w-[56px] cursor-pointer min-h-[52px]">
        {avatarSrc !== undefined ? (
          <div
            className={`w-6 h-6 rounded-full overflow-hidden flex items-center justify-center border-2 shrink-0 ${
              active ? "border-primary" : "border-border/50"
            }`}
          >
            {avatarSrc ? (
              <img src={avatarSrc} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className={`text-[10px] font-semibold ${active ? "text-primary" : "text-muted-foreground"}`}>
                {avatarFallback}
              </span>
            )}
          </div>
        ) : (
          <Icon className={`w-5 h-5 ${active ? "text-primary" : "text-muted-foreground/70"}`} />
        )}
        <span className={`text-[10px] font-medium ${active ? "text-primary" : "text-muted-foreground/50"}`}>
          {label}
        </span>
        {active && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />}
      </div>
    </Link>
  );
}

interface AppLayoutProps {
  children: React.ReactNode;
  /** Hide right utility column (forms, narrow flows) */
  hideRail?: boolean;
  rail?: React.ReactNode;
}

export function AppLayout({ children, hideRail = false, rail }: AppLayoutProps) {
  const [location] = useLocation();
  const { user } = useUser();
  const { data: profile } = useGetMyProfile({
    query: { enabled: !!user, queryKey: getGetMyProfileQueryKey() },
  });

  const pathname = location;

  const isHome = pathname === "/discover" || pathname === "/dashboard";
  const isHooks = pathname === "/hooks";
  const isRoomsOverview = pathname === "/rooms";
  const isMessages = pathname === "/messages";
  const isNotifications = pathname === "/notifications";
  const isSettings = pathname.startsWith("/settings");
  const isProfile = pathname.startsWith("/profile");
  const isProfileView =
    pathname === "/profile" ||
    (pathname.startsWith("/profile/") &&
      pathname !== "/profile/edit" &&
      pathname !== "/profile/setup");

  const usesPageShell =
    isHome ||
    isHooks ||
    isRoomsOverview ||
    isMessages ||
    isNotifications ||
    isSettings ||
    isProfileView;

  return (
    <div className="flex flex-col min-h-screen w-full max-w-full overflow-hidden bg-background relative">
      <div className="bg-noise" />

      <div
        className={
          usesPageShell
            ? "hidden md:flex md:flex-1 md:min-w-0 md:min-h-0 cr-page-viewport w-full max-w-full overflow-hidden"
            : "hidden md:flex md:flex-1 md:min-w-0 md:min-h-0 w-full max-w-full overflow-hidden"
        }
      >
        {usesPageShell ? (
          children
        ) : (
          <AppShell
            sidebar={<SidebarNav />}
            rail={hideRail ? null : (rail ?? <UtilityRail />)}
          >
            {children}
          </AppShell>
        )}
      </div>

      {/* Mobile: single column + bottom nav */}
      <div className="md:hidden flex flex-col min-h-[100dvh]">
        <header className="cr-mobile-header">
          <BrandLogo variant="icon" size="nav" href="/discover" />
          {user && profile ? (
            <Link href={`/profile/${profile.id}`}>
              <div className="w-8 h-8 rounded-full overflow-hidden border border-border/50">
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="flex items-center justify-center h-full text-xs bg-muted">
                    {profile.displayName.charAt(0)}
                  </span>
                )}
              </div>
            </Link>
          ) : (
            <Link href="/login" className="text-xs text-muted-foreground">
              Log in
            </Link>
          )}
        </header>
        <main
          className="flex-1 overflow-y-auto overflow-x-hidden pb-[4.5rem]"
          style={{ paddingTop: "calc(3rem + env(safe-area-inset-top, 0px))" }}
        >
          {children}
        </main>
        <nav className="cr-mobile-nav">
          <BottomNavItem href="/discover" icon={Home} label="Home" active={isHome} />
          <BottomNavItem href="/hooks" icon={Radio} label="Hooks" active={isHooks} />
          <Link href={user ? "/rooms/new" : "/login"}>
            <div className="flex flex-col items-center -mt-5">
              <div className="w-12 h-12 rounded-full cr-btn-primary flex items-center justify-center shadow-lg">
                <Plus className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
              </div>
              <span className="text-[9px] text-primary/70 mt-1 font-semibold uppercase tracking-wider">
                Create
              </span>
            </div>
          </Link>
          <BottomNavItem
            href={user && profile ? `/profile/${profile.id}` : "/login"}
            icon={UserIcon}
            label="Profile"
            active={isProfile}
            avatarSrc={profile?.avatarUrl ?? ""}
            avatarFallback={profile?.displayName?.charAt(0).toUpperCase()}
          />
          <BottomNavItem href="/discover" icon={Compass} label="Explore" active={false} />
        </nav>
      </div>
    </div>
  );
}
