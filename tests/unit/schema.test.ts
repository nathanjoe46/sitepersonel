import { describe, expect, it } from 'vitest';

import { projectSchema } from '@/lib/schema';

const base = {
  title: 'Test',
  order: 1,
  summary: { fr: 'Résumé', en: 'Summary' },
};

describe('schéma des projets', () => {
  it('accepte un projet minimal et applique les valeurs par défaut', () => {
    const project = projectSchema.parse(base);
    expect(project.published).toBe(true);
    expect(project.stack).toEqual([]);
    expect(project.body).toBeUndefined();
  });

  it('traite les champs laissés vides par l’admin comme absents', () => {
    const project = projectSchema.parse({
      ...base,
      start: '',
      status: '',
      role: { fr: '', en: '' },
      cover: { src: '', alt: { fr: '', en: '' } },
      body: { fr: '', en: '' },
      links: { live: '', repo: '' },
    });
    expect(project.start).toBeUndefined();
    expect(project.status).toBeUndefined();
    expect(project.role).toBeUndefined();
    expect(project.cover).toBeUndefined();
    expect(project.body).toBeUndefined();
    expect(project.links.live).toBeUndefined();
  });

  it('refuse une traduction manquante', () => {
    expect(() => projectSchema.parse({ ...base, summary: { fr: 'Résumé', en: '' } })).toThrow();
    expect(() => projectSchema.parse({ ...base, role: { fr: 'Développeur', en: '' } })).toThrow();
  });

  it('refuse une date mal formée et un champ inconnu', () => {
    expect(() => projectSchema.parse({ ...base, start: '08/2024' })).toThrow();
    expect(() => projectSchema.parse({ ...base, unknown: true })).toThrow();
  });

  it('refuse un lien non http(s)', () => {
    expect(() =>
      projectSchema.parse({ ...base, links: { live: 'javascript:alert(1)' } }),
    ).toThrow();
  });
});
