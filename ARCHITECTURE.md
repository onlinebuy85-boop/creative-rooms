# Architecture & Handoff Notes

Practical map of the codebase for the next developer. Read this once before changing anything structural.

---

## High-level

```
┌──────────────────────────────┐         ┌──────────────────────────────┐
│  artifacts/creative-rooms    │  HTTP   │   artifacts/api-server       │
│  React + Vite (SPA)          │ ──────► │   Express 5 + ws             │
│                              │  WS     │                              │
│  - Wouter routing            │ ──────► │   - /api/* REST              │
│  - TanStack Query            │         │   - /ws  live chat           │
│  - Clerk (browser)           │         │   - /api/__clerk proxy       │
└──────────────────────────────┘         └──────────────┬───────────────┘
                                                        │
                                                        ▼
                                              ┌──────────────────┐
                                              │  PostgreSQL      │
                                              │  (Drizzle ORM)   │
                                              └──────────────────┘
```

Everything is contract-first: the OpenAPI spec at `lib/api-spec/openapi.yaml` is the single source of truth. Both the typed React Query hooks and the Zod schemas the server uses for validation are generated from it.

---

## Folder map

```
artifacts/
├── api-server/
│   └── src/
│       ├── app.ts                  ← Express setup, Clerk middleware, static uploads
│       ├── index.ts                ← server boot, WebSocket attach
│       ├── routes/                 ← REST handlers (one file per resource)
│       │   ├── profiles.ts
│       │   ├── rooms.ts
│       │   ├── messages.ts
│       │   ├── hooks.ts
│       │   ├── demos.ts
│       │   ├── uploads.ts
│       │   └── health.ts
│       ├── middlewares/
│       │   └── clerkProxyMiddleware.ts
│       └── lib/
│           ├── websocket.ts        ← live chat broadcast
│           └── logger.ts           ← pino instance
│
├── creative-rooms/
│   └── src/
│       ├── App.tsx                 ← router + Clerk provider
│       ├── main.tsx                ← entry
│       ├── pages/                  ← top-level routes
│       │   ├── landing.tsx
│       │   ├── discover.tsx
│       │   ├── hooks.tsx
│       │   ├── room-view.tsx
│       │   ├── profile-setup.tsx
│       │   └── …
│       ├── components/
│       │   ├── layout/             ← app shell, sidebar
│       │   ├── rooms/              ← room cards, modals, lists
│       │   ├── hooks/              ← hooks UI
│       │   ├── creator-upgrade-prompt.tsx
│       │   ├── guest-prompt.tsx
│       │   └── ui/                 ← shadcn primitives
│       ├── assets/images/          ← logos + hero (bundled by Vite)
│       └── index.css
│
└── mockup-sandbox/                  ← OPTIONAL: internal preview tool
                                       safe to delete on export

lib/
├── api-spec/        ← OpenAPI spec + Orval codegen config
├── api-zod/         ← generated Zod schemas (do not edit by hand)
├── api-client-react/← generated React Query hooks (do not edit by hand)
└── db/              ← Drizzle schema + migrations
```

---

## Where the three core concerns live

### Auth (Clerk)

- **Frontend:** `@clerk/react` is wired up in `artifacts/creative-rooms/src/App.tsx`. Pages read auth state with `useUser()` / `useAuth()`.
- **Backend:** `@clerk/express` middleware is installed in `artifacts/api-server/src/app.ts`. Every protected route reads `req.auth()` to get the Clerk user id and looks up the local profile in the DB.
- **Proxy:** Clerk's frontend SDK needs `/api/__clerk/*` to be proxied to Clerk's API. That proxy lives in `artifacts/api-server/src/middlewares/clerkProxyMiddleware.ts`.
- **User model:** Clerk owns identity. We keep our own `profiles` row keyed by `clerkId`. The `isCreator` flag on `profiles` gates write access (rooms, messages, hooks, demos).

> To replace Clerk with Supabase Auth later, the touch-points are: `App.tsx`, `app.ts`, `clerkProxyMiddleware.ts`, and any route that calls `req.auth()`.

### Realtime / chat

All live chat code is isolated in `artifacts/api-server/src/lib/websocket.ts`. The server attaches a `ws` instance to the same HTTP server on path `/ws?roomId=N`. Messages are broadcast to every socket joined to that room. Persistence happens via the regular `/api/rooms/:id/messages` REST endpoint — the WebSocket only carries the broadcast.

### Room data

- **DB tables** live in `lib/db/src/schema/`: `profiles`, `rooms`, `roomMembers`, `messages`, `demos`, `hooks`.
- **REST routes** live in `artifacts/api-server/src/routes/` — one file per resource. Each route validates input with a generated Zod schema and returns a generated response shape.
- **Frontend hooks** are auto-generated in `lib/api-client-react/`. Use them — do not hand-write `fetch` calls. Example: `useGetRoomById`, `useListRooms`, `useCreateMessage`.

---

## Conventions worth keeping

1. **Contract-first.** Edit `lib/api-spec/openapi.yaml`, then run `pnpm --filter @workspace/api-spec run codegen`. Never edit the generated files in `lib/api-zod/` or `lib/api-client-react/` by hand.
2. **One emotional micro-line per screen, max.** Tone is calm, intimate, discovered. See `replit.md` → "Product" for context.
3. **Server logging** uses `req.log` in routes and the singleton `logger` elsewhere. No `console.log` in server code.
4. **Cookie-based auth on web.** No Bearer tokens.
5. **Rooms are 2–8 members.** The owner is auto-joined on creation.

---

## Common gotchas

- After OpenAPI spec changes, **always** run codegen before touching consumers.
- An OpenAPI operation with **both** path params **and** query params triggers an Orval TS2308 collision — split into separate `operationId`s.
- The WebSocket path `/ws` must be listed in `artifact.toml` `paths` next to `/api`, or the proxy will not route the upgrade.
- Clerk: use `publishableKeyFromHost(...)`, not the raw env var. The `proxyUrl` is always set (empty string in local dev).

---

## Replit-specific touch-points (remove on export)

If you're migrating this project off Replit, the only platform-specific bits are:

| File / piece | What it does | Safe to remove? |
| --- | --- | --- |
| `artifacts/*/.replit-artifact/artifact.toml` | Describes services to Replit's reverse proxy | Yes — replace with your own reverse proxy config |
| `@replit/vite-plugin-cartographer` | Replit IDE integration (dev only, gated by `REPL_ID`) | Yes — drop the import + plugin entry in `artifacts/creative-rooms/vite.config.ts` |
| `@replit/vite-plugin-dev-banner` | Same as above | Yes |
| `@replit/vite-plugin-runtime-error-modal` | Pretty in-browser error overlay (dev) | Optional — works fine without it |
| `artifacts/mockup-sandbox/` | Replit-internal component preview tool | Yes — never referenced by the app |
| `.local/` | Replit agent state (skills, transcripts) | Yes — entirely ignorable; not part of the app |

After removing those, the app is a vanilla pnpm monorepo with a Vite frontend and an Express backend.

---

## Asset & media notes

- **Hero image** lives at `artifacts/creative-rooms/src/assets/images/hero.png`. It is intentionally kept at original high resolution (~2 MB) because the landing page renders it large on desktop. Vite hashes and serves it as-is.
- **Logos** live in the same folder as `creative-rooms-logo-v4.png`. Older `v2` is kept only because nothing else has replaced it yet — safe to delete once you confirm no reference.
- **Favicon / OG image** live in `artifacts/creative-rooms/public/` and are served at the site root.
- **User uploads** (demos, recordings) go to `artifacts/api-server/uploads/`. For production you should swap this for object storage (S3, Supabase Storage, R2…). The serving code is in `artifacts/api-server/src/app.ts` — search for `AUDIO_CONTENT_TYPES`.

---

## Anticipated next steps

The user has signalled a future Supabase migration. The pragmatic order:

1. **Database** — port `lib/db/src/schema/` to Supabase. Schemas are plain Drizzle, so they translate directly. Run the existing Drizzle migrations against the new Postgres.
2. **Auth** — swap Clerk for Supabase Auth. Touch-points listed above under "Auth (Clerk)".
3. **File storage** — move `artifacts/api-server/uploads/` to Supabase Storage. Update the upload route in `artifacts/api-server/src/routes/uploads.ts` and the static-serving block in `app.ts`.
4. **Realtime** — optionally replace the bespoke WebSocket in `lib/websocket.ts` with Supabase Realtime. Not required; the current implementation is small and works.

Nothing else needs to change. The OpenAPI contract, the React app, and the route handlers are all storage-agnostic.
