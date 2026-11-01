'use client';

import { useTheme } from 'next-themes';
import { useSyncExternalStore } from 'react';

import { Moon, Sun } from '@/components/ui/icons';

const noop = () => () => undefined;

interface ThemeToggleProps {
  labels: { toLight: string; toDark: string };
}

/** Bascule clair/sombre. Le thème initial suit la préférence du système. */
export function ThemeToggle({ labels }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  // Le thème n'est connu qu'après hydratation : on évite tout décalage d'affichage.
  const mounted = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
  const isDark = mounted && resolvedTheme === 'dark';
  const label = isDark ? labels.toLight : labels.toDark;

  return (
    <button
      type="button"
      onClick={() => {
        setTheme(isDark ? 'light' : 'dark');
      }}
      aria-label={label}
      title={label}
      className="inline-flex size-11 items-center justify-center rounded-md text-muted transition-colors hover:text-fg"
    >
      {mounted ? isDark ? <Sun /> : <Moon /> : <span className="size-[18px]" />}
    </button>
  );
}
