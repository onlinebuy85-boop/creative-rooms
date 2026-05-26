import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useClerk, useUser } from "@clerk/react";
import { useGetMyProfile, getGetMyProfileQueryKey } from "@workspace/api-client-react";
import logoImg from "@assets/creative-rooms-wordmark.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Compass, Radio, LayoutDashboard, Plus, LogOut, User as UserIcon, Menu,
} from "lucide-react";

interface NavLinkProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
}

function NavLink({ href, icon: Icon, label, active }: NavLinkProps) {
  return (
    <Link href={href}>
      <div
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all cursor-pointer select-none"
        style={
          active
            ? { background: "rgba(212,163,65,0.12)", color: "#d4a341" }
            : { color: "rgba(255,255,255,0.45)" }
        }
        onMouseEnter={(e) => {
          if (!active) (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.85)";
        }}
        onMouseLeave={(e) => {
          if (!active) (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.45)";
        }}
      >
        <Icon className="w-[15px] h-[15px] flex-shrink-0" />
        <span className="font-light tracking-wide text-[13px]">{label}</span>
      </div>
    </Link>
  );
}

function WhatIsHooks() {
  return (
    <div
      className="rounded-xl p-4 relative overflow-hidden"
      style={{
        background: "linear-gradient(155deg, #1c1028 0%, #0e0a1a 100%)",
        border: "1px solid rgba(212,163,65,0.12)",
      }}
    >
      {/* atmospheric glow */}
      <div
        className="absolute -top-6 -right-6 w-20 h-20 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(212,163,65,0.15) 0%, transparent 70%)" }}
      />
      <p
        className="text-[9px] font-semibold tracking-[0.2em] uppercase mb-3"
        style={{ color: "rgba(212,163,65,0.55)" }}
      >
        What is Hooks?
      </p>
      <p className="text-[12px] leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
        Hooks are short ideas, riffs, melodies, lyrics or vibes that people throw out into the world.
      </p>
      <p className="text-[12px] mt-3" style={{ color: "rgba(255,255,255,0.35)" }}>
        It's an invitation.
      </p>
      <p
        className="text-[12px] italic mt-1.5 font-light leading-snug"
        style={{ color: "rgba(212,163,65,0.65)" }}
      >
        "Does anyone hear something in this?"
      </p>
    </div>
  );
}

function SidebarContent() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [location] = useLocation();
  const { data: profile } = useGetMyProfile({
    query: { enabled: !!user, queryKey: getGetMyProfileQueryKey() },
  });

  const isHooks = location === "/hooks" || location.startsWith("/hooks");

  const handleSignOut = () => {
    signOut({ redirectUrl: import.meta.env.BASE_URL.replace(/\/$/, "") || "/" });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Logo */}
      <div className="px-5 py-5 pb-4 flex-shrink-0">
        <Link href="/discover">
          <img
            src={logoImg}
            alt="Creative Rooms"
            style={{ height: 28, width: "auto", objectFit: "contain" }}
          />
        </Link>
      </div>

      {/* What is Hooks? — shown only on /hooks */}
      {isHooks && (
        <div className="px-3 pb-4 flex-shrink-0">
          <WhatIsHooks />
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto">
        <NavLink
          href="/discover"
          icon={Compass}
          label="Discover"
          active={location === "/discover" || location.startsWith("/discover")}
        />
        {user && (
          <NavLink
            href="/dashboard"
            icon={LayoutDashboard}
            label="Dashboard"
            active={location === "/dashboard"}
          />
        )}
        <NavLink
          href="/hooks"
          icon={Radio}
          label="Hooks"
          active={location === "/hooks"}
        />
        {user && (
          <NavLink
            href="/rooms/new"
            icon={Plus}
            label="New Room"
            active={location === "/rooms/new"}
          />
        )}
        {user && profile && (
          <NavLink
            href={`/profile/${profile.id}`}
            icon={UserIcon}
            label="Your Profile"
            active={location.startsWith("/profile")}
          />
        )}
      </nav>

      {/* Auth footer */}
      {user ? (
        <div className="flex-shrink-0 p-3 border-t border-white/5">
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg group cursor-default">
            <Avatar className="h-7 w-7 flex-shrink-0">
              <AvatarImage src={profile?.avatarUrl || user?.imageUrl} />
              <AvatarFallback className="text-[10px] bg-muted">
                {profile?.displayName?.charAt(0).toUpperCase() ||
                  user?.firstName?.charAt(0).toUpperCase() ||
                  "?"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-medium text-foreground/80 truncate">
                {profile?.displayName || user?.firstName}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              title="Sign out"
              className="transition-opacity p-1 rounded opacity-0 group-hover:opacity-100"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-shrink-0 p-3 border-t border-white/5 space-y-2">
          <Link href="/sign-up">
            <button
              className="w-full py-2 rounded-lg text-[12px] font-semibold transition-all hover:brightness-110"
              style={{ background: "linear-gradient(135deg,#e0b050,#c89030)", color: "#1a0f00" }}
            >
              Sign up free
            </button>
          </Link>
          <Link href="/sign-in">
            <button
              className="w-full py-2 rounded-lg text-[12px] transition-colors"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Log in
            </button>
          </Link>
        </div>
      )}

      {/* Tagline */}
      <div className="flex-shrink-0 px-5 py-4">
        <p className="text-[11px] leading-relaxed" style={{ color: "rgba(255,255,255,0.2)" }}>
          Real people. Real music.{" "}
          <span style={{ color: "rgba(212,163,65,0.4)" }}>Create together.</span>
        </p>
      </div>
    </div>
  );
}

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-[100dvh] flex bg-background relative">
      <div className="bg-noise" />

      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-[240px] z-40 border-r border-white/[0.06]"
        style={{ background: "hsl(270 16% 6%)" }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center px-4 h-14 border-b border-white/[0.06]"
        style={{ background: "hsl(270 16% 6%)" }}
      >
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="-ml-2">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[260px] p-0 border-r border-white/[0.06]"
            style={{ background: "hsl(270 16% 6%)" }}
          >
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Main content */}
      <main className="flex-1 md:ml-[240px] min-h-screen pt-14 md:pt-0 relative z-10">
        {children}
      </main>
    </div>
  );
}
