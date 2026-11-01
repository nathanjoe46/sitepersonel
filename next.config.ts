import type { NextConfig } from 'next';

/**
 * Le site est exporté en HTML statique pour GitHub Pages.
 * NEXT_PUBLIC_BASE_PATH est fourni par le workflow de déploiement
 * (ex. "/sitepersonel"), et reste vide en local ou avec un domaine personnalisé.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const nextConfig: NextConfig = {
  output: 'export',
  ...(basePath ? { basePath } : {}),
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
  // 404 commune à toutes les langues (layout racine sous [locale]).
  experimental: { globalNotFound: true },
};

export default nextConfig;
