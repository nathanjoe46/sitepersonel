import { existsSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  getCaseStudies,
  getCompany,
  getContact,
  getEducation,
  getExperience,
  getProfile,
  getProjects,
  getPublicSector,
  getSkills,
  getTeaching,
} from '@/lib/content';

const publicFile = (p: string) => path.join(process.cwd(), 'public', p);

describe('contenu éditorial (/content)', () => {
  it('chaque fichier respecte son schéma', () => {
    expect(() => {
      getProfile();
      getContact();
      getSkills();
      getExperience();
      getEducation();
      getCompany();
      getPublicSector();
      getTeaching();
      getProjects();
    }).not.toThrow();
  });

  it('les fichiers référencés (photo, CV, images de projets) existent', () => {
    const profile = getProfile();
    const paths = [
      profile.photo.src,
      profile.cv.fr,
      ...(profile.cv.en ? [profile.cv.en] : []),
      ...getProjects().flatMap((p) => [
        ...(p.cover ? [p.cover.src] : []),
        ...p.gallery.map((g) => g.src),
      ]),
    ];
    for (const p of paths) expect(existsSync(publicFile(p)), p).toBe(true);
  });

  it('les projets ont un ordre unique et au moins un projet phare', () => {
    const projects = getProjects();
    const orders = projects.map((p) => p.order);
    expect(new Set(orders).size).toBe(orders.length);
    expect(projects.some((p) => p.featured)).toBe(true);
  });

  it('les projets non publiés sont exclus', () => {
    expect(getProjects().map((p) => p.slug)).not.toContain('enjoylotto');
  });

  it('seuls les projets avec étude de cas ont une page dédiée', () => {
    for (const project of getCaseStudies()) expect(project.body).toBeDefined();
  });

  it('la section secteur public ne nomme pas l’institution', () => {
    const serialized = JSON.stringify([getPublicSector(), getExperience()]).toLowerCase();
    for (const term of ['ibesr', 'synapse', 'sinapse', 'fiprosah']) {
      expect(serialized).not.toContain(term);
    }
  });
});
