import { describe, expect, it } from 'vitest';

import { getDictionary } from '@/i18n/dictionaries';
import { formatPeriod, formatYearMonth } from '@/lib/format';
import { serializeJsonLd } from '@/lib/json-ld';
import { renderMarkdown } from '@/lib/markdown';

const labels = { present: 'aujourd’hui', ongoing: 'En cours' };

function keys(value: unknown, prefix = ''): string[] {
  if (typeof value !== 'object' || value === null) return [prefix];
  return Object.entries(value).flatMap(([k, v]) => keys(v, prefix ? `${prefix}.${k}` : k));
}

describe('dictionnaires', () => {
  it('le français et l’anglais ont exactement les mêmes clés', () => {
    expect(keys(getDictionary('en')).sort()).toEqual(keys(getDictionary('fr')).sort());
  });
});

describe('dates', () => {
  it('formate année et année-mois', () => {
    expect(formatYearMonth('2023', 'fr')).toBe('2023');
    expect(formatYearMonth('2023-08', 'fr')).toBe('août 2023');
    expect(formatYearMonth('2023-08', 'en')).toBe('Aug 2023');
  });

  it('formate une période', () => {
    expect(formatPeriod('2023-08', 'present', 'fr', labels)).toBe('août 2023 – aujourd’hui');
    expect(formatPeriod('2019', '2023', 'fr', labels)).toBe('2019 – 2023');
    expect(formatPeriod('2023', '2023', 'fr', labels)).toBe('2023');
    expect(formatPeriod(undefined, 'present', 'fr', labels)).toBe('En cours');
    expect(formatPeriod(undefined, undefined, 'fr', labels)).toBeUndefined();
  });
});

describe('sécurité du rendu', () => {
  it('neutralise le HTML brut dans le Markdown', () => {
    const html = renderMarkdown('Texte <script>alert(1)</script>\n\n<img src=x onerror=alert(1)>');
    expect(html).not.toContain('<script');
    expect(html).not.toContain('<img');
  });

  it('empêche de fermer la balise <script> du JSON-LD', () => {
    expect(serializeJsonLd({ a: '</script><script>alert(1)</script>' })).not.toContain('</script');
  });
});
