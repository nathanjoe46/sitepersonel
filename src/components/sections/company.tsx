import { Section } from '@/components/ui/section';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Company as CompanyContent } from '@/lib/schema';

interface CompanyProps {
  locale: Locale;
  dict: Dictionary;
  company: CompanyContent;
}

export function Company({ locale, dict, company }: CompanyProps) {
  return (
    <Section id="company" title={dict.sections.company}>
      <h3 className="text-2xl font-semibold tracking-tight">
        {company.url ? (
          <a
            href={company.url}
            className="underline decoration-border underline-offset-4 hover:decoration-fg"
          >
            {company.name}
          </a>
        ) : (
          company.name
        )}
      </h3>
      <p className="mt-1 text-sm text-muted">{company.role[locale]}</p>
      <p className="mt-4 max-w-2xl leading-relaxed text-muted">{company.description[locale]}</p>
      <ul className="mt-6 space-y-2">
        {company.services.map((service) => (
          <li key={service.fr} className="flex gap-3">
            <span aria-hidden="true" className="text-muted">
              —
            </span>
            {service[locale]}
          </li>
        ))}
      </ul>
    </Section>
  );
}
