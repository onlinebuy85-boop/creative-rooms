import { Link } from "wouter";
import { Users, DoorOpen, AudioWaveform } from "lucide-react";
import { BrandLogo } from "@/components/brand/brand-logo";
import heroBg from "@/assets/images/hero-bg.png";
import { AUTH_FEATURES, AUTH_QUOTE } from "@/lib/auth-copy";

const FEATURE_ICONS = {
  users: Users,
  wave: AudioWaveform,
  door: DoorOpen,
} as const;

export function AuthHero() {
  return (
    <section className="cr-auth-hero cr-auth-hero--enter" aria-label="About Creative Room">
      <img src={heroBg} alt="" className="cr-auth-hero-bg" />
      <div className="cr-auth-hero-overlay" aria-hidden />
      <div className="cr-auth-hero-vignette" aria-hidden />

      <div className="cr-auth-hero-content">
        <BrandLogo variant="full" size="auth" href="/discover" className="group" />

        <div className="cr-auth-hero-copy">
          <h1 className="cr-auth-headline font-serif">
            A space for unfinished ideas and real{" "}
            <span className="cr-auth-headline-accent">connection.</span>
          </h1>
          <p className="cr-auth-lead">
            Join creators around the world to make music, share ideas and build together in real
            time.
          </p>
        </div>

        <ul className="cr-auth-features">
          {AUTH_FEATURES.map((feature) => {
            const Icon = FEATURE_ICONS[feature.icon];
            return (
              <li key={feature.id} className="cr-auth-feature">
                <span className="cr-auth-feature-icon">
                  <Icon className="w-5 h-5" strokeWidth={1.75} />
                </span>
                <div>
                  <p className="cr-auth-feature-title">{feature.title}</p>
                  <p className="cr-auth-feature-desc">{feature.description}</p>
                </div>
              </li>
            );
          })}
        </ul>

        <blockquote className="cr-auth-quote">
          <p>{AUTH_QUOTE}</p>
        </blockquote>
      </div>
    </section>
  );
}
