import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

import { Container } from './container';

interface SectionProps {
  id: string;
  title: string;
  children: ReactNode;
  className?: string;
}

/**
 * Section éditoriale : titre dans une colonne étroite à gauche (grand écran),
 * contenu à droite. Le titre est relié à la section pour les lecteurs d'écran.
 */
export function Section({ id, title, children, className }: SectionProps) {
  const headingId = `${id}-title`;
  return (
    <section id={id} aria-labelledby={headingId} className={cn('scroll-mt-20', className)}>
      <Container>
        <div className="grid gap-6 border-t border-border py-14 sm:py-20 lg:grid-cols-[11rem_1fr] lg:gap-12">
          <h2
            id={headingId}
            className="font-mono text-xs font-medium tracking-[0.12em] text-muted uppercase lg:pt-1.5"
          >
            {title}
          </h2>
          <div className="min-w-0">{children}</div>
        </div>
      </Container>
    </section>
  );
}
