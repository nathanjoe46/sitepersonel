import 'server-only';

import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

import type { z } from 'zod';

import {
  companySchema,
  contactSchema,
  educationSchema,
  experienceSchema,
  profileSchema,
  projectSchema,
  publicSectorSchema,
  skillsSchema,
  teachingSchema,
  type Project,
} from './schema';

const CONTENT_DIR = path.join(process.cwd(), 'content');

function load<S extends z.ZodType>(schema: S, relativePath: string): z.output<S> {
  const file = path.join(CONTENT_DIR, relativePath);
  const raw: unknown = JSON.parse(readFileSync(file, 'utf8'));
  const result = schema.safeParse(raw);
  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `  • ${issue.path.join('.') || '(racine)'} : ${issue.message}`)
      .join('\n');
    throw new Error(`Contenu invalide dans content/${relativePath} :\n${issues}`);
  }
  return result.data;
}

export const getProfile = () => load(profileSchema, 'profile.json');
export const getContact = () => load(contactSchema, 'contact.json');
export const getSkills = () => load(skillsSchema, 'skills.json');
export const getExperience = () => load(experienceSchema, 'experience.json');
export const getEducation = () => load(educationSchema, 'education.json');
export const getCompany = () => load(companySchema, 'company.json');
export const getPublicSector = () => load(publicSectorSchema, 'public-sector.json');
export const getTeaching = () => load(teachingSchema, 'teaching.json');

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Projets publiés, triés par `order` croissant. */
export function getProjects(): Project[] {
  return readdirSync(path.join(CONTENT_DIR, 'projects'))
    .filter((file) => file.endsWith('.json'))
    .map((file) => {
      const slug = file.replace(/\.json$/, '');
      if (!SLUG.test(slug)) {
        throw new Error(
          `Nom de fichier de projet invalide : ${file} (minuscules, chiffres et tirets)`,
        );
      }
      return { ...load(projectSchema, `projects/${file}`), slug };
    })
    .filter((project) => project.published)
    .sort((a, b) => a.order - b.order);
}

export function getProject(slug: string): Project | undefined {
  return getProjects().find((project) => project.slug === slug);
}

/** Projets disposant d'une étude de cas (et donc d'une page dédiée). */
export function getCaseStudies(): Project[] {
  return getProjects().filter((project) => project.body !== undefined);
}
