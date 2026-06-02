import { SlidersHorizontal } from "lucide-react";
import { NotificationTabs } from "@/components/notifications/notification-tabs";
import { NotificationCard } from "@/components/notifications/notification-card";
import type { DemoNotification, NotificationTab } from "@/lib/notifications-demo-data";

interface NotificationFeedProps {
  notifications: DemoNotification[];
  allNotifications: DemoNotification[];
  activeId: string;
  onSelect: (id: string) => void;
  activeTab: NotificationTab;
  onTabChange: (tab: NotificationTab) => void;
  onMarkAllRead: () => void;
}

export function NotificationFeed({
  notifications,
  allNotifications,
  activeId,
  onSelect,
  activeTab,
  onTabChange,
  onMarkAllRead,
}: NotificationFeedProps) {
  return (
    <main className="cr-notif-feed">
      <header className="cr-notif-feed-header">
        <div>
          <h1 className="cr-notif-page-title font-serif">Notifications</h1>
          <p className="cr-notif-page-subtitle">
            Stay updated with what&apos;s happening in your world.
          </p>
        </div>
        <div className="cr-notif-feed-actions">
          <button type="button" className="cr-notif-mark-all" onClick={onMarkAllRead}>
            Mark all as read
          </button>
          <button type="button" className="cr-notif-filter-btn" aria-label="Filter">
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </header>

      <NotificationTabs
        activeTab={activeTab}
        onTabChange={onTabChange}
        allNotifications={allNotifications}
      />

      <div className="cr-notif-feed-list">
        {notifications.map((n) => (
          <NotificationCard
            key={n.id}
            notification={n}
            active={n.id === activeId}
            onSelect={() => onSelect(n.id)}
          />
        ))}
        {notifications.length === 0 && (
          <p className="cr-notif-empty">Nothing in this filter right now.</p>
        )}
      </div>
    </main>
  );
}
