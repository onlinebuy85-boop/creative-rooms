import { Check, BellOff, Users, Flag } from "lucide-react";

interface QuickActionsProps {
  senderName: string;
  onMarkRead?: () => void;
}

export function QuickActions({ senderName, onMarkRead }: QuickActionsProps) {
  return (
    <section className="cr-notif-quick">
      <h3 className="cr-notif-quick-title">Quick actions</h3>
      <div className="cr-notif-quick-grid">
        <button type="button" className="cr-notif-quick-btn" onClick={onMarkRead}>
          <Check className="w-4 h-4" />
          Mark as read
        </button>
        <button type="button" className="cr-notif-quick-btn">
          <BellOff className="w-4 h-4" />
          Mute invites from {senderName}
        </button>
        <button type="button" className="cr-notif-quick-btn">
          <Users className="w-4 h-4" />
          See all invites
        </button>
        <button type="button" className="cr-notif-quick-btn cr-notif-quick-btn--danger">
          <Flag className="w-4 h-4" />
          Report
        </button>
      </div>
    </section>
  );
}
