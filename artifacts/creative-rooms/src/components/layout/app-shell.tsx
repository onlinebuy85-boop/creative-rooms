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
    <div className={cn("cr-app-frame flex min-h-screen w-full max-w-full overflow-hidden", className)}>
      <aside className="cr-app-sidebar hidden md:flex w-64 shrink-0">{sidebar}</aside>
      <div className="cr-app-center flex-1 min-w-0 overflow-x-hidden max-w-full">{children}</div>
      {rail ? <aside className="cr-app-rail hidden lg:flex shrink-0">{rail}</aside> : null}
    </div>
  );
}
