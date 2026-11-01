import Link from 'next/link';

import { ArrowRight } from '@/components/ui/icons';
import { Picture } from '@/components/ui/picture';
import { Section } from '@/components/ui/section';
import { TagList } from '@/components/ui/tag-list';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import { formatPeriod } from '@/lib/format';
import type { Project } from '@/lib/schema';

interface ProjectsProps {
  locale: Locale;
  dict: Dictionary;
  projects: Project[];
}

export function projectMeta(project: Project, locale: Locale, dict: Dictionary): string[] {
  return [
    project.role?.[locale],
    formatPeriod(project.start, project.end, locale, dict.experience),
    project.status && dict.project.statuses[project.status],
  ].filter((value): value is string => Boolean(value));
}

export function Projects({ locale, dict, projects }: ProjectsProps) {
  const featured = projects.filter((p) => p.featured);
  const others = projects.filter((p) => !p.featured);

  return (
    <Section id="projects" title={dict.sections.projects}>
      <div className="space-y-16">
        {featured.map((project) => {
          const href = project.body ? `/${locale}/projects/${project.slug}/` : undefined;
          return (
            <article key={project.slug} aria-labelledby={`project-${project.slug}`}>
              {project.cover && (
                <div className="overflow-hidden rounded-lg border border-border">
                  <Picture
                    src={project.cover.src}
                    alt={project.cover.alt[locale]}
                    sizes="(min-width: 1024px) 46rem, 100vw"
                    className="w-full"
                  />
                </div>
              )}
              <p className="mt-6 font-mono text-xs text-muted">{dict.sections.featuredProject}</p>
              <h3
                id={`project-${project.slug}`}
                className="mt-2 text-2xl font-semibold tracking-tight"
              >
                {project.title}
              </h3>
              <p className="mt-2 text-sm text-muted">
                {projectMeta(project, locale, dict).join(' · ')}
              </p>
              <p className="mt-4 max-w-2xl leading-relaxed">{project.summary[locale]}</p>
              <TagList items={project.stack} label={dict.project.stack} className="mt-4" />
              {href && (
                <Link
                  href={href}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent underline-offset-4 hover:underline"
                >
                  {dict.project.readCaseStudy}
                  <span className="sr-only"> : {project.title}</span>
                  <ArrowRight />
                </Link>
              )}
            </article>
          );
        })}

        {others.length > 0 && (
          <div>
            <h3 className="font-mono text-xs text-muted">{dict.sections.otherProjects}</h3>
            <ul className="mt-4 divide-y divide-border border-y border-border">
              {others.map((project) => (
                <li
                  key={project.slug}
                  className="grid gap-1 py-5 sm:grid-cols-[14rem_1fr] sm:gap-6"
                >
                  <p className="font-medium">
                    {project.body ? (
                      <Link
                        href={`/${locale}/projects/${project.slug}/`}
                        className="underline decoration-border underline-offset-4 hover:decoration-fg"
                      >
                        {project.title}
                      </Link>
                    ) : (
                      project.title
                    )}
                  </p>
                  <div>
                    <p className="text-muted">{project.summary[locale]}</p>
                    <TagList items={project.stack} label={dict.project.stack} className="mt-2" />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Section>
  );
}
