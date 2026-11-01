import localFont from 'next/font/local';

/*
 * Polices auto-hébergées (aucune requête vers un service tiers).
 * Seule la police principale est préchargée : la police mono ne sert
 * qu'aux petites étiquettes et ne doit pas retarder le premier affichage.
 */
export const sans = localFont({
  src: '../../node_modules/geist/dist/fonts/geist-sans/Geist-Variable.woff2',
  variable: '--font-geist-sans',
  weight: '100 900',
  display: 'swap',
});

export const mono = localFont({
  src: '../../node_modules/geist/dist/fonts/geist-mono/GeistMono-Variable.woff2',
  variable: '--font-geist-mono',
  weight: '100 900',
  display: 'swap',
  preload: false,
});
