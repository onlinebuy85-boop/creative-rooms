import { SidebarNav } from "@/components/layout/sidebar-nav";
import { RoomsRightRail } from "@/components/rooms/rooms-right-rail";

interface RoomsAppShellProps {
  children: React.ReactNode;
}

/** Rooms overview: 240px nav | discovery grid | 392px rail */
export function RoomsAppShell({ children }: RoomsAppShellProps) {
  return (
    <div className="cr-rooms-app">
      <aside className="cr-rooms-app-sidebar hidden md:flex">
        <SidebarNav />
      </aside>
      <div className="cr-rooms-app-columns">
        <main className="cr-rooms-app-main">{children}</main>
        <aside className="cr-rooms-app-rail hidden xl:block">
          <RoomsRightRail />
        </aside>
      </div>
    </div>
  );
}
