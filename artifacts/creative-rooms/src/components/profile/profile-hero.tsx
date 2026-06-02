import { Link } from "wouter";
import { MapPin, Link2, MoreHorizontal, Pencil } from "lucide-react";
import type { DemoProfile } from "@/lib/profile-data";

interface ProfileHeroProps {
  profile: DemoProfile;
  isOwnProfile?: boolean;
}

export function ProfileHero({ profile, isOwnProfile = true }: ProfileHeroProps) {
  const p = profile;

  return (
    <section className="cr-profile-hero">
      <div className="cr-profile-hero-ambient" aria-hidden>
        <img src={p.coverAmbientUrl} alt="" className="cr-profile-hero-ambient-img" />
        <div className="cr-profile-hero-ambient-fade" />
      </div>

      <div className="cr-profile-hero-inner">
        <div className="cr-profile-hero-left">
          <div className="cr-profile-avatar-wrap">
            <img src={p.avatarUrl} alt="" className="cr-profile-avatar" />
            {p.online && <span className="cr-profile-online" aria-label="Online" />}
          </div>

          <div className="cr-profile-identity min-w-0">
            <div className="cr-profile-name-row">
              <h1 className="cr-profile-display-name">{p.displayName}</h1>
              <span className="cr-profile-badge">{p.badge}</span>
            </div>
            <p className="cr-profile-username">@{p.username}</p>
            <p className="cr-profile-bio">{p.bio}</p>
            <div className="cr-profile-meta-row">
              <span className="cr-profile-meta-item">
                <MapPin className="w-3.5 h-3.5" />
                {p.location}
              </span>
              <a
                href={p.socialUrl}
                target="_blank"
                rel="noreferrer"
                className="cr-profile-meta-item cr-profile-meta-link"
              >
                <Link2 className="w-3.5 h-3.5" />
                {p.socialLabel}
              </a>
            </div>
          </div>
        </div>

        <div className="cr-profile-hero-actions">
          {isOwnProfile && (
            <Link href="/profile/edit" className="cr-profile-edit-btn">
              <Pencil className="w-4 h-4" />
              Edit profile
            </Link>
          )}
          <button type="button" className="cr-profile-more-btn" aria-label="More options">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        <div className="cr-profile-stats">
          <StatCard label="Rooms joined" value={p.stats.roomsJoined} />
          <StatCard label="Hooks created" value={p.stats.hooksCreated} />
          <StatCard label="Collaborations" value={p.stats.collaborations} />
        </div>
      </div>
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="cr-profile-stat-card">
      <span className="cr-profile-stat-value">{value}</span>
      <span className="cr-profile-stat-label">{label}</span>
    </div>
  );
}
