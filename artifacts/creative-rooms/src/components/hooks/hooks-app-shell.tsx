import { SidebarNav } from "@/components/layout/sidebar-nav";
import { HooksRail } from "@/components/hooks/hooks-rail";
import { HooksPlayer } from "@/components/hooks/hooks-player";
import type { HookFeedItem } from "@/lib/hooks-feed-data";

interface HooksAppShellProps {
  children: React.ReactNode;
  activeHook?: HookFeedItem | null;
}

/** Full hooks viewport: 240px nav | flex feed | 350px rail + sticky player under feed */
export function HooksAppShell({ children, activeHook }: HooksAppShellProps) {
  return (
    <div className="cr-hooks-app">
      <aside className="cr-hooks-app-sidebar hidden md:flex">
        <SidebarNav />
      </aside>

      <div className="cr-hooks-app-body">
        <div className="cr-hooks-app-columns">
          <main className="cr-hooks-app-main">{children}</main>
          <aside className="cr-hooks-app-rail hidden xl:block">
            <HooksRail />
          </aside>
        </div>
        <HooksPlayer hook={activeHook ?? null} />
      </div>
    </div>
  );
}
