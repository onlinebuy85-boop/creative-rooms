import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = join(fileURLToPath(import.meta.url), "..", "..");
const distDir = join(packageRoot, "dist");
const indexHtml = join(distDir, "index.html");
const nestedPublic = join(distDir, "public");

if (!existsSync(indexHtml)) {
  console.error("[verify-dist] Expected dist/index.html — build output path is wrong.");
  process.exit(1);
}

if (existsSync(nestedPublic)) {
  console.error("[verify-dist] dist/public must not exist. Set Vite outDir to dist only.");
  process.exit(1);
}

console.info("[verify-dist] OK — dist/index.html present, no dist/public");
