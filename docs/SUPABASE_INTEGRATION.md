# Supabase integration — file reference

Supabase **data layer** for **@workspace/creative-rooms** (pnpm). **Auth UI is paused** — Clerk (prod) and dev login bypass are unchanged. Demo data remains the fallback when Supabase is unset or empty.

## Auth status: PAUSED

Not mounted or used:

- `SupabaseAuthProvider` (`contexts/supabase-auth-context.tsx`)
- `SupabaseProtectedRoute` (`components/auth/supabase-protected-route.tsx`)
- Login-card Supabase branch, route guards, session requirements

Low-level helpers remain in `lib/supabase/auth.ts` for a future pass; import directly when re-enabling.

## Environment

| File | Change |
|------|--------|
| `artifacts/creative-rooms/.env` | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` |
| `.env.example` | Documented Supabase vars |

## Database migrations (new)

| File | Purpose |
|------|---------|
| `supabase/migrations/20260301120000_profiles.sql` | `profiles` + auth signup trigger |
| `supabase/migrations/20260301120001_rooms.sql` | `rooms`, `room_members`, `rooms_with_stats` view |
| `supabase/migrations/20260301120002_hooks.sql` | `hooks`, `hook_seats`, `hooks_with_creator` view |
| `supabase/migrations/20260301120003_messages.sql` | `messages`, `messages_with_sender` view |
| `supabase/migrations/20260301120004_storage.sql` | Buckets: avatars, hooks, room-images |
| `supabase/migrations/20260301120005_rls.sql` | Row Level Security + storage policies |
| `supabase/README.md` | How to apply migrations |

Schema aligns with `lib/db/src/schema/*` (Drizzle) for a future single-Postgres setup.

## Client library (new)

| File | Purpose |
|------|---------|
| `artifacts/creative-rooms/src/lib/supabase/env.ts` | Read / validate Vite env |
| `artifacts/creative-rooms/src/lib/supabase/client.ts` | Singleton `createClient`, session persistence |
| `artifacts/creative-rooms/src/lib/supabase/types.ts` | DB row + input types |
| `artifacts/creative-rooms/src/lib/supabase/auth.ts` | signIn, signUp, signOut, resetPassword, session listeners |
| `artifacts/creative-rooms/src/lib/supabase/profiles.ts` | createProfile, ensureProfileForCurrentUser |
| `artifacts/creative-rooms/src/lib/supabase/rooms.ts` | fetchRooms, createRoom, map to API `Room` |
| `artifacts/creative-rooms/src/lib/supabase/hooks.ts` | fetchHooks, uploadHookAudioAndCreate |
| `artifacts/creative-rooms/src/lib/supabase/messages.ts` | fetchRoomMessages, sendMessage |
| `artifacts/creative-rooms/src/lib/supabase/storage.ts` | uploadAvatar, uploadHookAudio, uploadRoomImage |
| `artifacts/creative-rooms/src/lib/supabase/room-mappers.ts` | `Room` → `RoomOverviewItem` for existing cards |
| `artifacts/creative-rooms/src/lib/supabase/index.ts` | Barrel exports |

## Data UI glue (active)

| File | Purpose |
|------|---------|
| `artifacts/creative-rooms/src/components/ui/async-state.tsx` | Loading / error banners for data fetches |
| `artifacts/creative-rooms/src/hooks/use-supabase-rooms.ts` | React Query rooms + overview fallback |
| `artifacts/creative-rooms/src/hooks/use-supabase-hooks-list.ts` | React Query hooks list |
| `artifacts/creative-rooms/src/vite-env.d.ts` | `ImportMetaEnv` for VITE_* keys |

## Auth files (paused, not wired)

| File | Purpose |
|------|---------|
| `artifacts/creative-rooms/src/contexts/supabase-auth-context.tsx` | Future provider — **not mounted** |
| `artifacts/creative-rooms/src/components/auth/supabase-protected-route.tsx` | Future route guard — **unused** |
| `artifacts/creative-rooms/src/lib/supabase/auth.ts` | Low-level auth API — **not exported from barrel** |

## Modified (data only)

| File | Change |
|------|--------|
| `artifacts/creative-rooms/src/lib/supabase.ts` | Re-exports client (backward compatible) |
| `artifacts/creative-rooms/src/pages/rooms.tsx` | Supabase rooms + loading/error (demo fallback) |
| `artifacts/creative-rooms/src/pages/hooks.tsx` | API hooks, then Supabase, then demo feed |
| `artifacts/creative-rooms/src/components/home/home-dashboard.tsx` | Prefer API rooms/hooks, then Supabase, then demo |
| `scripts/src/apply-supabase-migrations.ts` | Apply `supabase/migrations` + verify schema |
| `scripts/src/verify-supabase-env.ts` | Check `artifacts/creative-rooms/.env` |

## Unchanged on purpose

- `artifacts/creative-rooms/src/pages/index.tsx` and `components/landing/*` (landing)
- Messages, notifications, settings, profile mock pages (still demo UI)
- Clerk production flow when Supabase env is empty
- `package.json` preinstall / root workspace layout

## Helper API summary

```ts
// Data (active)
createProfile, ensureProfileForCurrentUser, fetchRooms, createRoom
fetchHooks, uploadHookAudioAndCreate, sendMessage

// Storage
uploadAvatar, uploadHookAudio, uploadRoomImage, getPublicStorageUrl
```

## Verify locally

```bash
pnpm install
pnpm --filter @workspace/creative-rooms run build
pnpm run dev
```

With empty Supabase env: app behaves as before (demo data + dev auth bypass). With keys + migrations applied: `/rooms` and discover sections load live rows when present (anon RLS reads). Login still uses Clerk / dev bypass.
