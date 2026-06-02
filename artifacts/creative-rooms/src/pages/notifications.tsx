import { useMemo, useState } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { NotificationFeed } from "@/components/notifications/notification-feed";
import { NotificationPreviewPanel } from "@/components/notifications/notification-preview-panel";
import {
  DEMO_NOTIFICATIONS,
  filterNotifications,
  getDefaultNotificationId,
  type NotificationTab,
  type DemoNotification,
} from "@/lib/notifications-demo-data";

export function NotificationsPage() {
  const [items, setItems] = useState<DemoNotification[]>(DEMO_NOTIFICATIONS);
  const [activeId, setActiveId] = useState(getDefaultNotificationId);
  const [activeTab, setActiveTab] = useState<NotificationTab>("All");

  const filtered = useMemo(
    () => filterNotifications(items, activeTab),
    [items, activeTab],
  );

  const active =
    items.find((n) => n.id === activeId) ?? items[0];

  const handleMarkAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleMarkRead = () => {
    setItems((prev) =>
      prev.map((n) => (n.id === activeId ? { ...n, unread: false } : n)),
    );
  };

  return (
    <PageShell
      className="cr-page--notifications"
      rail={
        <NotificationPreviewPanel
          notification={active}
          onMarkRead={handleMarkRead}
        />
      }
    >
      <NotificationFeed
        notifications={filtered}
        allNotifications={items}
        activeId={active.id}
        onSelect={setActiveId}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onMarkAllRead={handleMarkAllRead}
      />
    </PageShell>
  );
}
