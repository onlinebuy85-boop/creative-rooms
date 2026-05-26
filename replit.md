# Creative Rooms

A warm, cinematic web platform where musicians, songwriters, singers, producers, poets and emotional creators meet in intimate digital studio rooms to create together live.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string
- Required env: `CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY`, `VITE_CLERK_PUBLISHABLE_KEY` — auto-provisioned by Replit Clerk

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind v4, shadcn/ui, Wouter routing, @tanstack/react-query
- Auth: Clerk (Replit-managed) — `@clerk/react` on frontend, `@clerk/express` on backend
- API: Express 5 + WebSockets (ws)
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — API contract (source of truth)
- `lib/db/src/schema/` — DB tables: profiles, rooms, roomMembers, messages, demos
- `artifacts/api-server/src/routes/` — Express route handlers
- `artifacts/api-server/src/lib/websocket.ts` — WebSocket server for live chat
- `artifacts/creative-rooms/src/` — React + Vite frontend

## Architecture decisions

- Contract-first: OpenAPI spec → codegen → React Query hooks + Zod schemas
- Clerk for auth: cookie-based on web (no Bearer tokens), proxy middleware at `/api/__clerk`
- WebSocket at `/ws?roomId=N` for live room messaging (broadcast on new message)
- User profiles are separate from Clerk users — linked by `clerkId`
- Rooms limited to 2–8 members; owner auto-joined on creation

## Product

A platform for 2–4 creators to collaborate in intimate "Creative Rooms". Users create profiles describing their musical style, emotional vibe, and inspirations, then discover or create rooms to collaborate through text chat, voice, and demo uploads. No social media mechanics — just human creative connection.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- After OpenAPI spec changes, always run `pnpm --filter @workspace/api-spec run codegen` before using types
- Operations with BOTH path AND query params cause Orval TS2308 collision — remove query params or use separate operationIds
- WebSocket path `/ws` must be in `artifact.toml` `paths` array alongside `/api`
- Clerk: use `publishableKeyFromHost` not the raw env var; `proxyUrl` is always set (empty in dev)

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
