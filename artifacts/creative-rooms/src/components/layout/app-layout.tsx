import { Link, useLocation } from "wouter";
import { useClerk, useUser } from "@clerk/react";
import { useGetMyProfile, getGetMyProfileQueryKey } from "@workspace/api-client-react";
import logoImg from "../../assets/images/creative-rooms-logo-v4.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Compass, Radio, LayoutDashboard, Plus, LogOut, User as UserIcon,
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
      <div
        className="flex-shrink-0 px-4 pt-7 pb-6"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.045)" }}
      >
        <Link href="/">
          <div className="relative group cursor-pointer" title="Return to home">
            <div
              className="absolute pointer-events-none transition-opacity duration-700"
              style={{
                left: -8, top: "50%", transform: "translateY(-50%)",
                width: 90, height: 80,
                background: "radial-gradient(ellipse at 38% 50%, rgba(200,130,30,0.32) 0%, rgba(212,163,65,0.10) 45%, transparent 70%)",
                animation: "warm-glow 3.5s ease-in-out infinite",
              }}
            />
            <div
              className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: "radial-gradient(ellipse at 25% 50%, rgba(212,163,65,0.18) 0%, transparent 65%)" }}
            />
            <img
              src={logoImg}
              alt="Creative Rooms"
              style={{
                width: "100%", height: "auto", objectFit: "contain", position: "relative",
                filter: "brightness(1.15) drop-shadow(0 0 10px rgba(212,163,65,0.3))",
                transition: "filter 0.4s ease, transform 0.3s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLImageElement).style.filter = "brightness(1.35) drop-shadow(0 0 20px rgba(212,163,65,0.65))";
                (e.currentTarget as HTMLImageElement).style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLImageElement).style.filter = "brightness(1.15) drop-shadow(0 0 10px rgba(212,163,65,0.3))";
                (e.currentTarget as HTMLImageElement).style.transform = "scale(1)";
              }}
            />
          </div>
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
        <NavLink href="/discover" icon={Compass} label="Discover" active={location === "/discover" || location.startsWith("/discover")} />
        {user && <NavLink href="/dashboard" icon={LayoutDashboard} label="Dashboard" active={location === "/dashboard"} />}
        <NavLink href="/hooks" icon={Radio} label="Hooks" active={location === "/hooks"} />
        {user && <NavLink href="/rooms/new" icon={Plus} label="New Room" active={location === "/rooms/new"} />}
        {user && profile && (
          <NavLink href={`/profile/${profile.id}`} icon={UserIcon} label="Your Profile" active={location.startsWith("/profile")} />
        )}
      </nav>

      {/* Auth footer */}
      {user ? (
        <div className="flex-shrink-0 p-3 border-t border-white/5">
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg group cursor-default">
            <Avatar className="h-7 w-7 flex-shrink-0">
              <AvatarImage src={profile?.avatarUrl || user?.imageUrl} />
              <AvatarFallback className="text-[10px] bg-muted">
                {profile?.displayName?.charAt(0).toUpperCase() || user?.firstName?.charAt(0).toUpperCase() || "?"}
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
            <button className="w-full py-2 rounded-lg text-[12px] transition-colors" style={{ color: "rgba(255,255,255,0.4)" }}>
              Log in
            </button>
          </Link>
        </div>
      )}

      {/* Ambient waveform */}
      <div className="flex-shrink-0 px-5 pb-5">
        <div className="flex items-end gap-[3px] h-[18px] mb-3 opacity-30">
          {[5,8,4,10,6,9,4,7,3,8,5,9,4,7,5,8,3,6].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-full"
              style={{
                height: `${h * 10}%`,
                background: "#d4a341",
                animation: `breathe ${1.8 + (i % 5) * 0.3}s ease-in-out infinite`,
                animationDelay: `${i * 0.09}s`,
              }}
            />
          ))}
        </div>
        <p className="text-[11px] leading-relaxed" style={{ color: "rgba(255,255,255,0.2)" }}>
          Real people. Real music.{" "}
          <span style={{ color: "rgba(212,163,65,0.4)" }}>Create together.</span>
        </p>
      </div>
    </div>
  );
}

/* ── Mobile bottom nav tab ── */
function BottomNavItem({
  href, icon: Icon, label, active,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
}) {
  return (
    <Link href={href}>
      <div className="flex flex-col items-center gap-1 py-2 px-4 min-w-[60px] cursor-pointer select-none">
        <div style={{ color: active ? "#d4a341" : "rgba(255,255,255,0.38)" }}>
          <Icon className="w-5 h-5" />
        </div>
        <span
          className="text-[10px] font-medium tracking-wide"
          style={{ color: active ? "#d4a341" : "rgba(255,255,255,0.32)" }}
        >
          {label}
        </span>
        {active && (
          <div
            className="absolute bottom-0 w-6 h-[2px] rounded-full"
            style={{ background: "#d4a341" }}
          />
        )}
      </div>
    </Link>
  );
}

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [location] = useLocation();
  const { user } = useUser();
  const { data: profile } = useGetMyProfile({
    query: { enabled: !!user, queryKey: getGetMyProfileQueryKey() },
  });

  return (
    <div className="min-h-[100dvh] flex bg-background relative">
      <div className="bg-noise" />

      {/* ── Desktop sidebar ── */}
      <aside
        className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-[240px] z-40 border-r border-white/[0.06]"
        style={{ background: "hsl(270 16% 6%)" }}
      >
        <SidebarContent />
      </aside>

      {/* ── Mobile top bar — logo only ── */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-center px-4 border-b border-white/[0.05]"
        style={{
          background: "rgba(10,7,16,0.93)",
          backdropFilter: "blur(14px)",
          height: "52px",
        }}
      >
        <Link href="/">
          <div className="relative">
            {/* Ambient pulse behind logo */}
            <div
              className="absolute pointer-events-none"
              style={{
                left: -10, top: "50%", transform: "translateY(-50%)",
                width: 80, height: 60,
                background: "radial-gradient(ellipse at 40% 50%, rgba(212,163,65,0.22) 0%, transparent 70%)",
                animation: "warm-glow 3.2s ease-in-out infinite",
              }}
            />
            <img
              src={logoImg}
              alt="Creative Rooms"
              style={{
                height: 40,
                width: "auto",
                objectFit: "contain",
                position: "relative",
                filter: "brightness(1.2) drop-shadow(0 0 12px rgba(212,163,65,0.50))",
              }}
            />
          </div>
        </Link>
      </div>

      {/* ── Main content ── */}
      <main className="flex-1 md:ml-[240px] min-h-screen pt-[52px] md:pt-0 pb-[72px] md:pb-0 relative z-10">
        {children}
      </main>

      {/* ── Mobile bottom navigation bar ── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-end justify-around border-t border-white/[0.06]"
        style={{
          background: "rgba(8,5,13,0.97)",
          backdropFilter: "blur(24px)",
          paddingBottom: "env(safe-area-inset-bottom, 6px)",
          height: "calc(72px + env(safe-area-inset-bottom, 0px))",
        }}
      >
        {/* Discover */}
        <BottomNavItem
          href="/discover"
          icon={Compass}
          label="Discover"
          active={location === "/discover" || location.startsWith("/discover")}
        />

        {/* Hooks */}
        <BottomNavItem
          href="/hooks"
          icon={Radio}
          label="Hooks"
          active={location === "/hooks"}
        />

        {/* ── CENTER PRIMARY ACTION — elevated gold button ── */}
        <Link href={user ? "/rooms/new" : "/sign-up"}>
          <div className="flex flex-col items-center gap-1.5 pb-2 cursor-pointer select-none" style={{ marginTop: "-18px" }}>
            {/* Outer glow ring */}
            <div className="relative">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: "radial-gradient(circle, rgba(212,163,65,0.35) 0%, transparent 70%)",
                  animation: "breathe 2.4s ease-in-out infinite",
                  transform: "scale(1.5)",
                }}
              />
              <div
                className="relative w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-95"
                style={{
                  background: "linear-gradient(145deg, #e8bc55, #c48c28)",
                  boxShadow: "0 4px 24px rgba(212,163,65,0.45), 0 0 0 1px rgba(212,163,65,0.2)",
                }}
              >
                <Plus className="w-6 h-6" style={{ color: "#1a0f00", strokeWidth: 2.5 }} />
              </div>
            </div>
            <span
              className="text-[9px] font-semibold tracking-widest uppercase"
              style={{ color: "rgba(212,163,65,0.65)", letterSpacing: "0.12em" }}
            >
              {user ? "Create" : "Join"}
            </span>
          </div>
        </Link>

        {/* Profile (signed-in) or quiet placeholder (guest) */}
        {user && profile ? (
          <BottomNavItem
            href={`/profile/${profile.id}`}
            icon={UserIcon}
            label="Profile"
            active={location.startsWith("/profile")}
          />
        ) : (
          <BottomNavItem
            href="/sign-in"
            icon={UserIcon}
            label="Log in"
            active={false}
          />
        )}

        {/* Settings / extra nav slot — keeps symmetry */}
        <BottomNavItem
          href="/about"
          icon={Compass}
          label="About"
          active={location === "/about"}
        />
      </nav>
    </div>
  );
}
