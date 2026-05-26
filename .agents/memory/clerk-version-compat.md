---
name: Clerk version compatibility
description: @clerk/react and @clerk/express must use aligned major versions; mismatched @clerk/shared causes missing export errors at runtime.
---

# Clerk Version Compatibility

## Rule
`@clerk/react` and `@clerk/express` must be on the same "Clerk generation" so they share a compatible `@clerk/shared` version.

| Clerk generation | @clerk/react | @clerk/express | @clerk/shared |
|---|---|---|---|
| v5 (old)  | 5.x  | 1.x | 3.x |
| v6 (current) | 6.x  | 2.x | 4.x |

**Why:** `@clerk/react` and `@clerk/express` both import from `@clerk/shared` at runtime. If they resolve different major versions, one side will see missing exports (`loadClerkUiScript`, `SessionContext`, etc.) and crash.

**How to apply:** Always install `@clerk/react@^6.0.0` in web artifacts when the API server uses `@clerk/express@^2.x`. Never pin `@clerk/react` to `^5.x` in this project.
