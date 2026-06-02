import { Link } from "wouter";
import { useUser } from "@clerk/react";
import heroImg from "@/assets/images/hero.png";
import { Button } from "@/components/ui/button";
import { CrCard } from "@/components/ui/cr-card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface HomeHeroProps {
  /** Show compact variant inside AppLayout */
  compact?: boolean;
}

export function HomeHero({ compact }: HomeHeroProps) {
  const { isSignedIn } = useUser();

  return (
    <CrCard variant="hero" padding="none" className="relative overflow-hidden min-h-[min(22rem,52vw)] md:min-h-[18rem]">
      <img
        src={heroImg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-[60%_35%] md:object-center"
      />
      <div className="absolute inset-0 cr-hero-vignette" />
      <div className="absolute inset-0 cr-hero-warm-glow pointer-events-none" />

      <div className="relative z-10 flex flex-col justify-end h-full min-h-[inherit] p-6 md:p-8 lg:p-10">
        {!compact && (
          <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-primary/90 mb-3">
            A space for creatives
          </p>
        )}
        <h1
          className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.08] tracking-tight text-foreground max-w-xl"
        >
          A cozy space for unfinished ideas and{" "}
          <span className="text-primary italic">real connection.</span>
        </h1>
        <p className="mt-3 text-sm md:text-base font-light text-muted-foreground max-w-md leading-relaxed">
          Step into intimate studio rooms — no pressure, just presence and music in progress.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button className="cr-btn-primary rounded-xl h-11 px-6" asChild>
            <Link href="/discover">{isSignedIn ? "Find a room" : "Explore rooms"}</Link>
          </Button>
          <Button variant="outline" className="rounded-xl h-11 px-6 border-border/50 bg-card/20 backdrop-blur-sm" asChild>
            <Link href="/hooks">Drop a hook</Link>
          </Button>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <div className="flex -space-x-2">
            {["A", "B", "C", "D", "E"].map((letter, i) => (
              <Avatar key={letter} className="w-8 h-8 border-2 border-background">
                <AvatarFallback className="text-[10px] bg-secondary text-foreground/70">
                  {letter}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            <span className="text-foreground/90 font-medium">Creators online</span> — join when you&apos;re ready
          </p>
        </div>
      </div>
    </CrCard>
  );
}
