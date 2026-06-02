import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

/** Single source of truth for Supabase + DB env (Vite app + migration scripts). */
export const CREATIVE_ROOMS_ENV_PATH = join(repoRoot, "artifacts/creative-rooms/.env");

export function loadCreativeRoomsEnv(path = CREATIVE_ROOMS_ENV_PATH): Record<string, string> {
  const out: Record<string, string> = {};
  try {
    const raw = readFileSync(path, "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      out[key] = value;
    }
  } catch {
    // missing file
  }
  return out;
}

/** File values override process.env for Creative Room Supabase keys. */
export function applyCreativeRoomsEnvToProcess(path = CREATIVE_ROOMS_ENV_PATH): Record<string, string> {
  const fileEnv = loadCreativeRoomsEnv(path);
  for (const key of [
    "DATABASE_URL",
    "SUPABASE_DB_URL",
    "VITE_SUPABASE_URL",
    "VITE_SUPABASE_ANON_KEY",
  ]) {
    if (fileEnv[key]) {
      process.env[key] = fileEnv[key];
    }
  }
  return fileEnv;
}

export function projectRefFromSupabaseUrl(url: string): string {
  return new URL(url).hostname.split(".")[0];
}

export function parsePostgresHostname(connectionString: string): string {
  return new URL(connectionString.replace(/^postgres:/, "https:")).hostname;
}

export type DbConnectionMode = "direct" | "pooler-session" | "pooler-transaction" | "unknown";

/** Classify Supabase Postgres URL for migration tooling. */
export function classifyDatabaseUrl(connectionString: string): DbConnectionMode {
  try {
    const u = new URL(connectionString.replace(/^postgres:/, "https:"));
    const host = u.hostname;
    const port = u.port || "5432";
    if (host.startsWith("db.") && host.endsWith(".supabase.co")) return "direct";
    if (host.includes(".pooler.supabase.com")) {
      return port === "6543" ? "pooler-transaction" : "pooler-session";
    }
    return "unknown";
  } catch {
    return "unknown";
  }
}

export function assertEnvProjectConsistency(fileEnv: Record<string, string>): void {
  const viteUrl = fileEnv.VITE_SUPABASE_URL?.trim();
  const dbUrl = (fileEnv.DATABASE_URL ?? fileEnv.SUPABASE_DB_URL)?.trim();
  if (!viteUrl || !dbUrl) return;

  const apiRef = projectRefFromSupabaseUrl(viteUrl);
  const dbHost = parsePostgresHostname(dbUrl);

  if (dbHost.startsWith("db.")) {
    const directRef = dbHost.replace(/^db\./, "").replace(/\.supabase\.co$/, "");
    if (directRef !== apiRef) {
      throw new Error(
        `DATABASE_URL project (${directRef}) does not match VITE_SUPABASE_URL (${apiRef})`,
      );
    }
  } else if (dbHost.includes(".pooler.supabase.com")) {
    const user = new URL(dbUrl.replace(/^postgres:/, "https:")).username;
    const poolerRef = user.startsWith("postgres.") ? user.slice("postgres.".length) : "";
    if (poolerRef && poolerRef !== apiRef) {
      throw new Error(
        `DATABASE_URL pooler user (${poolerRef}) does not match VITE_SUPABASE_URL (${apiRef})`,
      );
    }
  }
}

export function resolveDatabaseUrl(fileEnv: Record<string, string>): string {
  return (
    fileEnv.DATABASE_URL?.trim() ||
    fileEnv.SUPABASE_DB_URL?.trim() ||
    process.env.DATABASE_URL?.trim() ||
    process.env.SUPABASE_DB_URL?.trim() ||
    ""
  );
}
