import '@/styles/globals.css';

import type { Metadata } from 'next';
import Link from 'next/link';
import { ThemeProvider } from 'next-themes';

import { getDictionary } from '@/i18n/dictionaries';
import { mono, sans } from '@/styles/fonts';

export const metadata: Metadata = {
  title: 'Page introuvable · Page not found',
  robots: { index: false },
};

const fr = getDictionary('fr');
const en = getDictionary('en');

/** 404 bilingue : la langue de l'URL demandée n'est pas connue à ce stade. */
export default function GlobalNotFound() {
  return (
    <html lang="fr" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center gap-10 px-5 py-16">
            <p className="font-mono text-xs text-muted">404</p>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">{fr.notFound.title}</h1>
              <p className="mt-3 text-muted">{fr.notFound.body}</p>
              <Link
                href="/fr/"
                className="mt-5 inline-flex min-h-11 items-center text-accent underline-offset-4 hover:underline"
              >
                {fr.notFound.back}
              </Link>
            </div>
            <div lang="en">
              <h2 className="text-3xl font-semibold tracking-tight">{en.notFound.title}</h2>
              <p className="mt-3 text-muted">{en.notFound.body}</p>
              <Link
                href="/en/"
                className="mt-5 inline-flex min-h-11 items-center text-accent underline-offset-4 hover:underline"
              >
                {en.notFound.back}
              </Link>
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
