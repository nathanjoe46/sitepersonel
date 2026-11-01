import { ArrowUpRight } from '@/components/ui/icons';
import { Section } from '@/components/ui/section';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Teaching as TeachingContent } from '@/lib/schema';

interface TeachingProps {
  locale: Locale;
  dict: Dictionary;
  teaching: TeachingContent;
}

export function Teaching({ locale, dict, teaching }: TeachingProps) {
  return (
    <Section id="teaching" title={dict.sections.teaching}>
      <p className="max-w-2xl text-lg leading-relaxed">{teaching.intro[locale]}</p>
      <ul className="mt-6 space-y-2">
        {teaching.topics.map((topic) => (
          <li key={topic.fr} className="flex gap-3 text-muted">
            <span aria-hidden="true">—</span>
            {topic[locale]}
          </li>
        ))}
      </ul>
      {teaching.links.length > 0 && (
        <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {teaching.links.map((link) => (
            <li key={link.url}>
              <a
                href={link.url}
                className="inline-flex items-center gap-1 text-accent underline-offset-4 hover:underline"
              >
                {link.label[locale]}
                <ArrowUpRight />
              </a>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
