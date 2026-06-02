import * as React from "react";
import { cn } from "@/lib/utils";

type CrCardVariant = "default" | "glass" | "elevated" | "hero";

const variantClasses: Record<CrCardVariant, string> = {
  default: "cr-card",
  glass: "cr-card cr-card-glass",
  elevated: "cr-card cr-card-elevated",
  hero: "cr-card cr-card-hero",
};

export interface CrCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CrCardVariant;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-5 md:p-6",
  lg: "p-6 md:p-8",
};

export function CrCard({
  className,
  variant = "default",
  padding = "md",
  ...props
}: CrCardProps) {
  return (
    <div
      className={cn(variantClasses[variant], paddingClasses[padding], className)}
      {...props}
    />
  );
}

export function CrCardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-4 space-y-1", className)} {...props} />;
}

export function CrCardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("font-serif text-lg md:text-xl tracking-tight text-foreground", className)}
      {...props}
    />
  );
}

export function CrCardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm font-light text-muted-foreground leading-relaxed", className)} {...props}
    />
  );
}

export function CrCardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-4 pt-4 border-t border-border/40", className)} {...props} />;
}
