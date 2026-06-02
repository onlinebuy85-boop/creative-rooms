/** Shared layout constants — keep in sync with CSS variables in index.css */

export const PAGE_MAX_WIDTH = "1800px";
export const PAGE_GAP = "24px";
export const PAGE_PADDING_X = "32px";
export const PAGE_PADDING_Y = "28px";
export const RIGHT_RAIL_WIDTH = "320px";
export const SIDEBAR_WIDTH = "16rem";
export const SECTION_GAP = "24px";
export const CARD_RADIUS = "18px";

/** CSS custom properties for inline use (e.g. Storybook) */
export const layoutCssVars = {
  "--cr-page-max-width": PAGE_MAX_WIDTH,
  "--cr-page-gap": PAGE_GAP,
  "--cr-page-padding-x": PAGE_PADDING_X,
  "--cr-page-padding-y": PAGE_PADDING_Y,
  "--cr-right-rail-width": RIGHT_RAIL_WIDTH,
  "--cr-sidebar-width": SIDEBAR_WIDTH,
  "--cr-section-gap": SECTION_GAP,
  "--cr-card-radius": CARD_RADIUS,
} as const;
