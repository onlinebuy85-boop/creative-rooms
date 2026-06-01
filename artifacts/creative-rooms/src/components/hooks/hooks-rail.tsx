import { Link } from "wouter";
import { Search, Coffee, Moon, Guitar, Mic2, Drum, Piano, Music } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DEMO_VIBE_FILTERS,
  DEMO_VIBE_CARDS,
  DEMO_HOOK_ACTIVITY,
} from "@/lib/hooks-feed-data";
import heroImg from "@/assets/images/hero.png";
import { cn } from "@/lib/utils";
import { useState } from "react";

const VIBE_ICONS = {
  coffee: Coffee,
  moon: Moon,
  guitar: Guitar,
  mic: Mic2,
  drum: Drum,
  piano: Piano,
  music: Music,
} as const;

export function HooksRail() {
  const [vibeFilter, setVibeFilter] = useState("All");

  return (
    <div className="cr-hooks-rail">
      <div className="cr-hooks-rail-search-wrap">
        <Search className="w-4 h-4 shrink-0 opacity-50" strokeWidth={1.75} />
        <input
          type="search"
          placeholder="Search rooms, hooks, people…"
          className="cr-hooks-rail-search"
        />
      </div>

      <section className="cr-hooks-rail-panel">
        <h2 className="cr-hooks-rail-panel-title">Find your vibe</h2>

        <div className="cr-hooks-rail-pills">
          {DEMO_VIBE_FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setVibeFilter(f)}
              className={cn("cr-hooks-rail-pill", vibeFilter === f && "cr-hooks-rail-pill--active")}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="cr-hooks-rail-vibe-grid">
          {DEMO_VIBE_CARDS.map((card) => (
            <button key={card.label} type="button" className="cr-hooks-rail-vibe-card">
              {(() => {
                const Icon = VIBE_ICONS[card.icon];
                return <Icon className="w-4 h-4 shrink-0 text-[#d8aa72]" strokeWidth={1.75} />;
              })()}
              <div className="min-w-0 text-left">
                <p className="text-[12px] font-medium text-[#f3e8db] truncate">{card.label}</p>
                <p className="text-[10px] text-[#b39b85]">{card.sub}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="cr-hooks-rail-panel">
        <h2 className="cr-hooks-rail-panel-title">Activity</h2>
        <ul className="cr-hooks-rail-activity">
          {DEMO_HOOK_ACTIVITY.map((item, i) => (
            <li key={i} className="cr-hooks-rail-activity-item">
              <Avatar className="w-8 h-8 shrink-0">
                <AvatarFallback
                  className="text-[10px] font-medium"
                  style={{ background: item.avatarColor, color: "#f3e8db" }}
                >
                  {item.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-[12px] text-[#f3e8db] leading-snug">
                  <span className="font-medium">{item.user}</span> {item.action}
                </p>
                <p className="text-[10px] text-[#b39b85] mt-0.5">{item.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="cr-hooks-rail-panel cr-hooks-rail-panel--cta overflow-hidden p-0">
        <img src={heroImg} alt="" className="cr-hooks-rail-cta-bg" />
        <div className="cr-hooks-rail-cta-overlay" />
        <div className="cr-hooks-rail-cta-content">
          <p className="text-[15px] font-medium text-[#f3e8db] leading-snug">
            Create together.
            <br />
            <span className="text-[#b39b85] font-normal">From ideas to something real.</span>
          </p>
          <Link href="/rooms/demo" className="cr-hooks-rail-cta-btn">
            Join a room
          </Link>
        </div>
      </section>
    </div>
  );
}
