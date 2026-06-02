import { NOTIFICATION_TABS, tabUnreadCount, type DemoNotification, type NotificationTab } from "@/lib/notifications-demo-data";
import { cn } from "@/lib/utils";

interface NotificationTabsProps {
  activeTab: NotificationTab;
  onTabChange: (tab: NotificationTab) => void;
  allNotifications: DemoNotification[];
}

export function NotificationTabs({ activeTab, onTabChange, allNotifications }: NotificationTabsProps) {
  return (
    <div className="cr-notif-tabs" role="tablist">
      {NOTIFICATION_TABS.map((tab) => {
        const count = tabUnreadCount(tab, allNotifications);
        return (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => onTabChange(tab)}
            className={cn("cr-notif-tab", activeTab === tab && "cr-notif-tab--active")}
          >
            {tab}
            {count > 0 && <span className="cr-notif-tab-badge">{count}</span>}
          </button>
        );
      })}
    </div>
  );
}
