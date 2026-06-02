import {
  Users,
  AtSign,
  GitBranch,
  Heart,
  Handshake,
  Share2,
  Bell,
  Radio,
} from "lucide-react";
import type { DemoNotification } from "@/lib/notifications-demo-data";
import { seedWaveBars, MiniWaveform } from "@/components/ui/mini-waveform";
import { cn } from "@/lib/utils";

const ICON_MAP = {
  room_invite: Users,
  reply: GitBranch,
  mention: AtSign,
  reaction: Heart,
  collab_request: Handshake,
  share: Share2,
  system: Bell,
} as const;

interface NotificationCardProps {
  notification: DemoNotification;
  active: boolean;
  onSelect: () => void;
}

export function NotificationCard({ notification, active, onSelect }: NotificationCardProps) {
  const Icon = ICON_MAP[notification.iconKind];
  const n = notification;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn("cr-notif-card", active && "cr-notif-card--active", n.unread && "cr-notif-card--unread")}
    >
      <div className={cn("cr-notif-icon-block", `cr-notif-icon-block--${n.kind}`)}>
        <Icon className="w-4 h-4" strokeWidth={1.75} />
      </div>

      <div className="cr-notif-card-avatar-wrap">
        {n.previewImage && n.kind !== "room_invite" ? (
          <img src={n.previewImage} alt="" className="cr-notif-card-avatar-img" />
        ) : (
          <span
            className="cr-notif-card-avatar-letter"
            style={{ background: `hsl(${n.senderHue} 32% 26%)` }}
          >
            {n.senderInitials}
          </span>
        )}
      </div>

      <div className="cr-notif-card-body min-w-0 flex-1">
        <p className="cr-notif-card-title">{n.title}</p>
        <p className="cr-notif-card-subtitle">
          {n.subtitle}
          {n.liveInSubtitle && (
            <span className="cr-notif-live-pill">
              <Radio className="w-3 h-3" />
              LIVE
            </span>
          )}
        </p>
        {n.meta && <p className="cr-notif-card-meta">{n.meta}</p>}
        {n.stackedAvatars && (
          <div className="cr-notif-stacked-avatars mt-1">
            {n.stackedAvatars.map((a, i) => (
              <span key={i} className="cr-notif-stacked-avatar">
                {a}
              </span>
            ))}
          </div>
        )}
      </div>

      {(n.previewImage && n.kind === "room_invite") || n.hasWaveform ? (
        <div className="cr-notif-card-media shrink-0">
          {n.hasWaveform && n.waveSeed != null ? (
            <div className="cr-notif-wave-preview">
              <MiniWaveform
                bars={seedWaveBars(n.waveSeed, 16)}
                accent="#a89bc4"
                height="sm"
              />
            </div>
          ) : n.previewImage ? (
            <img src={n.previewImage} alt="" className="cr-notif-thumb" />
          ) : null}
        </div>
      ) : null}

      <div className="cr-notif-card-aside shrink-0">
        <span className="cr-notif-time">{n.timestamp}</span>
        {n.unread && <span className="cr-notif-unread-dot" aria-label="Unread" />}
      </div>
    </button>
  );
}
