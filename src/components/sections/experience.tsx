import { Section } from '@/components/ui/section';
import { TagList } from '@/components/ui/tag-list';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import { formatPeriod } from '@/lib/format';
import type { Experience as ExperienceContent } from '@/lib/schema';

interface ExperienceProps {
  locale: Locale;
  dict: Dictionary;
  experience: ExperienceContent;
}

export function Experience({ locale, dict, experience }: ExperienceProps) {
  return (
    <Section id="experience" title={dict.sections.experience}>
      <ol className="space-y-12">
        {experience.items.map((item) => (
          <li
            key={`${item.organization.fr}-${item.role.fr}`}
            className="grid gap-2 sm:grid-cols-[9.5rem_1fr] sm:gap-8"
          >
            <p className="font-mono text-xs text-muted sm:pt-1">
              {formatPeriod(item.start, item.end, locale, dict.experience)}
            </p>
            <div>
              <h3 className="font-semibold">{item.role[locale]}</h3>
              <p className="mt-0.5 text-muted">
                {item.organization[locale]}
                {item.location && <span> · {item.location[locale]}</span>}
              </p>
              <ul className="mt-3 space-y-1.5 text-[0.95rem] leading-relaxed text-muted">
                {item.highlights.map((highlight) => (
                  <li key={highlight.fr} className="flex gap-3">
                    <span aria-hidden="true">—</span>
                    <span>{highlight[locale]}</span>
                  </li>
                ))}
              </ul>
              {item.stack.length > 0 && (
                <TagList items={item.stack} label={dict.project.stack} className="mt-3" />
              )}
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
