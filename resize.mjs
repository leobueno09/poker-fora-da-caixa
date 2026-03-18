import sharp from 'sharp';
import { readdir, rename, unlink } from 'fs/promises';
import { join, extname } from 'path';

const MAX = 2000;
const DIRS = ['brand_assets', 'Fotos - Palestra'];
const EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);

async function processDir(dir) {
  let files;
  try {
    files = await readdir(dir);
  } catch {
    console.log(`Skipping ${dir} (not found)`);
    return;
  }

  for (const file of files) {
    const ext = extname(file).toLowerCase();
    if (!EXTS.has(ext)) continue;
    const filePath = join(dir, file);

    const meta = await sharp(filePath).metadata();
    const { width, height } = meta;

    if (width <= MAX && height <= MAX) {
      console.log(`  OK   ${file} (${width}x${height})`);
      continue;
    }

    const tmpPath = filePath + '.tmp';

    // Write to temp file first, then replace original
    await sharp(filePath)
      .resize(MAX, MAX, { fit: 'inside', withoutEnlargement: true })
      .toFile(tmpPath);

    await unlink(filePath);
    await rename(tmpPath, filePath);

    const after = await sharp(filePath).metadata();
    console.log(`  DONE ${file} ${width}x${height} → ${after.width}x${after.height}`);
  }
}

for (const dir of DIRS) {
  console.log(`\n== ${dir} ==`);
  await processDir(dir);
}

console.log('\nConcluído.');
