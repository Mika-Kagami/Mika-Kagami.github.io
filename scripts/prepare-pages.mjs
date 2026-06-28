import { copyFileSync, existsSync, mkdirSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const dist = join(root, "dist");
const distAssets = join(dist, "assets");
const rootAssets = join(root, "assets");
const sourceIndex = join(dist, "index.source.html");
const distIndex = join(dist, "index.html");
const rootIndex = join(root, "index.html");

if (existsSync(sourceIndex)) {
  copyFileSync(sourceIndex, distIndex);
  unlinkSync(sourceIndex);
}

mkdirSync(rootAssets, { recursive: true });

for (const entry of readdirSync(distAssets, { withFileTypes: true })) {
  if (entry.isFile()) {
    copyFileSync(join(distAssets, entry.name), join(rootAssets, entry.name));
  }
}

copyFileSync(distIndex, rootIndex);
