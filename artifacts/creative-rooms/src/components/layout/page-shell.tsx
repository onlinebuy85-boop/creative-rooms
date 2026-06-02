import { SidebarNav } from "@/components/layout/sidebar-nav";
import { cn } from "@/lib/utils";

export interface PageShellProps {
  children: React.ReactNode;
  /** Right utility / detail column — fixed width, hidden below xl */
  rail?: React.ReactNode;
  /** Sticky footer under main scroll (e.g. hooks player) */
  footer?: React.ReactNode;
  className?: string;
  mainClassName?: string;
  contentClassName?: string;
  /** Use full main-column width (profile hero); section padding applied inside */
  bleed?: boolean;
  /** Remove default content padding (messages split layout) */
  flush?: boolean;
}

/**
 * Product page shell: sidebar | centered main (max 1800px) | optional right rail.
 */
export function PageShell({
  children,
  rail,
  footer,
  className,
  mainClassName,
  contentClassName,
  bleed = false,
  flush = false,
}: PageShellProps) {
  return (
    <div
      className={cn(
        "cr-page flex min-h-screen w-full max-w-full overflow-hidden",
        rail != null && "cr-page--with-rail",
        className,
      )}
    >
      <aside
        className="cr-page-sidebar hidden md:flex w-64 shrink-0"
        aria-label="Main navigation"
      >
        <SidebarNav />
      </aside>

      <div
        className={cn(
          "cr-page-main flex min-h-0 flex-1 flex-col min-w-0 max-w-full overflow-x-hidden",
          mainClassName,
        )}
      >
        <div
          className={cn(
            "cr-page-content w-full max-w-full",
            bleed && "cr-page-content--bleed",
            flush && "cr-page-content--flush",
            contentClassName,
          )}
        >
          {children}
        </div>
        {footer ? <div className="cr-page-footer w-full max-w-full">{footer}</div> : null}
      </div>

      {rail != null ? (
        <aside
          className="cr-page-rail hidden xl:block shrink-0"
          aria-label="Secondary panel"
        >
          <div className="cr-page-rail-inner">{rail}</div>
        </aside>
      ) : null}
    </div>
  );
}

export function PageSection({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <section className={cn("cr-section", className)}>{children}</section>;
}

export function PageCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("cr-card", className)}>{children}</div>;
}
