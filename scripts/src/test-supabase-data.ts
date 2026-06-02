/**
 * Smoke-test Supabase data reads (anon). Requires VITE_* in artifacts/creative-rooms/.env.
 * Usage: pnpm --filter @workspace/scripts exec tsx ./src/test-supabase-data.ts
 */
import { createClient } from "@supabase/supabase-js";
import { applyCreativeRoomsEnvToProcess } from "./load-creative-rooms-env.js";

const fileEnv = applyCreativeRoomsEnvToProcess();
const url = fileEnv.VITE_SUPABASE_URL?.trim();
const key = fileEnv.VITE_SUPABASE_ANON_KEY?.trim();

if (!url || !key) {
  console.error("Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in artifacts/creative-rooms/.env");
  process.exit(1);
}

const supabase = createClient(url, key);

const { data: rooms, error: roomsError } = await supabase
  .from("rooms_with_stats")
  .select("id")
  .limit(5);
const { data: hooks, error: hooksError } = await supabase
  .from("hooks_with_creator")
  .select("id")
  .limit(5);

if (roomsError) {
  console.error("rooms_with_stats:", roomsError.message);
  process.exit(1);
}
if (hooksError) {
  console.error("hooks_with_creator:", hooksError.message);
  process.exit(1);
}

console.log(`✓ rooms_with_stats: ${rooms?.length ?? 0} row(s) (sample)`);
console.log(`✓ hooks_with_creator: ${hooks?.length ?? 0} row(s) (sample)`);
