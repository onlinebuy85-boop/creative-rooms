# Supabase — Creative Room

SQL migrations and setup notes for the browser client in `artifacts/creative-rooms`.

## Apply migrations

**Recommended (repo script):**

1. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `artifacts/creative-rooms/.env`.
2. Set `DATABASE_URL` to the **Session pooler** URI (port **5432**) from Dashboard → Connect.
   - Direct `db.[ref].supabase.co` is often **IPv6-only** and fails with `ENOTFOUND` on IPv4 networks.
   - Use user `postgres.[project-ref]`, host `aws-0-[region].pooler.supabase.com`.
3. Run:

```bash
pnpm install
pnpm run verify:supabase-env
pnpm run db:supabase:migrate
```

Using the [Supabase CLI](https://supabase.com/docs/guides/cli):

```bash
cd /path/to/CreativeRoom
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

Or run each file in order in the Supabase Dashboard → SQL Editor:

1. `migrations/20260301120000_profiles.sql`
2. `migrations/20260301120001_rooms.sql`
3. `migrations/20260301120002_hooks.sql`
4. `migrations/20260301120003_messages.sql`
5. `migrations/20260301120004_storage.sql`
6. `migrations/20260301120005_rls.sql`

## Environment

Set in **`artifacts/creative-rooms/.env`** (Vite loads from the app package directory):

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Root `.env.example` documents the same variables for copy-paste.

## Storage buckets

| Bucket        | Public | Purpose              |
|---------------|--------|----------------------|
| `avatars`     | yes    | Profile avatars      |
| `hooks`       | no     | Hook audio uploads   |
| `room-images` | yes    | Room cover images    |

## Frontend modules

See `docs/SUPABASE_INTEGRATION.md` for the full file list and behavior.
