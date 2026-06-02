import { ChevronRight } from "lucide-react";
import { seedWaveBars, MiniWaveform } from "@/components/ui/mini-waveform";
import type { DemoProfile } from "@/lib/profile-data";
import { cn } from "@/lib/utils";

interface ProfileRailProps {
  profile: DemoProfile;
}

export function ProfileRail({ profile }: ProfileRailProps) {
  return (
    <aside className="cr-profile-rail">
      <section className="cr-profile-rail-card">
        <h3 className="cr-profile-rail-title">About {profile.displayName}</h3>
        <p className="cr-profile-rail-about">{profile.about}</p>
        <ul className="cr-profile-skill-list">
          {profile.skills.map((s) => (
            <li key={s.label} className="cr-profile-skill-item">
              <s.icon className="w-4 h-4 shrink-0" strokeWidth={1.75} />
              {s.label}
            </li>
          ))}
          {profile.software.map((s) => (
            <li key={s.label} className="cr-profile-skill-item cr-profile-skill-item--muted">
              <s.icon className="w-4 h-4 shrink-0" strokeWidth={1.75} />
              {s.label}
            </li>
          ))}
        </ul>
      </section>

      <section className="cr-profile-rail-card">
        <h3 className="cr-profile-rail-title">Currently working on</h3>
        <div className="cr-profile-project-card">
          <div className="cr-profile-project-wave">
            <MiniWaveform
              bars={seedWaveBars(profile.currentProject.waveSeed, 28)}
              accent="#d8aa72"
              active={profile.currentProject.active}
              height="sm"
            />
          </div>
          <div className="cr-profile-project-copy min-w-0">
            <p className="cr-profile-project-title">{profile.currentProject.title}</p>
            <p className="cr-profile-project-sub">{profile.currentProject.subtitle}</p>
          </div>
          {profile.currentProject.active && (
            <span className="cr-profile-project-dot" aria-label="Active" />
          )}
        </div>
      </section>

      <section className="cr-profile-rail-card">
        <h3 className="cr-profile-rail-title">Skills & interests</h3>
        <div className="cr-profile-pills">
          {profile.interests.map((tag) => (
            <span key={tag} className="cr-profile-pill">
              {tag}
            </span>
          ))}
        </div>
      </section>

      <section className="cr-profile-rail-card">
        <h3 className="cr-profile-rail-title">Top collaborators</h3>
        <ul className="cr-profile-collab-list">
          {profile.collaborators.map((c) => (
            <li key={c.name}>
              <button type="button" className="cr-profile-collab-row">
                <span
                  className="cr-profile-collab-avatar"
                  style={{ background: `hsl(${c.hue} 32% 26%)` }}
                >
                  {c.initials}
                </span>
                <span className="cr-profile-collab-copy min-w-0">
                  <span className="cr-profile-collab-name">{c.name}</span>
                  <span className="cr-profile-collab-meta">
                    {c.mutualRooms} mutual rooms
                  </span>
                </span>
                <ChevronRight className="w-4 h-4 shrink-0 opacity-40" />
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className={cn("cr-profile-rail-card", "cr-profile-rail-card--footer")}>
        <p className="cr-profile-joined">
          Joined Creative Room · {profile.joinedDate}
        </p>
      </section>
    </aside>
  );
}
