import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { HookFeedCard } from "@/components/hooks/hook-feed-card";
import type { HookFeedItem } from "@/lib/hooks-feed-data";

interface ProfileRecentHooksProps {
  hooks: HookFeedItem[];
}

export function ProfileRecentHooks({ hooks }: ProfileRecentHooksProps) {
  return (
    <section className="cr-profile-section">
      <header className="cr-profile-section-header">
        <h2 className="cr-profile-section-title">Recent hooks</h2>
        <Link href="/hooks" className="cr-profile-section-link">
          View all hooks
          <ArrowRight className="w-4 h-4" />
        </Link>
      </header>

      <div className="cr-hooks-page cr-profile-hooks-list">
        {hooks.map((hook) => (
          <HookFeedCard key={hook.id} hook={hook} />
        ))}
      </div>

      <Link href="/hooks" className="cr-profile-hooks-footer-btn">
        View all hooks
        <ArrowRight className="w-4 h-4" />
      </Link>
    </section>
  );
}
