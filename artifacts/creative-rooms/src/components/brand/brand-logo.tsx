import { Link } from "wouter";
import { brandAssets } from "@/assets/brand";
import { cn } from "@/lib/utils";

export type BrandLogoSize = "nav" | "auth" | "footer" | "sidebar" | "room";

type BrandLogoProps = {
  /** Full lockup (icon + wordmark + tagline) or icon mark only */
  variant?: "full" | "icon";
  size?: BrandLogoSize;
  href?: string;
  className?: string;
  imgClassName?: string;
};

const sizeClass: Record<BrandLogoSize, string> = {
  nav: "cr-brand-logo--nav",
  auth: "cr-brand-logo--auth",
  footer: "cr-brand-logo--footer",
  sidebar: "cr-brand-logo--sidebar",
  room: "cr-brand-logo--room",
};

export function BrandLogo({
  variant = "full",
  size = "nav",
  href,
  className,
  imgClassName,
}: BrandLogoProps) {
  const src = variant === "icon" ? brandAssets.icon : brandAssets.full;
  const img = (
    <img
      src={src}
      alt={brandAssets.alt}
      className={cn("cr-brand-logo-img", sizeClass[size], imgClassName)}
      draggable={false}
    />
  );

  if (href) {
    return (
      <Link href={href} className={cn("cr-brand-logo", className)}>
        {img}
      </Link>
    );
  }

  return <span className={cn("cr-brand-logo", className)}>{img}</span>;
}
