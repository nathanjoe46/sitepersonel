import type { Locale } from '@/i18n/config';

/** Formate "2024" ou "2024-08" en "2024" / "août 2024" / "Aug 2024". */
export function formatYearMonth(value: string, locale: Locale): string {
  const [year, month] = value.split('-');
  if (!month) return year ?? value;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, 1));
  return new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : 'en-GB', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

/** Période "début – fin" ; renvoie undefined si aucune date n'est connue. */
export function formatPeriod(
  start: string | undefined,
  end: string | undefined,
  locale: Locale,
  labels: { present: string; ongoing: string },
): string | undefined {
  const endLabel = end === 'present' ? labels.present : end && formatYearMonth(end, locale);
  if (!start) return end === 'present' ? labels.ongoing : endLabel;
  const startLabel = formatYearMonth(start, locale);
  if (!endLabel || endLabel === startLabel) return startLabel;
  return `${startLabel} – ${endLabel}`;
}
