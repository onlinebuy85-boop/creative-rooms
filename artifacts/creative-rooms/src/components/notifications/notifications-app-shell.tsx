import { SidebarNav } from "@/components/layout/sidebar-nav";

interface NotificationsAppShellProps {
  feed: React.ReactNode;
  preview: React.ReactNode;
}

/** Nav | notification feed (flex) | preview (~360px) */
export function NotificationsAppShell({ feed, preview }: NotificationsAppShellProps) {
  return (
    <div className="cr-notifications-app">
      <aside className="cr-notifications-app-nav hidden md:flex">
        <SidebarNav />
      </aside>
      <div className="cr-notifications-app-body">
        {feed}
        <div className="cr-notifications-preview-wrap hidden lg:block">{preview}</div>
      </div>
    </div>
  );
}
