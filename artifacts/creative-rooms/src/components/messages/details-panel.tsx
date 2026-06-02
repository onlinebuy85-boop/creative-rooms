import { Link } from "wouter";
import {
  DoorOpen,
  UserPlus,
  Search,
  BellOff,
  MoreHorizontal,
} from "lucide-react";
import type { ConversationDetail, DemoConversation } from "@/lib/messages-demo-data";
import { seedWaveBars } from "@/components/ui/mini-waveform";
import { WAVE_COLORS } from "@/lib/messages-demo-data";

interface DetailsPanelProps {
  conversation: DemoConversation;
  detail: ConversationDetail;
}

export function DetailsPanel({ conversation, detail }: DetailsPanelProps) {
  return (
    <aside className="cr-msg-details">
      <section className="cr-msg-details-card cr-msg-details-about">
        <div className="cr-msg-details-hero-wrap">
          <img src={detail.aboutImage} alt="" className="cr-msg-details-hero" />
          <div className="cr-msg-details-hero-gradient" />
        </div>
        <div className="cr-msg-details-about-body">
          <h3 className="cr-msg-details-title">{conversation.title}</h3>
          <p className="cr-msg-details-desc">{detail.description}</p>
          <p className="cr-msg-details-meta">{detail.createdMeta}</p>
          <div className="cr-msg-details-actions">
            <Link href="/rooms/demo" className="cr-msg-details-action">
              <DoorOpen className="w-4 h-4" />
              Room
            </Link>
            <button type="button" className="cr-msg-details-action">
              <UserPlus className="w-4 h-4" />
              Add
            </button>
            <button type="button" className="cr-msg-details-action">
              <Search className="w-4 h-4" />
              Search
            </button>
            <button type="button" className="cr-msg-details-action">
              <BellOff className="w-4 h-4" />
              Mute
            </button>
            <button type="button" className="cr-msg-details-action cr-msg-details-action--icon">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      <section className="cr-msg-details-card">
        <div className="cr-msg-details-section-head">
          <h3 className="cr-msg-details-section-title">
            Members ({detail.members.length})
          </h3>
          <button type="button" className="cr-msg-details-link">
            View all
          </button>
        </div>
        <ul className="cr-msg-members-list">
          {detail.members.map((m) => (
            <li key={m.id} className="cr-msg-member-row">
              <div className="cr-msg-member-avatar-wrap">
                <span
                  className="cr-msg-member-avatar"
                  style={{ background: `hsl(${m.hue} 32% 26%)` }}
                >
                  {m.initials}
                </span>
                {m.online && <span className="cr-msg-online-dot cr-msg-online-dot--sm" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="cr-msg-member-name">{m.name}</p>
                {m.role && <p className="cr-msg-member-role">{m.role}</p>}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="cr-msg-details-card">
        <h3 className="cr-msg-details-section-title mb-4">Shared in chat</h3>
        <ul className="cr-msg-shared-list">
          {detail.shared.map((item) => {
            const bars = seedWaveBars(item.waveSeed, 24);
            const accent = WAVE_COLORS[item.waveVariant];
            return (
              <li key={item.id}>
                <button type="button" className="cr-msg-shared-item">
                  <div className="cr-msg-shared-wave">
                    {bars.map((h, i) => (
                      <span
                        key={i}
                        style={{
                          height: `${h * 0.5}%`,
                          background: accent,
                          opacity: 0.5,
                        }}
                      />
                    ))}
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <p className="cr-msg-shared-title">{item.title}</p>
                    <p className="cr-msg-shared-meta">{item.meta}</p>
                  </div>
                  <span className="cr-msg-shared-dur">{item.duration}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </aside>
  );
}
