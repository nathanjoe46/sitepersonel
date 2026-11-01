import { Section } from '@/components/ui/section';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Company, Education, Profile } from '@/lib/schema';

interface AboutProps {
  locale: Locale;
  dict: Dictionary;
  profile: Profile;
  company: Company;
  education: Education;
}

export function About({ locale, dict, profile, company, education }: AboutProps) {
  const degree = education.degrees[0];
  const facts = [
    { term: dict.glance.location, details: [profile.location[locale]] },
    { term: dict.glance.company, details: [`${company.name} — ${company.role[locale]}`] },
    ...(degree
      ? [{ term: dict.glance.education, details: [`${degree.title[locale]} — ${degree.school}`] }]
      : []),
    { term: dict.glance.languages, details: profile.languages.map((l) => l[locale]) },
  ];

  return (
    <Section id="about" title={dict.sections.about}>
      <div className="grid gap-12 xl:grid-cols-[1fr_17rem]">
        <div className="max-w-2xl space-y-5 text-lg leading-relaxed">
          {profile.about.map((paragraph, index) => (
            <p key={index} className={index === 0 ? undefined : 'text-muted'}>
              {paragraph[locale]}
            </p>
          ))}
        </div>
        <div>
          <h3 className="sr-only">{dict.sections.atAGlance}</h3>
          <dl className="space-y-5 text-sm">
            {facts.map((fact) => (
              <div key={fact.term}>
                <dt className="font-mono text-xs text-muted">{fact.term}</dt>
                {fact.details.map((detail) => (
                  <dd key={detail} className="mt-1">
                    {detail}
                  </dd>
                ))}
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Section>
  );
}
