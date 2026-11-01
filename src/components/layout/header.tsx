import Link from 'next/link';

import { Container } from '@/components/ui/container';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';

import { LocaleSwitcher } from './locale-switcher';
import { MobileNav } from './mobile-nav';
import { ThemeToggle } from './theme-toggle';

interface HeaderProps {
  locale: Locale;
  dict: Dictionary;
  name: string;
}

export function Header({ locale, dict, name }: HeaderProps) {
  const items = [
    { href: `/${locale}/#about`, label: dict.nav.about },
    { href: `/${locale}/#projects`, label: dict.nav.projects },
    { href: `/${locale}/#experience`, label: dict.nav.experience },
    { href: `/${locale}/#contact`, label: dict.nav.contact },
  ];
  const otherLocale: Locale = locale === 'fr' ? 'en' : 'fr';

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg">
      <Container className="relative flex h-16 items-center justify-between gap-4">
        <Link href={`/${locale}/`} className="text-[0.95rem] font-semibold tracking-tight">
          {name}
        </Link>
        <div className="flex items-center gap-1">
          <nav aria-label={dict.nav.label} className="hidden md:block">
            <ul className="mr-3 flex items-center gap-6 text-sm text-muted">
              {items.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition-colors hover:text-fg">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <LocaleSwitcher current={locale} target={otherLocale} label={dict.locale.switchTo} />
          <ThemeToggle labels={dict.theme} />
          <MobileNav
            items={items}
            labels={{ open: dict.nav.openMenu, close: dict.nav.closeMenu, nav: dict.nav.label }}
          />
        </div>
      </Container>
    </header>
  );
}
