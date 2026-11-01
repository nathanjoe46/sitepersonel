export const locales = ['fr', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'fr';

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Valeur traduite dans chaque langue du site. */
export type Localized<T = string> = Record<Locale, T>;

export const localeLabels: Record<
  Locale,
  { short: string; long: string; htmlLang: string; og: string }
> = {
  fr: { short: 'FR', long: 'Français', htmlLang: 'fr', og: 'fr_FR' },
  en: { short: 'EN', long: 'English', htmlLang: 'en', og: 'en_US' },
};
