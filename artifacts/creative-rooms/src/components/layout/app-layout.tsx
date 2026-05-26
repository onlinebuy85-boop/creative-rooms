import { Link, useLocation } from "wouter";
import { useClerk, useUser } from "@clerk/react";
import { useGetMyProfile, getGetMyProfileQueryKey } from "@workspace/api-client-react";
import logoImg from "../../assets/images/creative-rooms-logo-v4.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Compass, Radio, Plus, LogOut, User as UserIcon, Info,
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
  const isHome = location === "/" || location === "/discover" || location.startsWith("/discover");

  const handleSignOut = () => {
    signOut({ redirectUrl: import.meta.env.BASE_URL.replace(/\/$/, "") || "/" });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Logo — always a home button */}
      <div
        className="flex-shrink-0 px-4 pt-7 pb-6"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.045)" }}
      >
        <Link href={user ? "/discover" : "/"}>
          <div className="relative cursor-pointer" title="Home">
            <div
              className="absolute pointer-events-none"
              style={{
                left: -10, top: "50%", transform: "translateY(-50%)",
                width: 170, height: 70,
                background: "radial-gradient(ellipse at 28% 50%, rgba(212,163,65,0.20) 0%, rgba(212,163,65,0.04) 50%, transparent 75%)",
                animation: "warm-glow 5s ease-in-out infinite",
              }}
            />
            <img
              src={logoImg}
              alt="Creative Room"
              style={{
                height: 32, width: "auto", objectFit: "contain", position: "relative",
                maxWidth: 184,
                filter: "brightness(1.12) drop-shadow(0 0 10px rgba(212,163,65,0.32))",
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
        <NavLink
          href="/discover"
          icon={Compass}
          label="Discover"
          active={isHome}
        />
        <NavLink
          href="/hooks"
          icon={Radio}
          label="Hooks"
          active={location === "/hooks"}
        />
        {user && profile && (
          <NavLink
            href={`/profile/${profile.id}`}
            icon={UserIcon}
            label="Your Profile"
            active={location.startsWith("/profile")}
          />
        )}
        <NavLink
          href="/about"
          icon={Info}
          label="About"
          active={location === "/about"}
        />
      </nav>

      {/* Auth footer */}
      {user ? (
        <div className="flex-shrink-0 border-t border-white/5" style={{ padding: "10px 12px" }}>
          {/* User info row */}
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg mb-1">
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
          </div>
          {/* Always-visible sign out */}
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] transition-all"
            style={{ color: "rgba(255,255,255,0.35)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.65)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.35)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
          >
            <LogOut className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Sign out</span>
          </button>
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
  href, icon: Icon, label, active, avatarSrc, avatarFallback,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
  avatarSrc?: string;
  avatarFallback?: string;
}) {
  const activeColor = "#d4a341";
  const inactiveColor = "rgba(255,255,255,0.38)";

  return (
    <Link href={href}>
      <div
        className="relative flex flex-col items-center gap-1 py-2 px-3 min-w-[56px] cursor-pointer select-none"
        style={{ minHeight: 52 }}
      >
        {/* Icon or avatar */}
        {avatarSrc !== undefined ? (
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              overflow: "hidden",
              border: active ? `2px solid ${activeColor}` : "2px solid rgba(255,255,255,0.18)",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(212,163,65,0.1)",
              transition: "border-color 0.2s",
            }}
          >
            {avatarSrc ? (
              <img src={avatarSrc} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <span style={{ fontSize: 10, fontWeight: 600, color: active ? activeColor : inactiveColor }}>
                {avatarFallback}
              </span>
            )}
          </div>
        ) : (
          <div style={{ color: active ? activeColor : inactiveColor, transition: "color 0.2s" }}>
            <Icon className="w-5 h-5" />
          </div>
        )}

        <span
          className="text-[10px] font-medium tracking-wide"
          style={{
            color: active ? activeColor : "rgba(255,255,255,0.32)",
            transition: "color 0.2s",
          }}
        >
          {label}
        </span>

        {/* Active indicator dot */}
        {active && (
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
            style={{ background: activeColor }}
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
  const { signOut } = useClerk();
  const { data: profile } = useGetMyProfile({
    query: { enabled: !!user, queryKey: getGetMyProfileQueryKey() },
  });

  const isHome = location === "/" || location === "/discover" || location.startsWith("/discover");
  const isHooks = location === "/hooks";
  const isProfile = location.startsWith("/profile");
  const isAbout = location === "/about";

  const handleSignOut = () => {
    signOut({ redirectUrl: import.meta.env.BASE_URL.replace(/\/$/, "") || "/" });
  };

  return (
    <div className="min-h-[100dvh] flex bg-background relative overflow-x-hidden w-full max-w-[100vw]">
      <div className="bg-noise" />

      {/* ── Desktop sidebar ── */}
      <aside
        className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-[240px] z-40 border-r border-white/[0.06]"
        style={{ background: "hsl(270 16% 6%)" }}
      >
        <SidebarContent />
      </aside>

      {/* ── Mobile top bar ── */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 border-b border-white/[0.05]"
        style={{
          background: "rgba(10,7,16,0.92)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          height: "calc(56px + env(safe-area-inset-top, 0px))",
          paddingTop: "env(safe-area-inset-top, 0px)",
        }}
      >
        {/* Logo — tapping always goes home */}
        <Link href={user ? "/discover" : "/"}>
          <div className="relative flex items-center cursor-pointer">
            <div
              className="absolute pointer-events-none"
              style={{
                left: -14, top: "50%", transform: "translateY(-50%)",
                width: "108%", height: 56,
                background: "radial-gradient(ellipse at 30% 50%, rgba(212,163,65,0.14) 0%, rgba(212,163,65,0.025) 50%, transparent 75%)",
                animation: "warm-glow 5s ease-in-out infinite",
              }}
            />
            <img
              src={logoImg}
              alt="Creative Room — Home"
              style={{
                height: 26,
                width: "auto",
                objectFit: "contain",
                position: "relative",
                filter: "brightness(1.1) drop-shadow(0 0 10px rgba(212,163,65,0.32))",
              }}
            />
          </div>
        </Link>

        {/* Right side: avatar + sign-out when logged in, or sign-in link */}
        {user && profile ? (
          <div className="flex items-center gap-2">
            <Link href={`/profile/${profile.id}`}>
              <div
                style={{
                  width: 32, height: 32, borderRadius: "50%", overflow: "hidden",
                  border: isProfile ? "2px solid #d4a341" : "2px solid rgba(255,255,255,0.18)",
                  cursor: "pointer", flexShrink: 0,
                  background: "rgba(212,163,65,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "border-color 0.2s",
                }}
              >
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span style={{ fontSize: 12, fontWeight: 600, color: isProfile ? "#d4a341" : "rgba(255,255,255,0.6)" }}>
                    {profile.displayName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </Link>
            <button
              onClick={handleSignOut}
              title="Sign out"
              style={{
                width: 32, height: 32, borderRadius: 99,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: "rgba(255,255,255,0.45)",
                flexShrink: 0,
              }}
            >
              <LogOut size={14} />
            </button>
          </div>
        ) : (
          !user && (
            <Link href="/sign-in">
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", cursor: "pointer" }}>
                Log in
              </span>
            </Link>
          )
        )}
      </div>

      {/* ── Main content ── */}
      <main
        className="flex-1 min-w-0 md:ml-[240px] min-h-screen md:pt-0 pb-[72px] md:pb-0 relative z-10 overflow-x-hidden"
        style={{ paddingTop: "calc(56px + env(safe-area-inset-top, 0px))" }}
      >
        {children}
      </main>

      {/* ── Mobile bottom navigation bar ── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-end justify-around border-t border-white/[0.06]"
        style={{
          background: "rgba(8,5,13,0.97)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          paddingBottom: "env(safe-area-inset-bottom, 6px)",
          height: "calc(64px + env(safe-area-inset-bottom, 0px))",
        }}
      >
        {/* Discover */}
        <BottomNavItem
          href="/discover"
          icon={Compass}
          label="Discover"
          active={isHome}
        />

        {/* Hooks */}
        <BottomNavItem
          href="/hooks"
          icon={Radio}
          label="Hooks"
          active={isHooks}
        />

        {/* ── CENTER: Create (elevated gold button) ── */}
        <Link href={user ? "/rooms/new" : "/sign-up"}>
          <div
            className="flex flex-col items-center gap-1 pb-2 cursor-pointer select-none"
            style={{ marginTop: "-20px" }}
          >
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

        {/* Profile (signed-in) or Log in (guest) */}
        {user && profile ? (
          <BottomNavItem
            href={`/profile/${profile.id}`}
            icon={UserIcon}
            label="Profile"
            active={isProfile}
            avatarSrc={profile.avatarUrl ?? ""}
            avatarFallback={profile.displayName.charAt(0).toUpperCase()}
          />
        ) : (
          <BottomNavItem
            href="/sign-in"
            icon={UserIcon}
            label="Log in"
            active={false}
          />
        )}

        {/* About */}
        <BottomNavItem
          href="/about"
          icon={Info}
          label="About"
          active={isAbout}
        />
      </nav>
    </div>
  );
}
