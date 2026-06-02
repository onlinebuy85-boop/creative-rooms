import { Link, useLocation } from "wouter";
import { useClerk, useUser } from "@clerk/react";
import { useGetMyProfile, getGetMyProfileQueryKey } from "@workspace/api-client-react";
import { BrandLogo } from "@/components/brand/brand-logo";
import heroImg from "@/assets/images/hero.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Home,
  Compass,
  LayoutGrid,
  Radio,
  Activity,
  MessageCircle,
  Bell,
  User,
  Settings,
  LogOut,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

interface NavItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  active: boolean;
  badge?: number;
}

function NavItem({ href, icon: Icon, label, active, badge }: NavItemProps) {
  return (
    <Link href={href}>
      <div className={active ? "cr-nav-link cr-nav-link-active" : "cr-nav-link"}>
        <Icon className="shrink-0" strokeWidth={1.75} />
        <span className="flex-1">{label}</span>
        {badge != null && badge > 0 && (
          <span className="cr-nav-badge">{badge}</span>
        )}
      </div>
    </Link>
  );
}

export function SidebarNav() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [location] = useLocation();
  const { data: profile } = useGetMyProfile({
    query: { enabled: !!user, queryKey: getGetMyProfileQueryKey() },
  });

  const isHome = location === "/" || location === "/discover";
  const isRooms =
    location === "/rooms" ||
    (location.startsWith("/rooms/") && location !== "/rooms/new");
  const isHooks = location === "/hooks" || location.startsWith("/hooks");
  const isMessages = location === "/messages" || location.startsWith("/messages");
  const isNotifications =
    location === "/notifications" || location.startsWith("/notifications");
  const isSettings = location === "/settings" || location.startsWith("/settings");
  const pathname = location;
  const isProfile = pathname.startsWith("/profile");

  const handleSignOut = () => {
    signOut({ redirectUrl: import.meta.env.BASE_URL.replace(/\/$/, "") || "/" });
  };

  return (
    <div className="cr-sidebar-inner">
      <div className="cr-sidebar-brand">
        <BrandLogo variant="icon" size="sidebar" href="/discover" className="group" />
      </div>

      <nav className="cr-sidebar-nav">
        <NavItem href="/discover" icon={Home} label="Home" active={isHome && !isHooks} />
        <NavItem href="/discover" icon={Compass} label="Discover" active={false} />
        <NavItem href="/rooms" icon={LayoutGrid} label="Rooms" active={isRooms} />
        <NavItem href="/hooks" icon={Radio} label="Hooks" active={isHooks} />
        <NavItem href="/discover" icon={Activity} label="Activity" active={false} />
        <NavItem href="/messages" icon={MessageCircle} label="Messages" active={isMessages} badge={3} />
        <NavItem href="/notifications" icon={Bell} label="Notifications" active={isNotifications} badge={6} />
        <NavItem href="/settings" icon={Settings} label="Settings" active={isSettings} />
        {user && profile && (
          <NavItem
            href={`/profile/${profile.id}`}
            icon={User}
            label="Profile"
            active={isProfile}
          />
        )}
      </nav>

      <div className="cr-sidebar-bottom">
        {user && profile ? (
          <div className="cr-sidebar-footer">
            <div className="cr-sidebar-profile">
              <Avatar className="h-9 w-9 border border-border/50">
                <AvatarImage src={profile.avatarUrl || user.imageUrl || undefined} />
                <AvatarFallback className="text-xs bg-muted">
                  {profile.displayName?.charAt(0).toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate text-foreground/90">
                  {profile.displayName || user.firstName}
                </p>
                <p className="text-[10px] text-muted-foreground">Online</p>
              </div>
            </div>
            <button type="button" onClick={handleSignOut} className="cr-sidebar-ghost-btn w-full">
              <LogOut className="w-3.5 h-3.5" />
              Sign out
            </button>
          </div>
        ) : (
          <div className="cr-sidebar-auth-card">
            <img src={heroImg} alt="" className="cr-sidebar-auth-bg" />
            <div className="cr-sidebar-auth-overlay" />
            <div className="cr-sidebar-auth-content">
              <p className="cr-sidebar-auth-quote">
                The room is always open. No pressure. Just presence.
              </p>
              <Link href="/login">
                <button type="button" className="cr-sidebar-auth-btn">
                  Log in / Sign up
                </button>
              </Link>
              <Link href="/discover">
                <span className="cr-sidebar-guest-link">
                  Join as a guest
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </div>
          </div>
        )}

        <div className="cr-sidebar-wave">
          {[4, 7, 5, 9, 6, 8, 4, 7, 5, 10, 6, 8, 5, 7].map((h, i) => (
            <span key={i} className="cr-sidebar-wave-bar" style={{ height: `${h * 10}%` }} />
          ))}
        </div>
        <p className="cr-sidebar-tagline">Music is better together.</p>
      </div>
    </div>
  );
}
