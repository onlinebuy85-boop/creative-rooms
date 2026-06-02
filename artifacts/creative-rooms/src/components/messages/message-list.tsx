import { cn } from "@/lib/utils";
import type { DemoConversation } from "@/lib/messages-demo-data";
import { seedWaveBars, MiniWaveform } from "@/components/ui/mini-waveform";
import { WAVE_COLORS } from "@/lib/messages-demo-data";

interface MessageListProps {
  conversations: DemoConversation[];
  activeId: string;
  onSelect: (id: string) => void;
}

export function MessageList({ conversations, activeId, onSelect }: MessageListProps) {
  return (
    <ul className="cr-msg-list">
      {conversations.map((c) => {
        const active = c.id === activeId;
        return (
          <li key={c.id}>
            <button
              type="button"
              onClick={() => onSelect(c.id)}
              className={cn("cr-msg-convo-card", active && "cr-msg-convo-card--active")}
            >
              <div className="cr-msg-convo-avatar-wrap">
                {c.avatarImage ? (
                  <img src={c.avatarImage} alt="" className="cr-msg-convo-avatar-img" />
                ) : (
                  <div className="cr-msg-convo-avatar-stack">
                    {(c.avatarInitials ?? ["?"]).slice(0, 3).map((init, i) => (
                      <span
                        key={i}
                        className="cr-msg-convo-avatar-letter"
                        style={{ zIndex: 3 - i }}
                      >
                        {init}
                      </span>
                    ))}
                  </div>
                )}
                {c.isOnline && <span className="cr-msg-online-dot" aria-label="Online" />}
              </div>

              <div className="cr-msg-convo-body min-w-0 flex-1">
                <div className="cr-msg-convo-top">
                  <span className="cr-msg-convo-title truncate">{c.title}</span>
                  <span className="cr-msg-convo-time">{c.timestamp}</span>
                </div>
                <p className="cr-msg-convo-preview truncate">{c.preview}</p>
                {c.hasWaveform && c.waveSeed != null && (
                  <MiniWaveform
                    bars={seedWaveBars(c.waveSeed, 18)}
                    accent={WAVE_COLORS.amber}
                    height="sm"
                    className="cr-msg-convo-wave mt-1.5 opacity-80"
                  />
                )}
              </div>

              {c.unreadCount > 0 && (
                <span className="cr-msg-unread-badge">{c.unreadCount}</span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
