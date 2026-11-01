import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary';

const variants: Record<Variant, string> = {
  primary: 'bg-fg text-bg hover:opacity-85',
  secondary: 'border border-border text-fg hover:border-fg',
};

interface ButtonLinkProps extends ComponentPropsWithoutRef<'a'> {
  variant?: Variant;
}

/** Lien présenté comme un bouton (navigation, téléchargement, contact). */
export function ButtonLink({
  variant = 'primary',
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <a
      className={cn(
        'inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition-[opacity,border-color] duration-150',
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}
