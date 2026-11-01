import { Section } from '@/components/ui/section';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import { formatPeriod, formatYearMonth } from '@/lib/format';
import type { Education as EducationContent } from '@/lib/schema';

interface EducationProps {
  locale: Locale;
  dict: Dictionary;
  education: EducationContent;
}

export function Education({ locale, dict, education }: EducationProps) {
  return (
    <Section id="education" title={dict.sections.education}>
      <ul className="space-y-6">
        {education.degrees.map((degree) => (
          <li key={degree.title.fr} className="grid gap-2 sm:grid-cols-[9.5rem_1fr] sm:gap-8">
            <p className="font-mono text-xs text-muted sm:pt-1">
              {formatPeriod(degree.start, degree.end, locale, dict.experience)}
            </p>
            <div>
              <h3 className="font-semibold">{degree.title[locale]}</h3>
              <p className="mt-0.5 text-muted">
                {degree.school}
                {degree.location && <span> · {degree.location[locale]}</span>}
              </p>
              {degree.note && <p className="mt-1 text-sm text-muted">{degree.note[locale]}</p>}
            </div>
          </li>
        ))}
      </ul>

      {education.certifications.length > 0 && (
        <>
          <h3 className="mt-12 font-mono text-xs text-muted">{dict.sections.certifications}</h3>
          <ul className="mt-4 divide-y divide-border border-y border-border text-[0.95rem]">
            {education.certifications.map((cert) => (
              <li
                key={cert.title.fr}
                className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3"
              >
                <span>
                  {cert.title[locale]}
                  {cert.issuer && <span className="text-muted"> — {cert.issuer}</span>}
                </span>
                <span className="font-mono text-xs text-muted">
                  {formatYearMonth(cert.date, locale)}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </Section>
  );
}
