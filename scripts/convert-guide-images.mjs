#!/usr/bin/env node
/**
 * Converts AVIF images in public/images/guide-images to PNG.
 * Run: node scripts/convert-guide-images.mjs
 */

import { readdir, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const imagesDir = join(__dirname, "..", "public", "images", "guide-images");

const files = await readdir(imagesDir);
const avifFiles = files.filter((f) => f.endsWith(".avif"));

if (avifFiles.length === 0) {
  console.log("No AVIF files found.");
  process.exit(0);
}

for (const file of avifFiles) {
  const inputPath = join(imagesDir, file);
  const outputPath = join(imagesDir, file.replace(/\.avif$/, ".png"));
  try {
    await sharp(inputPath).png().toFile(outputPath);
    console.log(`Converted: ${file} → ${file.replace(/\.avif$/, ".png")}`);
  } catch (err) {
    console.error(`Failed ${file}:`, err.message);
  }
}

console.log(`Done. Converted ${avifFiles.length} images.`);
