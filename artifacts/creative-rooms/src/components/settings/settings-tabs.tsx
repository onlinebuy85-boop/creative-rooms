import { SETTINGS_TABS, type SettingsTab } from "@/lib/settings-demo-data";
import { cn } from "@/lib/utils";

interface SettingsTabsProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}

export function SettingsTabs({ activeTab, onTabChange }: SettingsTabsProps) {
  return (
    <div className="cr-settings-tabs" role="tablist">
      {SETTINGS_TABS.map(({ id, icon: Icon }) => (
        <button
          key={id}
          type="button"
          role="tab"
          aria-selected={activeTab === id}
          onClick={() => onTabChange(id)}
          className={cn("cr-settings-tab", activeTab === id && "cr-settings-tab--active")}
        >
          <Icon className="w-4 h-4 shrink-0" strokeWidth={1.75} />
          {id}
        </button>
      ))}
    </div>
  );
}
