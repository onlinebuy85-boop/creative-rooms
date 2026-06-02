import { Link } from "wouter";
import { Plus, Mic } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DEMO_LIVE_NOW,
  DEMO_ROOM_ACTIVITY,
  ROOM_GENRE_CHIPS,
  ROOM_VIBE_CHIPS,
  ROOM_LOOKING_CHIPS,
  ROOM_PEOPLE_CHIPS,
  DEMO_ROOM_VISUALS,
  type RoomCardStatus,
} from "@/lib/rooms-demo-data";
import heroImg from "@/assets/images/hero.png";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Users } from "lucide-react";

const LIVE_STATUS_DOT: Record<RoomCardStatus, string> = {
  live: "cr-rooms-live-dot--live",
  just_started: "cr-rooms-live-dot--started",
  looking_vocals: "cr-rooms-live-dot--looking",
  looking_guitar: "cr-rooms-live-dot--looking",
  in_progress: "cr-rooms-live-dot--progress",
};

export function RoomsRightRail() {
  const [genre, setGenre] = useState("Hip Hop");
  const [vibe, setVibe] = useState("Chill");
  const [looking, setLooking] = useState("Vocals");
  const [people, setPeople] = useState("4–7");

  return (
    <div className="cr-rooms-rail">
      <section className="cr-rooms-rail-panel">
        <h2 className="cr-rooms-rail-title">Find the right room</h2>

        <p className="cr-rooms-rail-label">Genre</p>
        <div className="cr-rooms-rail-pills">
          {ROOM_GENRE_CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => setGenre(chip)}
              className={cn("cr-rooms-rail-pill", genre === chip && "cr-rooms-rail-pill--active")}
            >
              {chip}
            </button>
          ))}
        </div>

        <p className="cr-rooms-rail-label">Vibe</p>
        <div className="cr-rooms-rail-pills">
          {ROOM_VIBE_CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => setVibe(chip)}
              className={cn("cr-rooms-rail-pill", vibe === chip && "cr-rooms-rail-pill--active")}
            >
              {chip}
            </button>
          ))}
        </div>

        <p className="cr-rooms-rail-label">Looking for</p>
        <div className="cr-rooms-rail-pills">
          {ROOM_LOOKING_CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => setLooking(chip)}
              className={cn("cr-rooms-rail-pill", looking === chip && "cr-rooms-rail-pill--active")}
            >
              {chip}
            </button>
          ))}
        </div>

        <p className="cr-rooms-rail-label">People count</p>
        <div className="cr-rooms-rail-pills">
          {ROOM_PEOPLE_CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => setPeople(chip)}
              className={cn("cr-rooms-rail-pill", people === chip && "cr-rooms-rail-pill--active")}
            >
              {chip}
            </button>
          ))}
        </div>
      </section>

      <section className="cr-rooms-rail-panel">
        <div className="cr-rooms-rail-panel-head">
          <h2 className="cr-rooms-rail-title">Live now</h2>
          <button type="button" className="cr-rooms-rail-link">
            View all
          </button>
        </div>
        <ul className="cr-rooms-live-list">
          {DEMO_LIVE_NOW.map((item) => {
            const visual = DEMO_ROOM_VISUALS[item.room.id];
            const thumb = visual?.cover ?? item.room.coverImageUrl ?? heroImg;
            return (
              <li key={item.room.id}>
                <Link href={item.href} className="cr-rooms-live-item">
                  <div className="cr-rooms-live-thumb-wrap">
                    <img src={thumb} alt="" className="cr-rooms-live-thumb" />
                    <span
                      className={cn("cr-rooms-live-dot", LIVE_STATUS_DOT[item.status])}
                      aria-hidden
                    />
                  </div>
                  <div className="cr-rooms-live-copy min-w-0 flex-1">
                    <p className="cr-rooms-live-title truncate">{item.room.name}</p>
                    <p className="cr-rooms-live-people">
                      <Users className="w-3 h-3 shrink-0" strokeWidth={1.75} />
                      {item.peopleCount} in room
                    </p>
                    <span className="cr-rooms-live-mood">{item.moodTag}</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="cr-rooms-rail-panel">
        <h2 className="cr-rooms-rail-title">Recent activity</h2>
        <ul className="cr-rooms-activity-list">
          {DEMO_ROOM_ACTIVITY.map((item, i) => (
            <li key={i} className="cr-rooms-activity-item">
              <Avatar className="w-8 h-8 shrink-0">
                <AvatarFallback
                  className="text-[10px] font-medium"
                  style={{ background: item.color, color: "#f3e8db" }}
                >
                  {item.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-[12px] text-[#f3e8db] leading-snug">
                  <span className="font-medium">{item.user}</span> {item.action}
                </p>
                <p className="text-[11px] text-[#b39b85] truncate">{item.room}</p>
                <p className="text-[10px] text-[#b39b85]/70 mt-0.5">{item.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="cr-rooms-rail-panel cr-rooms-rail-cta">
        <img src={heroImg} alt="" className="cr-rooms-rail-cta-bg" />
        <div className="cr-rooms-rail-cta-overlay" />
        <div className="cr-rooms-rail-cta-content">
          <p className="text-[15px] font-medium text-[#f3e8db] leading-snug">
            Can&apos;t find the right room?
          </p>
          <p className="text-[13px] text-[#b39b85] leading-relaxed">
            Create your own and invite people.
          </p>
          <div className="cr-rooms-rail-cta-actions">
            <Link href="/rooms/new" className="cr-rooms-rail-cta-btn">
              <Plus className="w-4 h-4" />
              Create a room
            </Link>
            <button type="button" className="cr-rooms-rail-cta-mic" aria-label="Drop a voice invite">
              <Mic className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
