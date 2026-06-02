import { Link } from "wouter";
import { Instagram } from "lucide-react";
import { BrandLogo } from "@/components/brand/brand-logo";

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

export function LandingFooter() {
  return (
    <footer className="cr-landing-footer" id="faq">
      <div className="cr-landing-container cr-landing-footer-inner">
        <div className="cr-landing-footer-brand">
          <BrandLogo variant="full" size="footer" href="/" />
          <p className="cr-landing-footer-tagline">Music is better together.</p>
        </div>

        <div className="cr-landing-footer-right">
          <nav className="cr-landing-footer-links" aria-label="Legal">
            <Link href="/about">Privacy</Link>
            <Link href="/about">Terms</Link>
            <Link href="/about">Contact</Link>
          </nav>
          <div className="cr-landing-footer-social">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X">
              <XIcon />
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noreferrer" aria-label="TikTok">
              <TikTokIcon />
            </a>
          </div>
        </div>
      </div>

      <div className="cr-landing-faq cr-landing-container">
        <h3 className="cr-landing-faq-title font-serif">A few honest answers</h3>
        <dl className="cr-landing-faq-list">
          <div>
            <dt>Is Creative Room finished?</dt>
            <dd>Not yet. We&apos;re building slowly with a small group of creators first.</dd>
          </div>
          <div>
            <dt>Do I need polished work to join?</dt>
            <dd>No. Rough ideas, voice memos and half-finished songs are the point.</dd>
          </div>
          <div>
            <dt>Is there a follower count?</dt>
            <dd>No algorithms, no rankings — just rooms and people making things together.</dd>
          </div>
        </dl>
      </div>
    </footer>
  );
}
