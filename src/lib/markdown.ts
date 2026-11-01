import 'server-only';

import { marked } from 'marked';

/**
 * Convertit le Markdown des études de cas en HTML au moment du build.
 * Le contenu provient uniquement du dépôt (fichiers /content modifiés
 * par le propriétaire du site) : il est donc considéré comme fiable.
 * Le HTML brut éventuel est néanmoins neutralisé.
 */
const renderer = new marked.Renderer();
renderer.html = ({ text }) => text.replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function renderMarkdown(source: string): string {
  return marked.parse(source, { async: false, gfm: true, renderer });
}
