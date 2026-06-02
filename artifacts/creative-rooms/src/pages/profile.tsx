import { useState } from "react";
import { useParams } from "wouter";
import { PageShell } from "@/components/layout/page-shell";
import { ProfileMain } from "@/components/profile/profile-main";
import { ProfileRail } from "@/components/profile/profile-rail";
import { DEMO_PROFILE, type ProfileTab } from "@/lib/profile-data";

/** Creator profile — mock data for UI preview (dev & demo). */
export function ProfilePage() {
  const params = useParams<{ id?: string }>();
  const [activeTab, setActiveTab] = useState<ProfileTab>("Overview");

  const isOwnProfile = !params.id || params.id === DEMO_PROFILE.id || params.id === "1";

  return (
    <PageShell
      className="cr-page--profile"
      bleed
      rail={<ProfileRail profile={DEMO_PROFILE} />}
    >
      <ProfileMain
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isOwnProfile={isOwnProfile}
      />
    </PageShell>
  );
}
