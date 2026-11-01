import { z } from 'zod';

/*
 * Schémas du contenu éditorial (/content).
 * Chaque build valide les fichiers JSON : une saisie invalide dans l'admin
 * fait échouer le déploiement au lieu de casser le site en ligne.
 */

const text = z.string().trim().min(1);

/** Texte traduit : les deux langues sont obligatoires. */
export const localized = z.object({ fr: text, en: text }).strict();

/** Vrai si la valeur est vide : "", null, ou un objet dont tous les champs sont vides. */
function isBlank(value: unknown): boolean {
  if (value === undefined || value === null) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return false;
  if (typeof value === 'object') return Object.values(value).every(isBlank);
  return false;
}

/**
 * Champ facultatif : l'admin enregistre parfois "" ou un objet aux champs vides
 * pour un champ non rempli ; on les traite comme absents.
 */
function opt<S extends z.ZodType>(schema: S) {
  return z.preprocess((value) => (isBlank(value) ? undefined : value), schema.optional());
}

/** Texte traduit facultatif : les deux langues, ou aucune. */
const optionalLocalized = opt(localized);

const localizedList = z.array(localized);

/** Chemin vers un fichier de /public, ex. "/images/source/photo.jpg". */
const publicPath = z.string().regex(/^\/[\w\-./]+$/, 'Chemin attendu : /dossier/fichier.ext');

/** Année ou année-mois : "2024" ou "2024-08". */
const yearMonth = z
  .string()
  .regex(/^\d{4}(-(0[1-9]|1[0-2]))?$/, 'Format attendu : AAAA ou AAAA-MM');

const httpUrl = z.url({ protocol: /^https?$/ });
const optionalUrl = opt(httpUrl);

export const imageSchema = z
  .object({
    src: publicPath,
    alt: localized,
  })
  .strict();

export const profileSchema = z
  .object({
    name: text,
    shortName: text,
    role: localized,
    headline: localized,
    intro: localized,
    location: localized,
    availability: localized,
    photo: imageSchema,
    about: localizedList.min(1),
    languages: localizedList,
    cv: z.object({ fr: publicPath, en: opt(publicPath) }).strict(),
  })
  .strict();

export const contactSchema = z
  .object({
    email: z.email(),
    whatsapp: opt(
      z.string().regex(/^\d{8,15}$/, 'Numéro international sans + ni espaces, ex. 50939272712'),
    ),
    phoneDisplay: opt(text),
    message: localized,
    links: z.array(z.object({ label: text, url: httpUrl }).strict()),
  })
  .strict();

export const skillsSchema = z
  .object({
    groups: z
      .array(
        z
          .object({
            title: localized,
            items: z.object({ fr: z.array(text).min(1), en: z.array(text).min(1) }).strict(),
          })
          .strict(),
      )
      .min(1),
  })
  .strict();

export const experienceSchema = z
  .object({
    items: z
      .array(
        z
          .object({
            role: localized,
            organization: localized,
            location: optionalLocalized,
            start: opt(yearMonth),
            end: opt(z.union([yearMonth, z.literal('present')])),
            highlights: localizedList,
            stack: z.array(text).default([]),
          })
          .strict(),
      )
      .min(1),
  })
  .strict();

export const educationSchema = z
  .object({
    degrees: z
      .array(
        z
          .object({
            title: localized,
            school: text,
            location: optionalLocalized,
            start: yearMonth,
            end: yearMonth,
            note: optionalLocalized,
          })
          .strict(),
      )
      .min(1),
    certifications: z
      .array(
        z
          .object({
            title: localized,
            issuer: opt(text),
            date: yearMonth,
          })
          .strict(),
      )
      .default([]),
  })
  .strict();

export const companySchema = z
  .object({
    name: text,
    role: localized,
    description: localized,
    services: localizedList,
    url: optionalUrl,
  })
  .strict();

export const publicSectorSchema = z
  .object({
    title: localized,
    intro: localized,
    areas: z.array(z.object({ title: localized, description: localized }).strict()).min(1),
    involved: localizedList,
    note: localized,
  })
  .strict();

export const teachingSchema = z
  .object({
    intro: localized,
    topics: localizedList,
    links: z.array(z.object({ label: localized, url: httpUrl }).strict()).default([]),
  })
  .strict();

export const projectStatuses = ['production', 'development', 'maintained', 'archived'] as const;

export const projectSchema = z
  .object({
    title: text,
    order: z.number().int().min(0),
    published: z.boolean().default(true),
    featured: z.boolean().default(false),
    summary: localized,
    role: optionalLocalized,
    start: opt(yearMonth),
    end: opt(z.union([yearMonth, z.literal('present')])),
    status: opt(z.enum(projectStatuses)),
    stack: z.array(text).default([]),
    links: z
      .object({ live: optionalUrl, repo: optionalUrl })
      .strict()
      .default({ live: undefined, repo: undefined }),
    cover: opt(imageSchema),
    gallery: z.array(imageSchema).default([]),
    /** Étude de cas en Markdown. Si vide, le projet n'a pas de page dédiée. */
    body: optionalLocalized,
  })
  .strict();

export type Profile = z.output<typeof profileSchema>;
export type Contact = z.output<typeof contactSchema>;
export type Skills = z.output<typeof skillsSchema>;
export type Experience = z.output<typeof experienceSchema>;
export type ExperienceItem = Experience['items'][number];
export type Education = z.output<typeof educationSchema>;
export type Company = z.output<typeof companySchema>;
export type PublicSector = z.output<typeof publicSectorSchema>;
export type Teaching = z.output<typeof teachingSchema>;
export type Project = z.output<typeof projectSchema> & { slug: string };
export type ImageRef = z.output<typeof imageSchema>;
