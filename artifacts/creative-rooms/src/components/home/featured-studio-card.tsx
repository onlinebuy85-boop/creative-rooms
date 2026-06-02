import { Link } from "wouter";
import { useUser } from "@clerk/react";
import heroImg from "@/assets/images/hero.png";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function FeaturedStudioCard() {
  const { isSignedIn } = useUser();

  return (
    <article className="cr-featured-card">
      <img src={heroImg} alt="" className="cr-featured-card-bg" />
      <div className="cr-featured-card-vignette" />
      <div className="cr-featured-card-content">
        <div className="cr-featured-copy">
          <span className="cr-featured-eyebrow">A space for creatives</span>
          <h1 className="cr-featured-title">
            A cozy space for unfinished ideas and{" "}
            <em className="text-primary not-italic">real connection.</em>
          </h1>
          <div className="cr-featured-actions">
            <Link href="/discover">
              <button type="button" className="cr-btn-primary cr-featured-btn-primary">
                Find a room
              </button>
            </Link>
            <Link href="/hooks">
              <button type="button" className="cr-featured-btn-secondary">
                Drop a hook
              </button>
            </Link>
          </div>
          <div className="cr-featured-social">
            <div className="flex -space-x-2">
              {["L", "J", "E", "N", "M"].map((l) => (
                <Avatar key={l} className="w-7 h-7 border-2 border-background">
                  <AvatarFallback className="text-[9px] bg-secondary/80 text-foreground/70">
                    {l}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
            <span>
              {isSignedIn ? "Creators in rooms now" : "1,248 creatives online"}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
