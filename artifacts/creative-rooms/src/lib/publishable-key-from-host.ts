/**
 * Re-export for code that needs publishableKeyFromHost in dev-safe way.
 * Production uses @clerk/react/internal via app-production.tsx only.
 */
export { publishableKeyFromHost } from "@/dev/clerk-internal-shim";
