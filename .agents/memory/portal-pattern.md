---
name: Modal/overlay pattern
description: All fullscreen sheets and overlays must use createPortal; Radix Dialog breaks on mobile
---

Radix UI Dialog (`<Dialog>`, `<DialogContent>`) fights CSS `transform` and `overflow: hidden` on ancestor elements. On mobile this causes clipping, animation glitches, and broken z-index stacking.

**Fix:** Use `createPortal(content, document.body)` for all fullscreen overlays, confirmation dialogs, and bottom sheets. This bypasses the Radix stacking context entirely.

**Why:** The room view has transform animations on the main container. Any Radix portal inside it inherits the transform context, breaking fixed positioning and backdrop filters.

**How to apply:** Whenever adding a modal, sheet, or overlay: skip Radix Dialog, write a plain `<div style={{ position: "fixed", inset: 0, zIndex: N }}>` wrapped in `createPortal(…, document.body)`.
