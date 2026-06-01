import { useState } from "react";
import { Link } from "wouter";
import { AppShell } from "@/components/layout/app-shell";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { RoomHero } from "@/components/rooms/room-hero";
import { RoomControls } from "@/components/rooms/room-controls";
import { RoomTrack } from "@/components/rooms/room-track";
import { AnalogMixer } from "@/components/rooms/analog-mixer";
import { RoomSettingsBar } from "@/components/rooms/room-settings-bar";
import { RoomChat } from "@/components/rooms/room-chat";
import { MessageCircle, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import { MOCK_ROOM } from "@/lib/room-mock-data";

function RoomStudioAmbient() {
  return (
    <div className="cr-room-studio-ambient" aria-hidden>
      <img
        src={MOCK_ROOM.heroImage}
        alt=""
        className="cr-room-studio-ambient-img"
        style={{ objectPosition: MOCK_ROOM.heroObjectPosition }}
      />
      <div className="cr-room-studio-ambient-scrim" />
    </div>
  );
}

function RoomStudioCenter() {
  return (
    <div className="cr-room-studio-center w-full max-w-[var(--center-content-max)] pb-4">
      <RoomHero />
      <RoomControls />
      <RoomTrack />
      <AnalogMixer />
      <RoomSettingsBar />
    </div>
  );
}

export function RoomStudioPage() {
  const [mobilePanel, setMobilePanel] = useState<"studio" | "chat">("studio");

  return (
    <div className="cr-room-studio-root min-h-[100dvh] bg-background relative">
      <RoomStudioAmbient />
      <div className="bg-noise" />

      {/* Desktop */}
      <div className="hidden lg:block min-h-[100dvh] relative z-[1]">
        <AppShell
          className="cr-room-studio-frame"
          sidebar={<SidebarNav />}
          rail={<RoomChat />}
        >
          <RoomStudioCenter />
        </AppShell>
      </div>

      {/* Tablet: center + collapsible chat via tabs */}
      <div className="hidden md:block lg:hidden min-h-[100dvh] relative z-[1]">
        <AppShell
          className="cr-room-studio-frame"
          sidebar={<SidebarNav />}
          rail={mobilePanel === "chat" ? <RoomChat /> : null}
        >
          <div className="w-full">
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => setMobilePanel("studio")}
                className={cn("cr-room-mobile-tab", mobilePanel === "studio" && "cr-room-mobile-tab--active")}
              >
                <LayoutGrid className="w-4 h-4" />
                Studio
              </button>
              <button
                type="button"
                onClick={() => setMobilePanel("chat")}
                className={cn("cr-room-mobile-tab", mobilePanel === "chat" && "cr-room-mobile-tab--active")}
              >
                <MessageCircle className="w-4 h-4" />
                Chat
              </button>
            </div>
            {mobilePanel === "studio" ? <RoomStudioCenter /> : null}
          </div>
        </AppShell>
      </div>

      {/* Mobile */}
      <div className="md:hidden flex flex-col min-h-[100dvh]">
        <header className="cr-room-mobile-header shrink-0">
          <Link href="/discover" className="text-sm text-muted-foreground">
            ← Back
          </Link>
          <span className="font-serif text-base text-foreground/90">Late night songwriters</span>
          <span className="cr-live-badge text-[10px] py-0.5 px-2">
            <span className="cr-live-dot scale-75" />
            Live
          </span>
        </header>

        <div className="flex shrink-0 gap-1 px-3 py-2 border-b border-border/30">
          <button
            type="button"
            onClick={() => setMobilePanel("studio")}
            className={cn("cr-room-mobile-tab flex-1", mobilePanel === "studio" && "cr-room-mobile-tab--active")}
          >
            Studio
          </button>
          <button
            type="button"
            onClick={() => setMobilePanel("chat")}
            className={cn("cr-room-mobile-tab flex-1", mobilePanel === "chat" && "cr-room-mobile-tab--active")}
          >
            Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4 min-h-0">
          {mobilePanel === "studio" ? (
            <RoomStudioCenter />
          ) : (
            <div className="h-full min-h-[50dvh]">
              <RoomChat />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
