/**
 * Génère des variantes AVIF et WebP de chaque image de public/images
 * (y compris celles ajoutées depuis l'admin) et un manifeste avec leurs
 * dimensions, utilisé par le composant <Picture> pour éviter tout décalage
 * de mise en page (CLS). Les fichiers déjà à jour sont ignorés.
 */
import { createHash } from 'node:crypto';
import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

import sharp from 'sharp';

const ROOT = process.cwd();
const SOURCE_DIR = path.join(ROOT, 'public', 'images');
const OUTPUT_DIR = path.join(ROOT, 'public', '_generated');
const MANIFEST = path.join(ROOT, '.generated', 'image-manifest.json');
const WIDTHS = [400, 800, 1200, 1600];
const EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);
  const files = await Promise.all(
    entries.map((entry) => {
      const full = path.join(dir, entry.name);
      return entry.isDirectory() ? walk(full) : [full];
    }),
  );
  return files.flat();
}

async function isFresh(output, sourceMtime) {
  try {
    return (await stat(output)).mtimeMs >= sourceMtime;
  } catch {
    return false;
  }
}

async function processImage(file) {
  const publicPath = '/' + path.relative(path.join(ROOT, 'public'), file).split(path.sep).join('/');
  const { mtimeMs } = await stat(file);
  const input = await readFile(file);
  const hash = createHash('sha1').update(input).digest('hex').slice(0, 8);
  const base = path
    .basename(file, path.extname(file))
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-');
  const image = sharp(input).rotate();
  const { width = 0, height = 0 } = await image.metadata();

  const widths = WIDTHS.filter((w) => w < width);
  widths.push(Math.min(width, WIDTHS.at(-1)));
  const unique = [...new Set(widths)];

  const variants = { avif: [], webp: [] };
  for (const w of unique) {
    for (const format of ['avif', 'webp']) {
      const name = `${base}-${hash}-${w}.${format}`;
      const output = path.join(OUTPUT_DIR, name);
      if (!(await isFresh(output, mtimeMs))) {
        const pipeline = sharp(input).rotate().resize({ width: w, withoutEnlargement: true });
        await (
          format === 'avif'
            ? pipeline.avif({ quality: 55, effort: 4 })
            : pipeline.webp({ quality: 78 })
        ).toFile(output);
      }
      variants[format].push({ width: w, src: `/_generated/${name}` });
    }
  }

  // Couleur moyenne : fond affiché pendant le chargement.
  const { dominant } = await sharp(input).stats();
  const placeholder = `rgb(${dominant.r} ${dominant.g} ${dominant.b})`;

  return [publicPath, { width, height, placeholder, ...variants }];
}

await mkdir(OUTPUT_DIR, { recursive: true });
await mkdir(path.dirname(MANIFEST), { recursive: true });

const files = (await walk(SOURCE_DIR)).filter((f) => EXTENSIONS.has(path.extname(f).toLowerCase()));
const entries = await Promise.all(files.map(processImage));
const manifest = Object.fromEntries(entries.sort(([a], [b]) => a.localeCompare(b)));

await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
console.log(`Images : ${files.length} source(s) traitée(s) → public/_generated`);
