import logoFull from "./logo-full.png";
import logoIcon from "./logo-icon.png";

/** Single source of truth for Creative Room brand assets. */
export const brandAssets = {
  full: logoFull,
  icon: logoIcon,
  alt: "Creative Room",
  name: "Creative Room",
} as const;

export { logoFull, logoIcon };
