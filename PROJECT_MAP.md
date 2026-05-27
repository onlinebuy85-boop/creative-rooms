# Project Map — Creative Rooms

A guided tour of the running system for a developer joining cold. Read this in order. By the end you should know where every flow lives, what works, what's fragile, and what's pretending to work.

> **Companion docs:** [`README.md`](./README.md) for setup, [`ARCHITECTURE.md`](./ARCHITECTURE.md) for the deeper folder map and the Replit/Supabase migration plan.

---

## 1. App flow (the 30-second tour)

```
  ┌──────────┐    sign up    ┌──────────────┐  fill form   ┌──────────┐
  │ Landing  │ ─────────────► │ Sign-in/up   │ ───────────► │ Profile  │
  │   /      │                │ /sign-{in,up}│              │  setup   │
  └────┬─────┘                └──────────────┘              └────┬─────┘
       │                                                         │
       │ "Enter the room"                              creates profiles row
       ▼                                                         ▼
  ┌──────────┐                                            ┌──────────────┐
  │ Discover │ ◄───── browse open rooms ◄──── default ─── │ /discover    │
  │ /discover│                                            └──────────────┘
  └────┬─────┘                                                  │
       │                                                        │
       │ click a room                  ┌── creator-only ─► /rooms/new
       ▼                               │                        │
  ┌──────────┐    open chat,   ┌───────┴──────┐       creates rooms row +
  │ Room view│ ◄── voice, demo │ Hooks /hooks │       auto-joins owner
  │/rooms/:id│    upload       └──────────────┘
  └──────────┘
```

**Three user tiers** (gating logic):
1. **Guest** (signed-out) — can browse Discover, Hooks, About, and view rooms read-only. Any write action shows `GuestSignupPrompt`.
2. **Listener** (signed-in, `isCreator = false`) — same as guest plus a real profile. Any write action shows `CreatorUpgradePrompt`.
3. **Creator** (signed-in, `isCreator = true`) — full access: send messages, upload demos, join voice, drop hooks, create rooms.

Becoming a creator is a single button click: `POST /api/profiles/me/creator` flips `isCreator` to true.

---

## 2. Routing

All routes are declared in [`artifacts/creative-rooms/src/App.tsx`](./artifacts/creative-rooms/src/App.tsx) using **Wouter**.

| Path | Page | Auth | Notes |
| --- | --- | --- | --- |
| `/` | `landing.tsx` | public | hero, manifesto, footer |
| `/about` | `about.tsx` | public | cinematic about page |
| `/sign-in/*` | `sign-in.tsx` | public | Clerk component |
| `/sign-up/*` | `sign-up.tsx` | public | Clerk component |
| `/profile/setup` | `profile-setup.tsx` | signed-in, no profile | one-time onboarding |
| `/dashboard` | `dashboard.tsx` | signed-in + profile | rarely linked, may be vestigial |
| `/discover` | `discover.tsx` | public (gated writes) | room grid |
| `/hooks` | `hooks.tsx` | public (gated writes) | hook list + side panel |
| `/rooms/new` | `room-new.tsx` | creator | room creation form |
| `/rooms/:id` | `room-view.tsx` | public (gated writes, `hideLayout`) | the actual studio |
| `/profile/:id` | `profile-view.tsx` | signed-in | someone else's profile |
| `/profile/edit` | `profile-edit.tsx` | signed-in | edit own profile |
| `*` | `not-found.tsx` | public | 404 |

**Two route wrappers** do the auth choreography:
- `ProtectedRoute` — bounces to `/profile/setup` if signed in but no profile row, otherwise renders inside `<AppLayout>`.
- `GuestRoute` — renders inside `<AppLayout>` without any auth check.

`hideLayout` skips `<AppLayout>` entirely — used by `/rooms/:id` so the room view can take the full screen.

---

## 3. Auth flow (Clerk)

```
  Browser                  Frontend                  API server                Clerk
  ───────                  ────────                  ──────────                ─────
                       ClerkProvider mounts
                       publishableKey from host
                       (publishableKeyFromHost)

  user clicks Sign in ──► Clerk <SignIn/>
                          opens session ──────────────────────────────────────►
                          ◄──────────────── session cookie set ───────────────
                          
  page mounts        ──► useGetMyProfile (RQ hook)
                          fetch /api/profiles/me  ──────► clerkMiddleware()
                                                          getAuth(req).userId
                                                          → load profile by clerkId
                          ◄──────────────────────── 200 profile, or 404
                          
  if 404            ──► redirect /profile/setup
                        form → POST /api/profiles ──────► insert profile row
                                                          (isCreator = false)

  any signed-in route   useUser() / useAuth()    +    server reads req.auth()
```

**Touch-points:**
- Frontend provider: [`App.tsx`](./artifacts/creative-rooms/src/App.tsx) (lines ~28-90 for keys + appearance theme)
- Backend middleware: [`artifacts/api-server/src/app.ts`](./artifacts/api-server/src/app.ts) (`clerkMiddleware`)
- Clerk proxy: [`artifacts/api-server/src/middlewares/clerkProxyMiddleware.ts`](./artifacts/api-server/src/middlewares/clerkProxyMiddleware.ts) — mounted at `/api/__clerk`, lets the browser SDK reach Clerk's API on the same origin
- `requireAuth` helper — re-declared at the top of every route file (`rooms.ts`, `hooks.ts`, `messages.ts`, etc.) — see "Unstable areas" below
- `requireCreator` — same pattern, also checks `profile.isCreator === true`, returns `403`

**Cache invalidation on identity change:** `ClerkQueryClientCacheInvalidator` in `App.tsx` listens for Clerk user changes and clears the React Query cache so a previous user's data never bleeds into the next session.

---

## 4. Realtime flow (WebSocket)

Single file: [`artifacts/api-server/src/lib/websocket.ts`](./artifacts/api-server/src/lib/websocket.ts).

**Connection model:** one socket per `(user, room)`. The browser opens `ws://host/ws?roomId=N` when entering a room and closes on unmount.

**Server-side state (all in-memory):**
- `connMeta: Map<WebSocket, ConnMeta>` — per-socket metadata
- `roomConns: Map<roomId, Set<WebSocket>>` — broadcast targets
- `profileSocket: Map<"roomId:profileId", WebSocket>` — for targeted voice signalling

**Protocol** (JSON over text frames):

| Direction | `type` | Purpose |
| --- | --- | --- |
| client → server | `identify` | `{ profileId, displayName }` — sent right after connect |
| client → server | `typing` / `stop_typing` | typing indicators |
| client → server | `voice_join` / `voice_leave` | toggle voice participation flag |
| client → server | `voice_signal` | `{ to: profileId, signal }` — relayed to one peer |
| server → client | `presence` | `{ action: "join"|"leave", profileId, displayName }` |
| server → client | `typing` / `stop_typing` | echo of someone else typing |
| server → client | `voice_presence` | full voice-member list refresh on join/leave |
| server → client | `voice_signal` | WebRTC SDP/ICE relayed from a peer |

**Important:** REST creates the persisted message (`POST /api/rooms/:id/messages`), then the server calls `broadcastToRoom()` so other sockets refetch or append. The WebSocket itself does **not** carry message bodies — only the "new message" trigger and the ephemeral typing/voice events.

Voice is **WebRTC peer-to-peer**. The server is only a signalling relay — no audio touches the backend.

---

## 5. Room creation flow

1. **Frontend** — `/rooms/new` (`room-new.tsx`):
   - `useGetMyProfile()` confirms creator status
   - `react-hook-form` + Zod validates `{ name, description?, vibe?, genres?, maxMembers: 2-8 }`
   - `useCreateRoom()` mutation hits `POST /api/rooms`
2. **Backend** — [`artifacts/api-server/src/routes/rooms.ts`](./artifacts/api-server/src/routes/rooms.ts):
   - `requireAuth` + `requireCreator`
   - validates body with `CreateRoomBody` Zod schema (generated from OpenAPI)
   - inserts row in `rooms` (`isActive = true`, `ownerId = profile.id`)
   - **auto-inserts the owner** into `roomMembers` with `role = "owner"`
   - returns the new room
3. **Frontend** — `setLocation(\`/rooms/${room.id}\`)`

Discovery is simply `GET /api/rooms` with optional filters; it returns `memberCount`, `ownerName`, and live `presence` (from `getRoomPresenceCounts()`) so `RoomCard` can show how many people are currently in the room.

---

## 6. Hooks flow

A "hook" is a short audio idea a creator drops to find collaborators. Single source of truth for the data model is [`lib/db/src/schema/hooks.ts`](./lib/db/src/schema/hooks.ts).

```
  Creator                                              World
  ───────                                              ─────
  /hooks → "Drop a Hook"
    │                                                  
    ▼                                                  
  DropHookModal (drop-hook-modal.tsx)
    ├── record/upload audio file
    ├── POST /api/uploads → returns file URL          
    └── POST /api/hooks {title, audioUrl, tags,        
                         lookingFor, vibe, maxSeats}   
              │                                        
              ▼                                        
       INSERT hooks (isActive = true)                  
              │                                        
              └─ enriched & broadcast on next GET ───► every visitor of /hooks
                                                       sees it in the list
  
  Listener taps a hook
    │
    ▼
  HookRoomPanel opens (hook-room-panel.tsx)
    ├── "Join" → POST /api/hooks/:id/join
    │             ├── lazily creates a backing rooms row on first join
    │             ├── stores rooms.id in hooks.roomId
    │             └── inserts caller into roomMembers
    └── once room exists, redirects to /rooms/:id
```

Key files:
- Page: `pages/hooks.tsx` — list + filters
- Drop modal: `components/hooks/drop-hook-modal.tsx`
- Card: `components/hooks/hook-card.tsx`
- Side panel: `components/hooks/hook-room-panel.tsx` — opens on row click instead of full navigation, on desktop only
- Owner controls: `components/hooks/hook-manage-menu.tsx`
- Backend: `routes/hooks.ts` + `routes/uploads.ts`

---

## 7. Database dependencies

Schema lives in [`lib/db/src/schema/`](./lib/db/src/schema/). All tables use Postgres `serial` integer ids; foreign keys are declared via plain `integer` columns (no enforced FK constraints — see "Unstable areas").

```
profiles  ──┬─< roomMembers >── rooms ──< messages
            │                     │       
            │                     └──< demos
            │                     
            └─< hooks ────────────┘ (hooks.roomId → rooms.id, nullable until join)
```

| Table | Columns of note |
| --- | --- |
| `profiles` | `clerkId` (unique), `displayName`, `bio`, `musicalStyle`, `emotionalVibe`, `inspirations`, `genres[]`, `avatarUrl`, **`isCreator`** (the gating flag), timestamps |
| `rooms` | `name`, `description`, `vibe`, `genres[]`, `maxMembers` (default 4, range 2-8), `ownerId`, `isActive`, `coverImageUrl` |
| `roomMembers` | `roomId`, `profileId`, `role` (`owner` \| `member`), unique on `(roomId, profileId)` |
| `messages` | `roomId`, `profileId`, `content`, `createdAt` |
| `demos` | `roomId`, `uploaderId`, `title`, `description`, `fileUrl`, `duration` |
| `hooks` | `creatorId`, `title`, `audioUrl`, `vibe`, `tags[]`, `lookingFor[]`, `maxSeats` (default 3), `roomId` (nullable), `isActive` |

**Schema changes** are pushed with `pnpm --filter @workspace/db run push`. There is no migration history — Drizzle's `push` mode is destructive in spirit. Before production, generate proper SQL migrations with `drizzle-kit generate`.

**Production database setup** is identical to dev: provide `DATABASE_URL` and run `push`. The Supabase migration plan is in [`ARCHITECTURE.md`](./ARCHITECTURE.md).

---

## 8. Important components

If you want to understand the UI fast, read these in order:

| File | Why it matters |
| --- | --- |
| `src/App.tsx` | every route, every wrapper, the Clerk theme |
| `src/components/layout/app-layout.tsx` | the global shell — sidebar (desktop) + top bar + bottom tab bar (mobile). Single file, ~470 lines |
| `src/pages/landing.tsx` | longest page, defines the brand voice |
| `src/pages/room-view.tsx` | by far the most complex page — chat, voice, demo upload, recording, mobile vs desktop tabs |
| `src/components/creator-upgrade-prompt.tsx` | the gate that converts listeners → creators |
| `src/components/guest-prompt.tsx` | the gate that converts guests → signed-in users |
| `src/components/rooms/room-card.tsx` | the unit of discovery |
| `src/components/hooks/hook-card.tsx` | the unit of the Hooks feed |

Backend essentials:
| File | Why it matters |
| --- | --- |
| `artifacts/api-server/src/app.ts` | Express setup, Clerk middleware, audio MIME overrides |
| `artifacts/api-server/src/routes/rooms.ts` | longest and most complex route file |
| `artifacts/api-server/src/lib/websocket.ts` | entire realtime layer |
| `lib/api-spec/openapi.yaml` | **the contract** — change here first, run codegen, then update routes |

---

## 9. Mobile navigation structure

All navigation lives in [`src/components/layout/app-layout.tsx`](./artifacts/creative-rooms/src/components/layout/app-layout.tsx). The breakpoint is `md` (768px).

**Desktop (`md` and up):**
- Fixed left sidebar, 240 px wide, full height
- Logo top, primary nav (Discover, Hooks, About), profile/login at the bottom
- Decorative ambient waveform + the "No pressure. Just presence." micro-line at the bottom

**Mobile (below `md`):**
- Fixed top bar with logo + a menu button
- **Fixed bottom tab bar** (the main nav) — Discover / Hooks / About / Profile, anchored to `100dvh` so the iOS home-indicator inset is respected
- The main content has `pb-[72px]` on mobile to clear the bottom bar
- Room view is full-screen — it sets `hideLayout` on its route so neither the top bar nor the bottom tab bar is rendered. Inside the room, navigation between chat / voice / studio is done with in-page tabs.

**Touch targets and safe areas:** the `index.html` sets `viewport-fit=cover` and disables user zoom; the tab bar uses `env(safe-area-inset-bottom)` implicitly via `100dvh`. iOS Safari is the target.

---

## 10. Known bugs

These are issues observed in code or reasonably inferred. Triage before launch.

- **WebSocket presence is single-server only.** `connMeta`, `roomConns`, and `profileSocket` are in-memory maps. Horizontal scaling (more than one API server instance) will break presence, typing, voice signalling, and the live count on room cards. For now: deploy a single API instance.
- **`profileSocket` collides on multi-tab.** If the same user opens the same room in two tabs, the second tab overwrites the first in `profileSocket`, and incoming `voice_signal` messages are routed only to the second tab.
- **File uploads go to local disk.** `artifacts/api-server/uploads/` is a real folder on the API server. It does not survive container restarts on most hosts and does not scale beyond one instance. Migrate to S3 / Supabase Storage / R2 before any real traffic.
- **No FK constraints in the DB schema.** Tables reference each other by integer id but Drizzle isn't declaring foreign keys. Orphaned rows are possible if rows are deleted out of order. Add `.references(() => ...)` in the schema files when hardening.
- **No rate limiting** on any endpoint, including `/api/uploads` and `/api/messages`. Easy to abuse.
- **N+1 queries in `enrichHook` and `getRoomWithMemberCount`.** Fine at current scale; rewrite as joins or batched lookups before hundreds of rooms.
- **`requireAuth` uses `any` typing** and is copy-pasted across `rooms.ts`, `hooks.ts`, `messages.ts`, `demos.ts`, etc. Extract into a shared middleware in `artifacts/api-server/src/middlewares/`.
- **Drizzle `push` mode is destructive.** There is no migration history. Generate real SQL migrations before production.
- **`/dashboard` route may be vestigial** — present in `App.tsx` but not linked from any navigation. Either link it or remove.

---

## 11. Unstable areas

Code that works but is fragile and likely the first thing a new dev will need to refactor:

- **`room-view.tsx`** — the largest file in the app (~600+ lines). It owns chat state, voice state, recording state, the demo dropzone, mobile/desktop conditional layouts, AND the creator gates. Splitting it into `RoomChat`, `RoomVoice`, `RoomStudio` sub-components is the highest-value refactor.
- **`app-layout.tsx`** — single 470-line file holding both desktop sidebar and mobile bottom tab bar. Readable now, but every nav change touches the same file.
- **WebRTC voice** — best-effort. There is no TURN server configured, so users behind symmetric NATs will silently fail to connect. Add an ICE config (twilio-stun or a self-hosted coturn) before relying on voice.
- **Multer upload route** — accepts any file up to its default limit. Verify the auth check is wired (and the file type validation) in `artifacts/api-server/src/routes/uploads.ts` before exposing publicly.
- **Clerk proxy at `/api/__clerk`** — works on Replit's mTLS proxy but should be re-validated on whatever host you migrate to. CORS + cookies + cross-origin Clerk SDK calls have sharp edges.

---

## 12. Temporary solutions / known shortcuts

- **Audio MIME overrides** in `app.ts` (`AUDIO_CONTENT_TYPES`) — hard-coded because `mime-db` maps `.m4a` to `audio/x-m4a` which Safari/Chrome reject. Necessary; keep it when you migrate to object storage (set `ContentType` on upload instead).
- **Hook → room lazy creation.** A `hooks.roomId` stays null until the first person joins; the join handler creates the room on demand. Convenient but means hooks and rooms have a slightly tangled lifecycle. Document this for anyone touching either.
- **`isActive` on rooms and hooks** is set but **never set to false anywhere in the codebase.** Effectively a no-op today. Either implement archiving or drop the column.
- **`role` on `roomMembers` defaults to `"member"`** and is set to `"owner"` only on creation. No code checks roles for permissions — owner-only actions (delete, edit) check `room.ownerId` directly. The `role` column is currently informational.
- **No email/notification system.** Joining a hook, getting invited to a room, receiving a message — none of these notify anyone outside the live websocket.

---

## 13. Features that are mocked or fake

Be honest with the next developer:

- **Voice chat connects peer-to-peer but has no TURN fallback.** It works in the happy path (open networks, same NAT) and silently fails otherwise. Not production-grade.
- **"Live count" on room cards** is real — `getRoomPresenceCounts()` reads from the live WebSocket connection set. Accurate as long as you run one API instance.
- **Search and filters on Discover / Hooks** are client-side over the loaded list. There is no server-side search. Fine up to a few hundred rooms.
- **Avatars** — there is an `avatarUrl` column on `profiles` but no avatar upload flow in the UI; users can paste a URL during profile setup or stay default.
- **Genres / inspirations / vibe** are free-text or comma-separated arrays, not curated taxonomies. Filtering on them is fuzzy.

If you find something else that looks like it should work but doesn't — assume it doesn't. There is no test suite.

---

## 14. Features that are production-ready

These are solid enough to ship as-is (with the env-var, single-instance, and migration caveats above):

- **Clerk auth + profile creation flow.** Robust. Edge cases like sign-out cache clearing are handled.
- **Three-tier gating (guest / listener / creator).** Consistent, server-enforced (every write checks `isCreator`), and clearly communicated in the UI.
- **Room create / list / join / leave / delete.** Permission checks are correct (only owner can delete; max-member cap is enforced server-side).
- **Text chat over WebSocket.** Messages persist to Postgres and broadcast cleanly. Typing indicators work.
- **Hook drop / browse / join.** End-to-end functional including the lazy room creation.
- **OpenAPI → React Query + Zod codegen.** Excellent contract discipline. Use it.
- **Responsive layout.** Desktop sidebar + mobile bottom tab bar both feel intentional. Tested in iOS Safari and desktop Chrome.
- **Cinematic visual identity.** The Tailwind v4 + shadcn/ui setup, the Fraunces/Inter type pairing, and the gold-on-deep-purple palette are coherent and the team should preserve them.

---

## Quick index

- Routes & route guards: `artifacts/creative-rooms/src/App.tsx`
- Global layout / nav: `artifacts/creative-rooms/src/components/layout/app-layout.tsx`
- Realtime: `artifacts/api-server/src/lib/websocket.ts`
- API contract: `lib/api-spec/openapi.yaml`
- DB schema: `lib/db/src/schema/`
- Auth backend: `artifacts/api-server/src/app.ts` + `middlewares/clerkProxyMiddleware.ts`
- Three-tier gates: `components/guest-prompt.tsx`, `components/creator-upgrade-prompt.tsx`
- Env vars: `.env.example`
- Migration plan: `ARCHITECTURE.md` § Replit-specific touch-points + § Anticipated next steps
