import { Link } from "wouter";
import { Play, Radio } from "lucide-react";
import { LANDING_HERO_IMAGE } from "@/lib/landing-data";
import { seedWaveBars, MiniWaveform } from "@/components/ui/mini-waveform";
import { cn } from "@/lib/utils";

export function LandingHero() {
  return (
    <section className="cr-landing-hero cr-landing-section--fade">
      <img src={LANDING_HERO_IMAGE} alt="" className="cr-landing-hero-bg" />
      <div className="cr-landing-hero-overlay" aria-hidden />
      <div className="cr-landing-hero-vignette" aria-hidden />

      <div className="cr-landing-hero-neon" aria-hidden>
        Ideas become songs together.
      </div>

      <div className="cr-landing-hero-grid">
        <div className="cr-landing-hero-copy">
          <h1 className="cr-landing-hero-title font-serif">A place for unfinished ideas.</h1>
          <div className="cr-landing-hero-stanza">
            <p>Some songs start at 2AM.</p>
            <p>Some ideas stay unfinished for months.</p>
            <p>Creative Room is where people build on them together.</p>
          </div>

          <div className="cr-landing-hero-actions">
            <Link href="/discover" className="cr-landing-btn-primary">
              Enter Creative Room
              <span aria-hidden>→</span>
            </Link>
            <a href="#waitlist" className="cr-landing-btn-ghost">
              Join early access
            </a>
          </div>

          <p className="cr-landing-hero-footnote">
            Private development · creators joining slowly
          </p>
        </div>

        <div className="cr-landing-hero-floats" aria-hidden>
          <FloatingCard className="cr-landing-float--room cr-landing-float--drift-a">
            <div className="cr-landing-float-room-top">
              <span
                className="cr-landing-float-avatar"
                style={{ background: "hsl(32 32% 28%)" }}
              >
                L
              </span>
              <div className="min-w-0">
                <p className="cr-landing-float-title">Lina started a room</p>
                <p className="cr-landing-float-sub">Late night songwriters</p>
              </div>
            </div>
            <div className="cr-landing-float-room-bottom">
              <span className="cr-landing-live-pill">
                <Radio className="w-3 h-3" />
                LIVE
              </span>
              <span className="cr-landing-float-meta">6 people</span>
            </div>
          </FloatingCard>

          <FloatingCard className="cr-landing-float--voice cr-landing-float--drift-b">
            <div className="cr-landing-float-room-top">
              <span
                className="cr-landing-float-avatar"
                style={{ background: "hsl(210 28% 26%)" }}
              >
                N
              </span>
              <div className="min-w-0 flex-1">
                <p className="cr-landing-float-title">Noah uploaded a vocal idea</p>
                <div className="cr-landing-float-wave-row">
                  <button type="button" className="cr-landing-float-play" tabIndex={-1}>
                    <Play className="w-3 h-3 ml-0.5" />
                  </button>
                  <MiniWaveform
                    bars={seedWaveBars(7, 24)}
                    accent="#f2b15f"
                    active
                    height="sm"
                    className="flex-1"
                  />
                  <span className="cr-landing-float-dur">0:28</span>
                </div>
              </div>
            </div>
          </FloatingCard>

          <FloatingCard className="cr-landing-float--status cr-landing-float--drift-c">
            <p className="cr-landing-float-status-line">
              <span className="cr-landing-status-dot" />
              3 rooms active right now
            </p>
            <p className="cr-landing-float-meta mt-2">12 creators online</p>
          </FloatingCard>
        </div>
      </div>
    </section>
  );
}

function FloatingCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("cr-landing-float-card", className)}>{children}</div>
  );
}
