/**
 * One-time brand asset generator — removes black bg, exports logo-full + logo-icon + favicons.
 * Place master artwork at artifacts/creative-rooms/src/assets/brand/source-logo.png before running.
 */
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const source = join(repoRoot, "artifacts/creative-rooms/src/assets/brand/source-logo.png");

const brandDir = join(repoRoot, "artifacts/creative-rooms/src/assets/brand");
const publicDir = join(repoRoot, "artifacts/creative-rooms/public");

mkdirSync(brandDir, { recursive: true });

const BLACK_THRESHOLD = 32;

async function removeBlackBackground(input: Buffer): Promise<Buffer> {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (r <= BLACK_THRESHOLD && g <= BLACK_THRESHOLD && b <= BLACK_THRESHOLD) {
      data[i + 3] = 0;
    }
  }

  return sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toBuffer();
}

async function trimTransparent(png: Buffer): Promise<Buffer> {
  return sharp(png).trim().png().toBuffer();
}

async function main() {
  const raw = await sharp(source).png().toBuffer();
  const transparent = await removeBlackBackground(raw);
  const fullTrimmed = await trimTransparent(transparent);

  const meta = await sharp(fullTrimmed).metadata();
  const w = meta.width ?? 1;
  const h = meta.height ?? 1;

  // Icon = upper ~52% (C mark + soundwave, above wordmark)
  const iconCropH = Math.round(h * 0.52);
  const iconPng = await sharp(fullTrimmed)
    .extract({ left: 0, top: 0, width: w, height: iconCropH })
    .trim()
    .png()
    .toBuffer();

  const logoFullPath = join(brandDir, "logo-full.png");
  const logoIconPath = join(brandDir, "logo-icon.png");

  await sharp(fullTrimmed).png({ compressionLevel: 9 }).toFile(logoFullPath);
  await sharp(iconPng).png({ compressionLevel: 9 }).toFile(logoIconPath);

  // Favicons from icon
  await sharp(iconPng).resize(32, 32, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(join(publicDir, "favicon.png"));
  await sharp(iconPng).resize(180, 180, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(join(publicDir, "apple-touch-icon.png"));

  console.log("Wrote", logoFullPath);
  console.log("Wrote", logoIconPath);
  console.log("Wrote favicon.png + apple-touch-icon.png");
  console.log("Full size:", w, "x", h);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
