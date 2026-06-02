import { LayoutGrid, Radio, Activity, User, Sparkles } from "lucide-react";
import { PROFILE_TABS, type ProfileTab } from "@/lib/profile-data";
import { cn } from "@/lib/utils";

const TAB_ICONS: Record<ProfileTab, React.ComponentType<{ className?: string }>> = {
  Overview: Sparkles,
  Hooks: Radio,
  Rooms: LayoutGrid,
  Activity: Activity,
  About: User,
};

interface ProfileTabsProps {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
}

export function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
  return (
    <div className="cr-profile-tabs" role="tablist">
      {PROFILE_TABS.map((tab) => {
        const Icon = TAB_ICONS[tab];
        return (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => onTabChange(tab)}
            className={cn("cr-profile-tab", activeTab === tab && "cr-profile-tab--active")}
          >
            <Icon className="w-4 h-4 shrink-0" strokeWidth={1.75} />
            {tab}
          </button>
        );
      })}
    </div>
  );
}
