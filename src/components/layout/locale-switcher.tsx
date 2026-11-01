'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { localeLabels, type Locale } from '@/i18n/config';

interface LocaleSwitcherProps {
  current: Locale;
  target: Locale;
  label: string;
}

/** Lien vers la même page dans l'autre langue. */
export function LocaleSwitcher({ current, target, label }: LocaleSwitcherProps) {
  const pathname = usePathname();
  const href = pathname.replace(new RegExp(`^/${current}(?=/|$)`), `/${target}`) || `/${target}/`;

  return (
    <Link
      href={href}
      hrefLang={localeLabels[target].htmlLang}
      lang={localeLabels[target].htmlLang}
      title={label}
      className="inline-flex size-11 items-center justify-center rounded-md font-mono text-xs font-medium text-muted transition-colors hover:text-fg"
    >
      {localeLabels[target].short}
      {/* Le texte visible (« EN ») fait partie du nom accessible (WCAG 2.5.3). */}
      <span className="sr-only"> — {label}</span>
    </Link>
  );
}
