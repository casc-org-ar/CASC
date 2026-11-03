/**
 * Extracts the Black Shopping Days visual assets (event logo + 3D shapes)
 * embedded in the approved prototype's standalone HTML bundle.
 *
 * Usage: node scripts/extract-bsd-assets.mjs "<path to prototype .html>"
 * Writes to public/assets/black-shopping-days/.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { gunzipSync } from "node:zlib";

const input = process.argv[2];
if (!input) {
  console.error('Usage: node scripts/extract-bsd-assets.mjs "<prototype.html>"');
  process.exit(1);
}

/** Bundle asset id → output file, relative to public/assets/black-shopping-days. */
const TARGETS = {
  "67b90a28-62cf-4c2a-9e15-4d237058af4e": "bsd-logo.webp",
  "3b9e21e7-ffe3-4661-85ab-9f3dcf5669f3": "3d/shape-01.webp",
  "c80c34a3-649f-406a-9f75-34180ce015f3": "3d/shape-02.webp",
  "b1ac7197-3589-4352-a7e4-000edc1fbe9a": "3d/shape-03.webp",
  "e7521959-ebf9-4ea4-8c69-7119ba4546b8": "3d/shape-04.webp",
  "da4c3f2e-b3fa-4d11-a6e0-89dadeee71d4": "3d/shape-05.webp",
  "f6c980f0-770b-4f88-9adb-a24faadf84b0": "3d/shape-06.webp",
  "4ea8e0c7-6319-482a-9371-924979b7352d": "3d/shape-07.webp",
  "925036cf-b907-4565-8797-c20ff538c0fc": "3d/shape-08.webp",
  "bb0e2207-95cf-4274-8e49-707c9324912b": "3d/shape-09.webp",
};

const html = readFileSync(input, "utf8");
const match = html.match(/<script type="__bundler\/manifest">([\s\S]*?)<\/script>/);
if (!match) {
  console.error("Manifest not found: is this the prototype's standalone HTML?");
  process.exit(1);
}
const manifest = JSON.parse(match[1]);

const outDir = join(process.cwd(), "public/assets/black-shopping-days");
mkdirSync(join(outDir, "3d"), { recursive: true });

let written = 0;
for (const [id, file] of Object.entries(TARGETS)) {
  const entry = manifest[id];
  if (!entry) {
    console.warn(`missing in bundle: ${file} (${id})`);
    continue;
  }
  let bytes = Buffer.from(entry.data, "base64");
  if (entry.compressed) bytes = gunzipSync(bytes);
  writeFileSync(join(outDir, file), bytes);
  written += 1;
  console.log(`✓ ${file} (${bytes.length} bytes)`);
}
console.log(`${written}/${Object.keys(TARGETS).length} assets written to ${outDir}`);
