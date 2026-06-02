import { LandingNavbar } from "@/components/landing/landing-navbar";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingCards } from "@/components/landing/landing-cards";
import { LandingMemories } from "@/components/landing/landing-memories";
import { LandingWaitlist } from "@/components/landing/landing-waitlist";
import { LandingFooter } from "@/components/landing/landing-footer";

export function LandingPage() {
  return (
    <div className="cr-landing">
      <div className="bg-noise" />
      <div className="cr-landing-ambient" aria-hidden />
      <LandingNavbar />
      <main>
        <LandingHero />
        <LandingCards />
        <LandingMemories />
        <LandingWaitlist />
      </main>
      <LandingFooter />
    </div>
  );
}
