/**
 * Génère les images de partage (Open Graph, 1200×630) dans public/og/.
 * À relancer après un changement de nom ou de titre : `pnpm og`.
 * Utilise Playwright (Chromium) et la police Geist du projet.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { chromium } from '@playwright/test';

const root = process.cwd();
const profile = JSON.parse(readFileSync(path.join(root, 'content/profile.json'), 'utf8'));
// Polices intégrées en base64 : la page générée n'a pas accès au disque.
const font = (file) =>
  `data:font/woff2;base64,${readFileSync(path.join(root, 'node_modules/geist/dist/fonts', file)).toString('base64')}`;

const escape = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const html = (locale) => `<!doctype html>
<html lang="${locale}"><head><meta charset="utf-8"><style>
@font-face { font-family: Geist; src: url('${font('geist-sans/Geist-Variable.woff2')}') format('woff2'); font-weight: 100 900; }
@font-face { font-family: GeistMono; src: url('${font('geist-mono/GeistMono-Variable.woff2')}') format('woff2'); font-weight: 100 900; }
html, body { margin: 0; width: 1200px; height: 630px; }
body { background: #fbfbf9; color: #17171a; font-family: Geist; display: flex; flex-direction: column; justify-content: space-between; padding: 80px 88px; box-sizing: border-box; }
.eyebrow { font-family: GeistMono; font-size: 24px; color: #55555d; letter-spacing: 0.02em; }
h1 { font-size: 76px; font-weight: 600; letter-spacing: -0.035em; line-height: 1.02; margin: 28px 0 0; }
p { font-size: 34px; line-height: 1.3; margin: 28px 0 0; max-width: 960px; color: #17171a; }
footer { display: flex; justify-content: space-between; align-items: center; border-top: 2px solid #e3e3e0; padding-top: 28px; font-family: GeistMono; font-size: 22px; color: #55555d; }
.dot { display: inline-block; width: 12px; height: 12px; border-radius: 50%; background: #1d4ccf; margin-right: 14px; vertical-align: middle; }
</style></head><body>
<div>
  <div class="eyebrow">${escape(profile.role[locale])}</div>
  <h1>${escape(profile.name)}</h1>
  <p>${escape(profile.headline[locale])}</p>
</div>
<footer><span><span class="dot"></span>${escape(profile.location[locale])}</span><span>PHP · Laravel · React · TypeScript</span></footer>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const locale of ['fr', 'en']) {
  await page.setContent(html(locale), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `public/og/${locale}.png`, type: 'png' });
  console.log(`public/og/${locale}.png`);
}
await browser.close();
