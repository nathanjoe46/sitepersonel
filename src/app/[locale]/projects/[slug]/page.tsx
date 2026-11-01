import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { projectMeta } from '@/components/sections/projects';
import { Container } from '@/components/ui/container';
import { ArrowLeft, ArrowUpRight } from '@/components/ui/icons';
import { Picture } from '@/components/ui/picture';
import { TagList } from '@/components/ui/tag-list';
import { isLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { getCaseStudies, getProject } from '@/lib/content';
import { renderMarkdown } from '@/lib/markdown';
import { pageMetadata } from '@/lib/seo';

export const dynamicParams = false;

export function generateStaticParams() {
  return getCaseStudies().map((project) => ({ slug: project.slug }));
}

async function load(params: PageProps<'/[locale]/projects/[slug]'>['params']) {
  const { locale, slug } = await params;
  const project = getProject(slug);
  if (!isLocale(locale) || !project?.body) notFound();
  return { locale, project, body: project.body };
}

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/projects/[slug]'>): Promise<Metadata> {
  const { locale, project } = await load(params);
  return pageMetadata({
    locale,
    path: `/projects/${project.slug}/`,
    title: project.title,
    description: project.summary[locale],
    type: 'article',
  });
}

export default async function ProjectPage({ params }: PageProps<'/[locale]/projects/[slug]'>) {
  const { locale, project, body } = await load(params);
  const dict = getDictionary(locale);
  const meta = projectMeta(project, locale, dict);

  return (
    <article>
      <Container className="max-w-3xl pt-10 pb-20 sm:pt-14">
        <Link
          href={`/${locale}/#projects`}
          className="inline-flex min-h-11 items-center gap-2 text-sm text-muted hover:text-fg"
        >
          <ArrowLeft />
          {dict.project.backToProjects}
        </Link>

        <header className="mt-8">
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            {project.title}
          </h1>
          <p className="mt-5 text-xl leading-snug text-balance">{project.summary[locale]}</p>
          {meta.length > 0 && <p className="mt-4 text-sm text-muted">{meta.join(' · ')}</p>}
          <TagList items={project.stack} label={dict.project.stack} className="mt-4" />
          {(project.links.live ?? project.links.repo) && (
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {project.links.live && (
                <li>
                  <a
                    href={project.links.live}
                    className="inline-flex items-center gap-1 text-accent underline-offset-4 hover:underline"
                  >
                    {dict.project.liveSite}
                    <ArrowUpRight />
                  </a>
                </li>
              )}
              {project.links.repo && (
                <li>
                  <a
                    href={project.links.repo}
                    className="inline-flex items-center gap-1 text-accent underline-offset-4 hover:underline"
                  >
                    {dict.project.sourceCode}
                    <ArrowUpRight />
                  </a>
                </li>
              )}
            </ul>
          )}
        </header>

        {project.cover && (
          <div className="mt-10 overflow-hidden rounded-lg border border-border">
            <Picture
              src={project.cover.src}
              alt={project.cover.alt[locale]}
              sizes="(min-width: 768px) 46rem, 100vw"
              priority
              className="w-full"
            />
          </div>
        )}

        <div
          className="prose-content mt-12"
          // Markdown du dépôt converti au build (voir src/lib/markdown.ts).
          dangerouslySetInnerHTML={{ __html: renderMarkdown(body[locale]) }}
        />

        {project.gallery.length > 0 && (
          <section aria-labelledby="gallery-title" className="mt-16">
            <h2 id="gallery-title" className="font-mono text-xs text-muted">
              {dict.project.screenshots}
            </h2>
            <div className="mt-4 space-y-8">
              {project.gallery.map((image) => (
                <figure key={image.src}>
                  <div className="overflow-hidden rounded-lg border border-border">
                    <Picture
                      src={image.src}
                      alt={image.alt[locale]}
                      sizes="(min-width: 768px) 46rem, 100vw"
                      className="w-full"
                    />
                  </div>
                  <figcaption className="mt-3 text-sm text-muted">{image.alt[locale]}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}
      </Container>
    </article>
  );
}
