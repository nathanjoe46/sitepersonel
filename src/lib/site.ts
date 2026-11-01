/**
 * Paramètres du site dépendant de l'hébergement.
 * - NEXT_PUBLIC_BASE_PATH : sous-dossier GitHub Pages (ex. "/sitepersonel"), vide sinon.
 * - NEXT_PUBLIC_SITE_URL  : URL publique complète, sans slash final.
 * Avec un domaine personnalisé, il suffit de modifier ces deux variables dans le workflow.
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nathanjoe46.github.io/sitepersonel'
).replace(/\/$/, '');

export const repositoryUrl = 'https://github.com/nathanjoe46/sitepersonel';

/** Préfixe un chemin de /public avec le basePath (next/link le fait déjà pour les routes). */
export function asset(path: string): string {
  return `${basePath}${path}`;
}

/** URL absolue d'une page ou d'un fichier, pour les métadonnées SEO. */
export function absoluteUrl(path = '/'): string {
  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
}
