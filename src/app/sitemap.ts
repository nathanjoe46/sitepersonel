import type { MetadataRoute } from 'next';

import { localeLabels, locales } from '@/i18n/config';
import { getCaseStudies } from '@/lib/content';
import { absoluteUrl } from '@/lib/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['/', ...getCaseStudies().map((p) => `/projects/${p.slug}/`)];
  const lastModified = new Date();

  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: absoluteUrl(`/${locale}${path}`),
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: path === '/' ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [localeLabels[l].htmlLang, absoluteUrl(`/${l}${path}`)]),
        ),
      },
    })),
  );
}
