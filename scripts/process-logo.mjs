/**
 * Builds web-ready logo assets from the hotel's official logo artwork
 * (assets/brand/hotel-panorama-logo.jpg, black + gold on white).
 *
 * The white background is removed with clean anti-aliased alpha: gold pixels
 * keep the logo's own gold, neutral (black) pixels become either the original
 * ink (for light backgrounds) or ivory (for dark backgrounds).
 *
 *   npm run logo
 *
 * Outputs → public/brand/*.png, src/app/icon.png, src/app/apple-icon.png
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(root, "assets/brand/hotel-panorama-logo.jpg");
const OUT = path.join(root, "public/brand");
fs.mkdirSync(OUT, { recursive: true });

const INK_DARK = [31, 29, 27]; // near-black, as in the artwork
const INK_LIGHT = [245, 240, 231]; // Warm Ivory #F5F0E7

/** Regions of the 1068×1063 artwork (found by scanning ink rows). */
const CROPS = {
  full: { left: 163, top: 228, width: 748, height: 608 }, // sun → "Rooms – Banquet"
  mark: { left: 163, top: 228, width: 748, height: 448 }, // sun → PANORAMA
  sun: { left: 319, top: 228, width: 442, height: 240 },
};

const { data, info } = await sharp(SRC).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width;

// Sample the solid gold from the centre of the sun disc.
const sample = (x, y) => {
  const i = (y * W + x) * 3;
  return [data[i], data[i + 1], data[i + 2]];
};
const gold = [0, 1, 2].map((ch) => Math.round([sample(540, 430), sample(520, 440), sample(560, 440)].reduce((s, p) => s + p[ch], 0) / 3));
console.log("logo gold:", `rgb(${gold.join(",")})`);

const clamp = (v) => Math.max(0, Math.min(1, v));

function cutout(ink) {
  const out = Buffer.alloc(info.width * info.height * 4);
  for (let p = 0, q = 0; p < data.length; p += 3, q += 4) {
    const r = data[p], g = data[p + 1], b = data[p + 2];
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let a, col;
    if (max - min > 18) {
      // Gold: coverage from how far blue has dropped toward the solid gold.
      a = clamp((250 - b) / (250 - gold[2]));
      col = gold;
    } else {
      a = clamp((248 - min) / (248 - 40));
      col = ink;
    }
    // Drop faint JPEG speckle around the artwork and firm up solid strokes.
    a = clamp((a - 0.09) / 0.86);
    out[q] = col[0];
    out[q + 1] = col[1];
    out[q + 2] = col[2];
    out[q + 3] = Math.round(a * 255);
  }
  return sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } });
}

async function write(img, crop, file) {
  const buf = await img.clone().extract(crop).png({ compressionLevel: 9, palette: false }).toBuffer();
  fs.writeFileSync(path.join(OUT, file), buf);
  const meta = await sharp(buf).metadata();
  console.log(`public/brand/${file}`.padEnd(36), `${meta.width}×${meta.height}`, `${(buf.length / 1024).toFixed(0)} KB`);
  // Compact 480px palette PNG served as-is by <Logo> (≈3× its on-screen width),
  // so the logo never waits on the image optimiser.
  const webFile = file.replace(/\.png$/, "-480.png");
  const small = await sharp(buf).resize({ width: 480 }).png({ palette: true, colors: 64, effort: 10, compressionLevel: 9, dither: 0.5 }).toBuffer();
  fs.writeFileSync(path.join(OUT, webFile), small);
  const sm = await sharp(small).metadata();
  console.log(`public/brand/${webFile}`.padEnd(36), `${sm.width}×${sm.height}`, `${(small.length / 1024).toFixed(0)} KB`);
}

const dark = cutout(INK_DARK);
const light = cutout(INK_LIGHT);
await write(dark, CROPS.full, "logo-full-dark.png");
await write(light, CROPS.full, "logo-full-light.png");
await write(dark, CROPS.mark, "logo-mark-dark.png");
await write(light, CROPS.mark, "logo-mark-light.png");

// Favicons: the gold sunburst on a transparent background.
const sun = await light.clone().extract(CROPS.sun).png().toBuffer();
for (const [file, size] of [["icon.png", 512], ["apple-icon.png", 180]]) {
  const sunImg = await sharp(sun).resize(Math.round(size * 0.96), size, { fit: "inside" }).toBuffer();
  const m = await sharp(sunImg).metadata();
  await sharp({ create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: sunImg, left: Math.round((size - m.width) / 2), top: Math.round((size - m.height) / 2) }])
    .png()
    .toFile(path.join(root, "src/app", file));
  console.log(`src/app/${file}`.padEnd(36), `${size}×${size}`);
}
