import { Link } from "wouter";
import { ArrowLeft, MoreHorizontal, Headphones, ArrowRight, Radio } from "lucide-react";
import type { DemoNotification } from "@/lib/notifications-demo-data";
import { QuickActions } from "@/components/notifications/quick-actions";

interface NotificationPreviewPanelProps {
  notification: DemoNotification;
  onBack?: () => void;
  onMarkRead?: () => void;
}

export function NotificationPreviewPanel({
  notification,
  onMarkRead,
}: NotificationPreviewPanelProps) {
  const p = notification.preview;

  return (
    <aside className="cr-notif-preview">
      <header className="cr-notif-preview-header">
        <button type="button" className="cr-notif-preview-back lg:hidden" aria-label="Back">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="cr-notif-preview-cat">{p.categoryLabel}</span>
        <button type="button" className="cr-notif-preview-menu" aria-label="More">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </header>

      <div className="cr-notif-preview-sender">
        <span
          className="cr-notif-preview-avatar"
          style={{ background: `hsl(${p.senderHue} 32% 26%)` }}
        >
          {p.senderInitials}
        </span>
        <div>
          <p className="cr-notif-preview-name">{p.senderName}</p>
          <p className="cr-notif-preview-time">{notification.timestamp}</p>
        </div>
      </div>

      <div className="cr-notif-preview-scroll">
        <h2 className="cr-notif-preview-headline">
          {p.headline}
          {p.liveBadge && (
            <span className="cr-notif-live-pill cr-notif-live-pill--lg">
              <Radio className="w-3.5 h-3.5" />
              LIVE
            </span>
          )}
        </h2>

        {p.hookMeta && <p className="cr-notif-preview-hook-meta">{p.hookMeta}</p>}

        {p.heroImage && (
          <div className="cr-notif-preview-hero-wrap">
            <img src={p.heroImage} alt="" className="cr-notif-preview-hero" />
            <div className="cr-notif-preview-hero-gradient" />
          </div>
        )}

        {p.peopleCount != null && (
          <div className="cr-notif-preview-people">
            <span className="cr-notif-preview-people-label">{p.peopleCount} people in the room</span>
            <div className="cr-notif-preview-member-stack">
              {p.memberAvatars.map((a, i) => (
                <span key={i} className="cr-notif-preview-member">
                  {a}
                </span>
              ))}
              {p.extraMembers != null && p.extraMembers > 0 && (
                <span className="cr-notif-preview-member cr-notif-preview-member--more">
                  +{p.extraMembers}
                </span>
              )}
            </div>
          </div>
        )}

        {p.message && (
          <div className="cr-notif-preview-message">
            <p>{p.message}</p>
          </div>
        )}

        <div className="cr-notif-preview-ctas">
          <Link href={p.primaryCta.href} className="cr-notif-cta-primary">
            {p.primaryCta.icon === "headphones" && <Headphones className="w-4 h-4" />}
            {p.primaryCta.label}
          </Link>
          {p.secondaryCta && (
            <Link href={p.secondaryCta.href} className="cr-notif-cta-secondary">
              {p.secondaryCta.label}
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        <QuickActions senderName={p.senderName} onMarkRead={onMarkRead} />
      </div>
    </aside>
  );
}
