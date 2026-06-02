/**
 * Verify artifacts/creative-rooms/.env has Supabase browser + DB URL (consistent project ref).
 * Usage: pnpm run verify:supabase-env
 */
import {
  applyCreativeRoomsEnvToProcess,
  assertEnvProjectConsistency,
  classifyDatabaseUrl,
  CREATIVE_ROOMS_ENV_PATH,
  parsePostgresHostname,
  projectRefFromSupabaseUrl,
  resolveDatabaseUrl,
} from "./load-creative-rooms-env.js";

const fileEnv = applyCreativeRoomsEnvToProcess();
const url = fileEnv.VITE_SUPABASE_URL ?? "";
const key = fileEnv.VITE_SUPABASE_ANON_KEY ?? "";
const db = resolveDatabaseUrl(fileEnv);

let ok = true;

console.log(`Env file: ${CREATIVE_ROOMS_ENV_PATH}\n`);

try {
  assertEnvProjectConsistency(fileEnv);
} catch (err) {
  console.error(`✗ ${err instanceof Error ? err.message : err}`);
  ok = false;
}

if (!url) {
  console.error("✗ VITE_SUPABASE_URL is empty");
  ok = false;
} else {
  try {
    const host = new URL(url).hostname;
    const ref = projectRefFromSupabaseUrl(url);
    console.log(`✓ VITE_SUPABASE_URL → ${host} (ref: ${ref})`);
  } catch {
    console.error("✗ VITE_SUPABASE_URL is not a valid URL");
    ok = false;
  }
}

if (!key) {
  console.error("✗ VITE_SUPABASE_ANON_KEY is empty");
  ok = false;
} else {
  console.log(`✓ VITE_SUPABASE_ANON_KEY (${key.length} chars)`);
}

if (!db || /USER:PASSWORD|@HOST:/i.test(db)) {
  console.warn("⚠ DATABASE_URL not set for migrations (pnpm run db:supabase:migrate)");
} else {
  try {
    const host = parsePostgresHostname(db);
    const mode = classifyDatabaseUrl(db);
    console.log(`✓ DATABASE_URL → ${host} (${mode})`);
    if (mode === "direct") {
      console.warn(
        "  ⚠ Direct db.* host is often IPv6-only. Use pooler session (5432) if migrate fails with ENOTFOUND.",
      );
    }
    if (mode === "pooler-transaction") {
      console.warn("  ⚠ Port 6543 is transaction pooler — use session pooler (5432) for migrations.");
    }
  } catch {
    console.warn("⚠ DATABASE_URL could not be parsed");
  }
}

process.exit(ok ? 0 : 1);
