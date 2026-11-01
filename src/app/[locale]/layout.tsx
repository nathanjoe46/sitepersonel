import '@/styles/globals.css';

import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { ThemeProvider } from 'next-themes';

import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { SkipLink } from '@/components/layout/skip-link';
import { isLocale, localeLabels, locales } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { mono, sans } from '@/styles/fonts';
import { getProfile } from '@/lib/content';
import { siteUrl } from '@/lib/site';

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const profile = getProfile();
  return {
    metadataBase: new URL(`${siteUrl}/`),
    title: { default: profile.name, template: `%s — ${profile.shortName}` },
    description: profile.headline[locale],
    authors: [{ name: profile.name }],
    creator: profile.name,
    formatDetection: { telephone: false, email: false, address: false },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fbfbf9' },
    { media: '(prefers-color-scheme: dark)', color: '#111113' },
  ],
};

export default async function LocaleLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const profile = getProfile();

  return (
    <html
      lang={localeLabels[locale].htmlLang}
      className={`${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-dvh flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SkipLink label={dict.meta.skipToContent} />
          <Header locale={locale} dict={dict} name={profile.shortName} />
          <main id="main" tabIndex={-1} className="flex-1 outline-none">
            {children}
          </main>
          <Footer dict={dict} name={profile.name} />
        </ThemeProvider>
      </body>
    </html>
  );
}
