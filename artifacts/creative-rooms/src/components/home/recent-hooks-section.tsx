import { Link } from "wouter";
import type { Hook } from "@workspace/api-client-react";
import { HookCard } from "@/components/hooks/hook-card";
import { Skeleton } from "@/components/ui/skeleton";
import { DemoHookRow } from "@/components/home/demo-hook-row";
import { resolveHooksForDisplay } from "@/lib/discover-demo-data";

interface RecentHooksSectionProps {
  hooks?: Hook[];
  isLoading?: boolean;
  currentProfileId?: number;
  limit?: number;
}

function HookSkeletonRow() {
  return <Skeleton className="cr-hook-skeleton-row w-full bg-muted/25" />;
}

export function RecentHooksSection({
  hooks,
  isLoading,
  currentProfileId,
  limit = 4,
}: RecentHooksSectionProps) {
  const { list, isDemo, showSkeleton } = resolveHooksForDisplay(hooks, isLoading, limit);

  return (
    <section className="cr-section cr-recent-hooks-section">
      <div className="cr-section-header">
        <h2 className="cr-section-title">Recent hooks</h2>
        <Link href="/hooks" className="cr-section-link">
          View all
        </Link>
      </div>

      <div className="cr-hooks-tracks">
        {showSkeleton ? (
          <div className="cr-hooks-tracks-inner">
            {[1, 2, 3, 4].map((i) => (
              <HookSkeletonRow key={i} />
            ))}
          </div>
        ) : isDemo ? (
          <div className="cr-hooks-tracks-inner">
            {list.map((hook, i) => (
              <DemoHookRow key={hook.id} hook={hook} index={i} />
            ))}
          </div>
        ) : (
          <div className="cr-hooks-tracks-inner cr-hooks-tracks-inner--api">
            {list.map((hook) => (
              <HookCard key={hook.id} hook={hook} currentProfileId={currentProfileId} />
            ))}
          </div>
        )}
      </div>

      <Link href="/hooks" className="cr-section-footer-link">
        Browse all hooks →
      </Link>
    </section>
  );
}
