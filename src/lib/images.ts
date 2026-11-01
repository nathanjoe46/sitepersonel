import 'server-only';

import { readFileSync } from 'node:fs';
import path from 'node:path';

import { z } from 'zod';

const variant = z.object({ width: z.number(), src: z.string() });
const entry = z.object({
  width: z.number(),
  height: z.number(),
  placeholder: z.string(),
  avif: z.array(variant).min(1),
  webp: z.array(variant).min(1),
});
const manifestSchema = z.record(z.string(), entry);

export type ImageEntry = z.output<typeof entry>;

let cache: z.output<typeof manifestSchema> | undefined;

function manifest() {
  if (!cache) {
    const file = path.join(process.cwd(), '.generated', 'image-manifest.json');
    try {
      cache = manifestSchema.parse(JSON.parse(readFileSync(file, 'utf8')));
    } catch (error) {
      throw new Error(
        'Manifeste d’images introuvable ou invalide : lancez « pnpm images » avant le build.',
        { cause: error },
      );
    }
  }
  return cache;
}

export function getImage(src: string): ImageEntry {
  const found = manifest()[src];
  if (!found) {
    throw new Error(`Image absente du manifeste : ${src} (vérifiez le chemin dans /content).`);
  }
  return found;
}
