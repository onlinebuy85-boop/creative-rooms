import { AuthHero } from "@/components/auth/auth-hero";
import { cn } from "@/lib/utils";

interface AuthLayoutProps {
  children: React.ReactNode;
  className?: string;
}

/** Full-screen auth split: hero (left) | form panel (right). */
export function AuthLayout({ children, className }: AuthLayoutProps) {
  return (
    <div className={cn("cr-auth", className)}>
      <div className="bg-noise" />
      <div className="cr-auth-ambient-glow" aria-hidden />
      <div className="cr-auth-grid">
        <div className="cr-auth-hero-col">
          <AuthHero />
        </div>
        <div className="cr-auth-panel-col">
          <div className="cr-auth-panel-inner">{children}</div>
        </div>
      </div>
    </div>
  );
}
