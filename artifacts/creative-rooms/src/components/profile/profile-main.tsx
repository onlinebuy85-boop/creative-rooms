import { ProfileHero } from "@/components/profile/profile-hero";
import { ProfileTabs } from "@/components/profile/profile-tabs";
import { ProfileRecentRooms } from "@/components/profile/profile-recent-rooms";
import { ProfileRecentHooks } from "@/components/profile/profile-recent-hooks";
import {
  DEMO_PROFILE,
  PROFILE_RECENT_HOOKS,
  PROFILE_RECENT_ROOMS,
  type ProfileTab,
} from "@/lib/profile-data";

interface ProfileMainProps {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
  isOwnProfile?: boolean;
}

export function ProfileMain({ activeTab, onTabChange, isOwnProfile }: ProfileMainProps) {
  return (
    <div className="cr-profile-main">
      <ProfileHero profile={DEMO_PROFILE} isOwnProfile={isOwnProfile} />
      <ProfileTabs activeTab={activeTab} onTabChange={onTabChange} />

      <div className="cr-profile-content">
        {activeTab === "Overview" ? (
          <>
            <ProfileRecentRooms rooms={PROFILE_RECENT_ROOMS} />
            <ProfileRecentHooks hooks={PROFILE_RECENT_HOOKS} />
          </>
        ) : (
          <section className="cr-profile-card cr-profile-placeholder">
            <p className="cr-profile-placeholder-title">{activeTab}</p>
            <p className="cr-profile-placeholder-desc">
              More from {DEMO_PROFILE.displayName}&apos;s {activeTab.toLowerCase()} is coming
              soon. Overview shows recent rooms and hooks for now.
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
