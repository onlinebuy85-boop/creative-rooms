import { Link } from "wouter";
import {
  Search,
  Moon,
  Sparkles,
  Guitar,
  Mic2,
  Drum,
  Piano,
  Coffee,
  Users,
} from "lucide-react";
import { CrPill } from "@/components/ui/cr-pill";
import { useState } from "react";
import heroImg from "@/assets/images/hero.png";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DEMO_ACTIVITY,
  DEMO_ONLINE_USERS,
  DEMO_VIBE_CARDS,
} from "@/lib/discover-demo-data";

const CATEGORIES = ["All", "Singer", "Producer", "Guitarist", "Beats"] as const;
const SUB_TAGS = ["Songwriter", "Pianist", "Drums", "Mixing"] as const;

const VIBE_ICONS = {
  coffee: Coffee,
  moon: Moon,
  guitar: Guitar,
  mic: Mic2,
  drum: Drum,
  piano: Piano,
} as const;

export function UtilityRail() {
  const [category, setCategory] = useState<string>("All");

  return (
    <div className="cr-rail-stack">
      <div className="cr-rail-search-wrap">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/55 pointer-events-none" />
        <input
          type="search"
          placeholder="Search rooms, hooks, people…"
          className="cr-search-input"
          aria-label="Search"
        />
      </div>

      <section className="cr-rail-panel cr-rail-panel--vibes">
        <h2 className="cr-rail-heading">Find your vibe</h2>
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {CATEGORIES.map((c) => (
            <CrPill
              key={c}
              active={category === c}
              onClick={() => setCategory(c)}
              className="text-[11px] px-2.5 py-1"
            >
              {c}
            </CrPill>
          ))}
        </div>
        <div className="flex flex-wrap gap-1 mb-3">
          {SUB_TAGS.map((t) => (
            <span key={t} className="text-[10px] text-muted-foreground/60 px-1.5">
              {t}
            </span>
          ))}
        </div>
        <div className="cr-vibe-grid">
          {DEMO_VIBE_CARDS.map(({ label, sub, icon }) => {
            const Icon = VIBE_ICONS[icon];
            return (
              <Link key={label} href="/discover">
                <div className="cr-vibe-grid-item">
                  <div className="cr-vibe-grid-icon">
                    <Icon className="w-3.5 h-3.5 text-primary/85" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium text-foreground/88 truncate">{label}</p>
                    <p className="text-[10px] text-muted-foreground/50">{sub}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="cr-rail-panel cr-rail-panel--activity">
        <div className="flex items-center justify-between gap-2 -mt-1 mb-1">
          <h2 className="cr-rail-heading mb-0">Activity</h2>
          <Link href="/discover" className="text-[11px] text-primary/75 hover:text-primary shrink-0">
            View all
          </Link>
        </div>
        <ul>
          {DEMO_ACTIVITY.map((item) => (
            <li key={`${item.user}-${item.time}`} className="flex gap-3 items-start">
              <Avatar className="cr-rail-activity-avatar shrink-0 border border-border/28">
                <AvatarFallback
                  className="text-[11px] font-semibold text-white/90"
                  style={{ background: item.avatarColor }}
                >
                  {item.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="cr-rail-activity-text text-foreground/88">
                  <span className="font-medium">{item.user}</span>{" "}
                  <span className="text-muted-foreground/80">{item.action}</span>
                </p>
                <p className="cr-rail-activity-time text-muted-foreground/48">{item.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="cr-rail-panel cr-rail-panel--quote relative overflow-hidden">
        <img src={heroImg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/88 to-background/30" />
        <div className="relative z-10">
          <Sparkles className="w-4 h-4 text-primary/45 mb-2" />
          <p className="font-serif text-[13px] leading-relaxed italic text-foreground/88">
            The best ideas usually arrive unfinished. This is where they find each other.
          </p>
        </div>
      </section>
    </div>
  );
}
