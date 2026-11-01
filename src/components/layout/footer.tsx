import { Container } from '@/components/ui/container';
import type { Dictionary } from '@/i18n/dictionaries';
import { repositoryUrl } from '@/lib/site';

interface FooterProps {
  dict: Dictionary;
  name: string;
}

export function Footer({ dict, name }: FooterProps) {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border">
      <Container className="flex flex-col gap-2 py-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {name}. {dict.footer.rights}
        </p>
        <p>
          {dict.footer.builtWith}{' '}
          <a
            href={repositoryUrl}
            className="underline decoration-border underline-offset-4 transition-colors hover:text-fg hover:decoration-fg"
          >
            {dict.footer.source}
          </a>
        </p>
      </Container>
    </footer>
  );
}
