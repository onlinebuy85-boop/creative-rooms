/**
 * Apply supabase/migrations/*.sql in order against Postgres.
 *
 * Env: artifacts/creative-rooms/.env (always preferred over shell DATABASE_URL)
 *
 * Connection modes (Supabase):
 * - Direct: db.[ref].supabase.co:5432 — IPv6-only on many networks (may ENOTFOUND on IPv4)
 * - Pooler session: aws-0-[region].pooler.supabase.com:5432 — use for migrations on IPv4
 * - Pooler transaction: port 6543 — NOT for migrations (DDL)
 *
 * Usage: pnpm run db:supabase:migrate
 */
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";
import {
  applyCreativeRoomsEnvToProcess,
  assertEnvProjectConsistency,
  classifyDatabaseUrl,
  CREATIVE_ROOMS_ENV_PATH,
  parsePostgresHostname,
  resolveDatabaseUrl,
} from "./load-creative-rooms-env.js";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

const fileEnv = applyCreativeRoomsEnvToProcess();
assertEnvProjectConsistency(fileEnv);

const connectionString = resolveDatabaseUrl(fileEnv);

if (!connectionString || /USER:PASSWORD|@HOST:/i.test(connectionString)) {
  console.error(
    [
      "Missing Supabase Postgres connection string.",
      `Set DATABASE_URL in ${CREATIVE_ROOMS_ENV_PATH}`,
      "Use pooler session mode (port 5432) if direct db.[ref].supabase.co fails with ENOTFOUND.",
      "Dashboard → Connect → Session pooler URI.",
    ].join("\n"),
  );
  process.exit(1);
}

const mode = classifyDatabaseUrl(connectionString);
const hostname = parsePostgresHostname(connectionString);

function maskDatabaseUrl(url: string): string {
  return url.replace(/:([^:@/][^@]*)@/, ":***@");
}

console.log(`Env file: ${CREATIVE_ROOMS_ENV_PATH}`);
console.log(`Connection mode: ${mode} (host: ${hostname})`);
if (mode === "pooler-transaction") {
  console.warn(
    "Warning: port 6543 is transaction pooler — migrations may fail. Use session pooler (5432) or direct.",
  );
}
if (mode === "direct") {
  console.warn(
    "Note: direct db.* host is often IPv6-only. If connect fails with ENOTFOUND, switch to pooler session URL.",
  );
}

// Debug: full URL is in process.env; log masked form to avoid leaking password in CI logs.
console.log("DATABASE_URL (masked):", maskDatabaseUrl(process.env.DATABASE_URL ?? connectionString));

const migrationsDir = join(repoRoot, "supabase/migrations");
const files = readdirSync(migrationsDir)
  .filter((f) => f.endsWith(".sql"))
  .sort();

const client = new pg.Client({
  connectionString,
  ssl: connectionString.includes("localhost") ? undefined : { rejectUnauthorized: false },
});

async function main() {
  await client.connect();
  console.log(`Applying ${files.length} migrations from supabase/migrations/…`);

  for (const file of files) {
    const sql = readFileSync(join(migrationsDir, file), "utf8");
    process.stdout.write(`  → ${file} … `);
    try {
      await client.query(sql);
      console.log("ok");
    } catch (err) {
      console.log("failed");
      throw err;
    }
  }

  console.log("\nVerifying schema…");
  const checks = await verifySchema(client);
  for (const row of checks) {
    console.log(`  ${row.ok ? "✓" : "✗"} ${row.label}${row.detail ? ` (${row.detail})` : ""}`);
  }

  const failed = checks.filter((c) => !c.ok);
  await client.end();
  if (failed.length) {
    process.exit(1);
  }
  console.log("\nAll migrations applied and verified.");
}

type Check = { label: string; ok: boolean; detail?: string };

async function verifySchema(client: pg.Client): Promise<Check[]> {
  const table = async (name: string) => {
    const r = await client.query(
      `select 1 from information_schema.tables where table_schema = 'public' and table_name = $1`,
      [name],
    );
    return r.rowCount !== null && r.rowCount > 0;
  };

  const view = async (name: string) => {
    const r = await client.query(
      `select 1 from information_schema.views where table_schema = 'public' and table_name = $1`,
      [name],
    );
    return r.rowCount !== null && r.rowCount > 0;
  };

  const bucket = async (id: string) => {
    const r = await client.query(`select 1 from storage.buckets where id = $1`, [id]);
    return r.rowCount !== null && r.rowCount > 0;
  };

  const rlsEnabled = async (name: string) => {
    const r = await client.query(
      `select relrowsecurity from pg_class c
       join pg_namespace n on n.oid = c.relnamespace
       where n.nspname = 'public' and c.relname = $1`,
      [name],
    );
    return r.rows[0]?.relrowsecurity === true;
  };

  const policyCount = async (table: string) => {
    const r = await client.query(
      `select count(*)::int as n from pg_policies where schemaname = 'public' and tablename = $1`,
      [table],
    );
    return Number(r.rows[0]?.n ?? 0);
  };

  const checks: Check[] = [];

  for (const t of [
    "profiles",
    "rooms",
    "room_members",
    "hooks",
    "hook_seats",
    "messages",
  ]) {
    checks.push({ label: `table public.${t}`, ok: await table(t) });
  }

  for (const v of ["rooms_with_stats", "hooks_with_creator", "messages_with_sender"]) {
    checks.push({ label: `view public.${v}`, ok: await view(v) });
  }

  for (const b of ["avatars", "hooks", "room-images"]) {
    checks.push({ label: `storage bucket ${b}`, ok: await bucket(b) });
  }

  for (const t of ["profiles", "rooms", "hooks", "messages"]) {
    const enabled = await rlsEnabled(t);
    const policies = await policyCount(t);
    checks.push({
      label: `RLS on public.${t}`,
      ok: enabled && policies > 0,
      detail: enabled ? `${policies} policies` : "disabled",
    });
  }

  return checks;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
