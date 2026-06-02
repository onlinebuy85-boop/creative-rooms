import { useEffect, useState } from "react";
import { Link } from "wouter";
import { BrandLogo } from "@/components/brand/brand-logo";
import { cn } from "@/lib/utils";

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn("cr-landing-nav", scrolled && "cr-landing-nav--scrolled")}
    >
      <div className="cr-landing-nav-inner">
        <BrandLogo variant="full" size="nav" href="/" className="group" />

        <nav className="cr-landing-nav-links" aria-label="Landing">
          <Link href="/about" className="cr-landing-nav-link">
            About
          </Link>
          <a href="#faq" className="cr-landing-nav-link">
            FAQ
          </a>
          <Link href="/discover" className="cr-landing-nav-cta">
            Enter Creative Room
          </Link>
        </nav>
      </div>
    </header>
  );
}
