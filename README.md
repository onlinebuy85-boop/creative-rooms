# Creative Rooms

A warm, cinematic web platform where musicians, songwriters, singers, producers, poets and emotional creators meet in intimate digital studio rooms to create together — live.

---

## Quick start

```bash
# 1. Install dependencies (pnpm is required)
pnpm install

# 2. Copy and fill in environment variables
cp .env.example .env
# then edit .env with your Postgres URL + Clerk keys

# 3. Push the database schema
pnpm --filter @workspace/db run push

# 4. Run the API server (port 8080 by default)
pnpm --filter @workspace/api-server run dev

# 5. In another terminal, run the web app (port set by PORT env var)
pnpm --filter @workspace/creative-rooms run dev
```

The frontend talks to the backend through the path `/api`, and to the WebSocket through `/ws`. Both must be proxied to the API server on the same origin in production (see **Deployment** below).

---

## Required environment variables

See [`.env.example`](./.env.example) for the full list. The essentials:

| Variable | Where | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | server | PostgreSQL connection string |
| `CLERK_SECRET_KEY` | server | Clerk backend SDK |
| `CLERK_PUBLISHABLE_KEY` | server | Clerk backend (used by proxy) |
| `VITE_CLERK_PUBLISHABLE_KEY` | web (build-time) | Clerk frontend SDK |
| `SESSION_SECRET` | server | Cookie/session signing |
| `PORT` | both | Per-service port; provided by the dev script |
| `BASE_PATH` | web (build-time) | Path the web app is mounted at (`/` by default) |

---

## Workspace layout

This is a pnpm monorepo with three deployable artifacts and four shared libraries.

```
artifacts/
  api-server/       — Express 5 backend + WebSocket server
  creative-rooms/   — React + Vite frontend (the main app)
  mockup-sandbox/   — internal component-preview server (optional, can be removed)

lib/
  api-spec/         — OpenAPI source of truth (codegen runs from here)
  api-zod/          — generated Zod schemas
  api-client-react/ — generated React Query hooks
  db/               — Drizzle ORM schema + migrations
```

See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for the deeper map of how these fit together.

---

## Common commands

| Command | What it does |
| --- | --- |
| `pnpm install` | Install all workspace dependencies |
| `pnpm run typecheck` | Full typecheck across every package |
| `pnpm run build` | Typecheck + build every package |
| `pnpm --filter @workspace/api-spec run codegen` | Regenerate API hooks + Zod schemas from `lib/api-spec/openapi.yaml` |
| `pnpm --filter @workspace/db run push` | Push schema changes to the DB (dev only) |
| `pnpm --filter @workspace/api-server run dev` | Run the API server |
| `pnpm --filter @workspace/creative-rooms run dev` | Run the web frontend |

> **Important:** after any change to `lib/api-spec/openapi.yaml`, run the `codegen` command before touching code that consumes the API.

---

## Stack

- **Runtime:** Node.js 24, pnpm workspaces, TypeScript 5.9
- **Frontend:** React 18 + Vite, Tailwind v4, shadcn/ui, Wouter routing, TanStack Query
- **Auth:** Clerk (`@clerk/react` on web, `@clerk/express` on server)
- **API:** Express 5 + native `ws` WebSocket server
- **Database:** PostgreSQL + Drizzle ORM
- **Validation:** Zod (`zod/v4`), `drizzle-zod`
- **API contract:** OpenAPI → Orval codegen → React Query hooks + Zod schemas
- **Server bundle:** esbuild (single ESM bundle)

---

## Deployment

The app currently runs on Replit. The `artifact.toml` files in each `artifacts/*/.replit-artifact/` directory describe how each service is built and served on that platform.

To deploy elsewhere (Vercel, Render, Fly, your own server, etc.):

1. Build the web frontend: `pnpm --filter @workspace/creative-rooms run build` → static files appear in `artifacts/creative-rooms/dist/public/`.
2. Build the API server: `pnpm --filter @workspace/api-server run build` → single bundle at `artifacts/api-server/dist/index.mjs`.
3. Configure your reverse proxy so that:
   - `/api/*` → API server
   - `/ws` → API server (WebSocket upgrade)
   - everything else → the static frontend, with SPA fallback to `index.html`
4. Set the environment variables from `.env.example` on the API server.
5. At build time, set `VITE_CLERK_PUBLISHABLE_KEY` and `BASE_PATH=/` for the frontend.

See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for the list of Replit-specific touch-points you may want to remove during migration.

---

## Notes for future maintainers

- The full handoff notes live in [`ARCHITECTURE.md`](./ARCHITECTURE.md) — start there.
- Old conversational notes about UI tone, gotchas, and conventions live in [`replit.md`](./replit.md).
- A future Supabase migration is anticipated; the database schema lives in `lib/db/src/schema/` and is the only thing that needs to be ported.
