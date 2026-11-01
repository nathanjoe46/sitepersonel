import type { Metadata } from 'next';

import { About } from '@/components/sections/about';
import { Company } from '@/components/sections/company';
import { Contact } from '@/components/sections/contact';
import { Education } from '@/components/sections/education';
import { Experience } from '@/components/sections/experience';
import { Expertise } from '@/components/sections/expertise';
import { Hero } from '@/components/sections/hero';
import { Projects } from '@/components/sections/projects';
import { PublicSector } from '@/components/sections/public-sector';
import { Teaching } from '@/components/sections/teaching';
import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import {
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
import { personJsonLd, serializeJsonLd } from '@/lib/json-ld';
import { pageMetadata } from '@/lib/seo';

async function resolveLocale(params: PageProps<'/[locale]'>['params']): Promise<Locale> {
  const { locale } = await params;
  if (!isLocale(locale)) throw new Error(`Langue inconnue : ${locale}`);
  return locale;
}

export async function generateMetadata({ params }: PageProps<'/[locale]'>): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const profile = getProfile();
  return pageMetadata({
    locale,
    path: '/',
    title: `${profile.name} — ${profile.role[locale]}`,
    description: `${profile.headline[locale]} ${profile.location[locale]}.`,
    absoluteTitle: true,
    type: 'profile',
  });
}

export default async function HomePage({ params }: PageProps<'/[locale]'>) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const profile = getProfile();
  const contact = getContact();
  const skills = getSkills();
  const education = getEducation();
  const company = getCompany();

  return (
    <>
      <script
        type="application/ld+json"
        // Données structurées pour les moteurs de recherche (échappées).
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(
            personJsonLd(locale, profile, contact, skills, education, company.name),
          ),
        }}
      />
      <Hero locale={locale} dict={dict} profile={profile} />
      <About
        locale={locale}
        dict={dict}
        profile={profile}
        company={company}
        education={education}
      />
      <Projects locale={locale} dict={dict} projects={getProjects()} />
      <PublicSector locale={locale} dict={dict} content={getPublicSector()} />
      <Expertise locale={locale} dict={dict} skills={skills} />
      <Experience locale={locale} dict={dict} experience={getExperience()} />
      <Company locale={locale} dict={dict} company={company} />
      <Education locale={locale} dict={dict} education={education} />
      <Teaching locale={locale} dict={dict} teaching={getTeaching()} />
      <Contact locale={locale} dict={dict} contact={contact} />
    </>
  );
}
