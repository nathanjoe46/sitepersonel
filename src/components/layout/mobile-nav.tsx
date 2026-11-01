'use client';

import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';

import { Close, Menu } from '@/components/ui/icons';

interface MobileNavProps {
  items: { href: string; label: string }[];
  labels: { open: string; close: string; nav: string };
}

/** Menu déroulant pour petits écrans : Échap ou un lien le referment. */
export function MobileNav({ items, labels }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? labels.close : labels.open}
        onClick={() => {
          setOpen((value) => !value);
        }}
        className="inline-flex size-11 items-center justify-center rounded-md text-fg"
      >
        {open ? <Close /> : <Menu />}
      </button>
      <nav
        id={panelId}
        aria-label={labels.nav}
        hidden={!open}
        className="absolute inset-x-0 top-full border-b border-border bg-bg"
      >
        <ul className="mx-auto max-w-5xl px-5 py-2 sm:px-8">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => {
                  setOpen(false);
                }}
                className="flex min-h-12 items-center text-base text-fg"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
