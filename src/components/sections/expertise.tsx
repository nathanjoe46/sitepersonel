import { Section } from '@/components/ui/section';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Skills } from '@/lib/schema';

interface ExpertiseProps {
  locale: Locale;
  dict: Dictionary;
  skills: Skills;
}

export function Expertise({ locale, dict, skills }: ExpertiseProps) {
  return (
    <Section id="expertise" title={dict.sections.expertise}>
      <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
        {skills.groups.map((group) => (
          <div key={group.title.fr}>
            <dt className="font-medium">{group.title[locale]}</dt>
            <dd className="mt-2 leading-relaxed text-muted">{group.items[locale].join(' · ')}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
