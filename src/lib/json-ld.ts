import type { Locale } from '@/i18n/config';

import type { Contact, Education, Profile, Skills } from './schema';
import { absoluteUrl } from './site';

/** Données structurées schema.org de la page d'accueil (Person + ProfilePage). */
export function personJsonLd(
  locale: Locale,
  profile: Profile,
  contact: Contact,
  skills: Skills,
  education: Education,
  companyName: string,
) {
  const person = {
    '@type': 'Person',
    '@id': absoluteUrl('/#person'),
    name: profile.name,
    jobTitle: profile.role[locale],
    description: profile.headline[locale],
    url: absoluteUrl(`/${locale}/`),
    image: absoluteUrl(profile.photo.src),
    email: `mailto:${contact.email}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Port-au-Prince',
      addressCountry: 'HT',
    },
    sameAs: contact.links.map((link) => link.url),
    worksFor: { '@type': 'Organization', name: companyName },
    alumniOf: education.degrees.map((degree) => ({
      '@type': 'CollegeOrUniversity',
      name: degree.school,
    })),
    knowsAbout: skills.groups.slice(0, 3).flatMap((group) => group.items[locale]),
    knowsLanguage: ['ht', 'fr', 'en'],
  };

  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    inLanguage: locale,
    url: absoluteUrl(`/${locale}/`),
    mainEntity: person,
  };
}

/** Sérialise le JSON-LD sans permettre de fermer la balise <script>. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
