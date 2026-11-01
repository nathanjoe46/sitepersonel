import type { Locale } from './config';

/**
 * Libellés de l'interface (navigation, boutons, titres de sections).
 * Le contenu éditorial (profil, projets, parcours…) vit dans /content
 * et se modifie depuis l'admin.
 */
const fr = {
  meta: {
    skipToContent: 'Aller au contenu',
    home: 'Accueil',
  },
  nav: {
    label: 'Navigation principale',
    about: 'À propos',
    projects: 'Projets',
    experience: 'Parcours',
    contact: 'Contact',
    openMenu: 'Ouvrir le menu',
    closeMenu: 'Fermer le menu',
  },
  theme: {
    toLight: 'Passer au thème clair',
    toDark: 'Passer au thème sombre',
  },
  locale: {
    switchTo: 'Read this page in English',
  },
  hero: {
    viewProjects: 'Voir les projets',
    downloadCv: 'Télécharger le CV',
    contact: 'Me contacter',
  },
  sections: {
    about: 'À propos',
    atAGlance: 'En bref',
    expertise: 'Expertise',
    projects: 'Projets',
    featuredProject: 'Projet phare',
    otherProjects: 'Autres produits',
    publicSector: 'Secteur public',
    company: 'Entreprise',
    experience: 'Parcours',
    education: 'Formation',
    certifications: 'Certifications',
    languages: 'Langues',
    teaching: 'Éducation numérique',
    contact: 'Contact',
  },
  glance: {
    location: 'Basé à',
    company: 'Entreprise',
    education: 'Formation',
    languages: 'Langues',
  },
  project: {
    role: 'Rôle',
    period: 'Période',
    stack: 'Technologies',
    status: 'Statut',
    links: 'Liens',
    readCaseStudy: 'Lire l’étude de cas',
    backToProjects: 'Retour aux projets',
    liveSite: 'Voir le site',
    sourceCode: 'Code source',
    screenshots: 'Captures d’écran',
    statuses: {
      production: 'En production',
      development: 'En développement',
      maintained: 'Maintenu',
      archived: 'Archivé',
    },
  },
  publicSector: {
    involved: 'Ce que ce travail implique',
  },
  experience: {
    present: 'aujourd’hui',
    ongoing: 'En cours',
  },
  contact: {
    email: 'Écrire un email',
    whatsapp: 'WhatsApp',
    elsewhere: 'Ailleurs',
  },
  footer: {
    builtWith: 'Conçu et développé avec Next.js, TypeScript et Tailwind CSS.',
    source: 'Code source',
    rights: 'Tous droits réservés.',
  },
  notFound: {
    title: 'Page introuvable',
    body: 'La page demandée n’existe pas ou a été déplacée.',
    back: 'Retour à l’accueil',
  },
};

export type Dictionary = typeof fr;

const en = {
  meta: {
    skipToContent: 'Skip to content',
    home: 'Home',
  },
  nav: {
    label: 'Main navigation',
    about: 'About',
    projects: 'Projects',
    experience: 'Experience',
    contact: 'Contact',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
  },
  theme: {
    toLight: 'Switch to light theme',
    toDark: 'Switch to dark theme',
  },
  locale: {
    switchTo: 'Lire cette page en français',
  },
  hero: {
    viewProjects: 'View projects',
    downloadCv: 'Download résumé',
    contact: 'Get in touch',
  },
  sections: {
    about: 'About',
    atAGlance: 'At a glance',
    expertise: 'Expertise',
    projects: 'Projects',
    featuredProject: 'Featured project',
    otherProjects: 'Other products',
    publicSector: 'Public sector',
    company: 'Company',
    experience: 'Experience',
    education: 'Education',
    certifications: 'Certifications',
    languages: 'Languages',
    teaching: 'Digital education',
    contact: 'Contact',
  },
  glance: {
    location: 'Based in',
    company: 'Company',
    education: 'Education',
    languages: 'Languages',
  },
  project: {
    role: 'Role',
    period: 'Period',
    stack: 'Technologies',
    status: 'Status',
    links: 'Links',
    readCaseStudy: 'Read the case study',
    backToProjects: 'Back to projects',
    liveSite: 'Visit site',
    sourceCode: 'Source code',
    screenshots: 'Screenshots',
    statuses: {
      production: 'In production',
      development: 'In development',
      maintained: 'Maintained',
      archived: 'Archived',
    },
  },
  publicSector: {
    involved: 'What this work involves',
  },
  experience: {
    present: 'present',
    ongoing: 'Ongoing',
  },
  contact: {
    email: 'Send an email',
    whatsapp: 'WhatsApp',
    elsewhere: 'Elsewhere',
  },
  footer: {
    builtWith: 'Designed and built with Next.js, TypeScript and Tailwind CSS.',
    source: 'Source code',
    rights: 'All rights reserved.',
  },
  notFound: {
    title: 'Page not found',
    body: 'The page you are looking for does not exist or has moved.',
    back: 'Back to home',
  },
} satisfies Dictionary;

const dictionaries: Record<Locale, Dictionary> = { fr, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
