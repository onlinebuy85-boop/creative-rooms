import { ChevronRight, CircleHelp, Headphones, Users } from "lucide-react";
import { Link } from "wouter";
import { HELP_LINKS } from "@/lib/settings-demo-data";

const HELP_ICONS = {
  troubleshoot: CircleHelp,
  community: Users,
  support: Headphones,
} as const;

export function HelpPanel() {
  return (
    <section className="cr-settings-rail-card">
      <h3 className="cr-settings-rail-title">Need help?</h3>
      <ul className="cr-settings-rail-list">
        {HELP_LINKS.map((link) => {
          const Icon = HELP_ICONS[link.id as keyof typeof HELP_ICONS];
          return (
            <li key={link.id}>
              <Link href={link.href} className="cr-settings-rail-item">
                <span className="cr-settings-rail-item-icon">
                  <Icon className="w-4 h-4" strokeWidth={1.75} />
                </span>
                <span className="cr-settings-rail-item-copy">
                  <span className="cr-settings-rail-item-title">{link.title}</span>
                  <span className="cr-settings-rail-item-desc">{link.description}</span>
                </span>
                <ChevronRight className="w-4 h-4 shrink-0 opacity-50" />
              </Link>
            </li>
          );
        })}
      </ul>
      <footer className="cr-settings-system-status">
        <span className="cr-settings-status-dot" />
        Status: All systems operational
      </footer>
    </section>
  );
}
