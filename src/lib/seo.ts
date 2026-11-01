import type { Metadata } from 'next';

import { localeLabels, locales, type Locale } from '@/i18n/config';

import { absoluteUrl } from './site';

interface PageMetadataInput {
  locale: Locale;
  /** Chemin après la langue, ex. "/" ou "/projects/jl-express/". */
  path: string;
  title: string;
  description: string;
  /** Titre complet (sans le gabarit « — Jonathan Dort »). */
  absoluteTitle?: boolean;
  type?: 'website' | 'profile' | 'article';
}

export function pageMetadata({
  locale,
  path,
  title,
  description,
  absoluteTitle = false,
  type = 'website',
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(`/${locale}${path}`);
  const languages = Object.fromEntries(
    locales.map((l) => [localeLabels[l].htmlLang, absoluteUrl(`/${l}${path}`)]),
  );
  const image = absoluteUrl(`/og/${locale}.png`);

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: url,
      languages: { ...languages, 'x-default': absoluteUrl(`/fr${path}`) },
    },
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: 'Jonathan Alix Pierre Dort',
      locale: localeLabels[locale].og,
      alternateLocale: locales.filter((l) => l !== locale).map((l) => localeLabels[l].og),
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}
