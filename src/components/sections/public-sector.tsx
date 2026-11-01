import { Section } from '@/components/ui/section';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import type { PublicSector as PublicSectorContent } from '@/lib/schema';

interface PublicSectorProps {
  locale: Locale;
  dict: Dictionary;
  content: PublicSectorContent;
}

export function PublicSector({ locale, dict, content }: PublicSectorProps) {
  return (
    <Section id="public-sector" title={dict.sections.publicSector}>
      <h3 className="text-2xl font-semibold tracking-tight text-balance">
        {content.title[locale]}
      </h3>
      <p className="mt-4 max-w-2xl leading-relaxed text-muted">{content.intro[locale]}</p>

      <ul className="mt-10 grid gap-x-10 gap-y-7 sm:grid-cols-2">
        {content.areas.map((area) => (
          <li key={area.title.fr}>
            <p className="font-medium">{area.title[locale]}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">{area.description[locale]}</p>
          </li>
        ))}
      </ul>

      <h4 className="mt-12 font-mono text-xs text-muted">{dict.publicSector.involved}</h4>
      <ul className="mt-4 space-y-2">
        {content.involved.map((item) => (
          <li key={item.fr} className="flex gap-3">
            <span aria-hidden="true" className="text-muted">
              —
            </span>
            {item[locale]}
          </li>
        ))}
      </ul>

      <p className="mt-10 max-w-2xl border-l-2 border-border pl-4 text-sm leading-relaxed text-muted">
        {content.note[locale]}
      </p>
    </Section>
  );
}
