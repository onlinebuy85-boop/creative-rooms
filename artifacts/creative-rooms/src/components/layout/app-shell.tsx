import { cn } from "@/lib/utils";

interface AppShellProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
  rail?: React.ReactNode | null;
  className?: string;
}

/**
 * Fixed 3-column product shell (sidebar | center | utility rail).
 * Matches reference proportions — not a marketing layout.
 */
export function AppShell({ sidebar, children, rail, className }: AppShellProps) {
  return (
    <div className={cn("cr-app-frame", className)}>
      <aside className="cr-app-sidebar hidden md:flex">{sidebar}</aside>
      <div className="cr-app-center">{children}</div>
      {rail ? <aside className="cr-app-rail hidden lg:flex">{rail}</aside> : null}
    </div>
  );
}
