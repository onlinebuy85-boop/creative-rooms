import { HomeDashboard } from "@/components/home/home-dashboard";
import { PageShell } from "@/components/layout/page-shell";
import { UtilityRail } from "@/components/home/utility-rail";

export function DiscoverPage() {
  return (
    <PageShell className="cr-page--discover" rail={<UtilityRail />}>
      <HomeDashboard />
    </PageShell>
  );
}
