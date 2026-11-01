/**
 * Petit serveur statique pour tester l'export (out/) comme sur GitHub Pages :
 * index.html par dossier, 404.html pour les routes inconnues.
 * Usage : node scripts/serve.mjs <dossier> <port> [basePath]
 */
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';

const [dir = 'out', port = '4173', basePath = ''] = process.argv.slice(2);
const root = path.resolve(dir);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.woff2': 'font/woff2',
  '.yml': 'text/yaml',
  '.webmanifest': 'application/manifest+json',
};

async function resolve(urlPath) {
  if (basePath && !urlPath.startsWith(basePath)) return null;
  const relative = decodeURIComponent(urlPath.slice(basePath.length).split('?')[0] ?? '/');
  const file = path.join(root, relative);
  if (!file.startsWith(root)) return null;
  try {
    const info = await stat(file);
    if (info.isDirectory()) {
      if (!urlPath.endsWith('/')) return { redirect: urlPath + '/' };
      return { file: path.join(file, 'index.html') };
    }
    return { file };
  } catch {
    return null;
  }
}

createServer(async (req, res) => {
  const found = await resolve(req.url ?? '/');
  if (found?.redirect) {
    res.writeHead(301, { Location: found.redirect }).end();
    return;
  }
  const file = found?.file ?? path.join(root, '404.html');
  const status = found ? 200 : 404;
  try {
    await stat(file);
    res.writeHead(status, {
      'Content-Type': types[path.extname(file)] ?? 'application/octet-stream',
    });
    createReadStream(file).pipe(res);
  } catch {
    res.writeHead(404).end('Not found');
  }
}).listen(Number(port), () => {
  console.log(`Serveur statique : http://localhost:${port}${basePath}/`);
});
