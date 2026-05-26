---
name: Clerk pnpm release age exclusion
description: @clerk/react and @clerk/shared are excluded from pnpm minimumReleaseAge so they can install compatible patch versions.
---

# Clerk Release Age Exclusion

## Rule
`@clerk/react` and `@clerk/shared` are in `minimumReleaseAgeExclude` in `pnpm-workspace.yaml`.

**Why:** Clerk publishes `@clerk/react` and `@clerk/shared` frequently and in tight lockstep. The `minimumReleaseAge: 1440` constraint can block the correct compatible `@clerk/shared` patch when a matching `@clerk/react` has just been published, causing "missing export" crashes. Excluding them allows pnpm to resolve the correct matching pair.

**How to apply:** Keep both in the exclude list. Do NOT remove them.
