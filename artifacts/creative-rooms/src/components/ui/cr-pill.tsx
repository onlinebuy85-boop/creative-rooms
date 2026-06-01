import { cn } from "@/lib/utils";

interface CrPillProps {
  children: React.ReactNode;
  active?: boolean;
  className?: string;
  onClick?: () => void;
}

export function CrPill({ children, active, className, onClick }: CrPillProps) {
  const Comp = onClick ? "button" : "span";
  return (
    <Comp
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "cr-pill shrink-0 transition-all duration-200",
        active && "cr-pill-active",
        onClick && "cursor-pointer hover:border-primary/30",
        className,
      )}
    >
      {children}
    </Comp>
  );
}
