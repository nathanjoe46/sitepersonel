import { ButtonLink } from '@/components/ui/button-link';
import { ArrowUpRight, Mail, MessageCircle } from '@/components/ui/icons';
import { Section } from '@/components/ui/section';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Contact as ContactContent } from '@/lib/schema';

interface ContactProps {
  locale: Locale;
  dict: Dictionary;
  contact: ContactContent;
}

export function Contact({ locale, dict, contact }: ContactProps) {
  return (
    <Section id="contact" title={dict.sections.contact}>
      <p className="max-w-2xl text-2xl leading-snug font-medium tracking-tight text-balance sm:text-3xl">
        {contact.message[locale]}
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href={`mailto:${contact.email}`}>
          <Mail />
          {dict.contact.email}
        </ButtonLink>
        {contact.whatsapp && (
          <ButtonLink variant="secondary" href={`https://wa.me/${contact.whatsapp}`}>
            <MessageCircle />
            {dict.contact.whatsapp}
            {contact.phoneDisplay && <span className="text-muted">{contact.phoneDisplay}</span>}
          </ButtonLink>
        )}
      </div>
      <p className="mt-6 text-sm text-muted">
        <a
          href={`mailto:${contact.email}`}
          className="underline decoration-border underline-offset-4 hover:text-fg hover:decoration-fg"
        >
          {contact.email}
        </a>
      </p>
      {contact.links.length > 0 && (
        <>
          <h3 className="mt-12 font-mono text-xs text-muted">{dict.contact.elsewhere}</h3>
          <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
            {contact.links.map((link) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  className="inline-flex min-h-11 items-center gap-1 underline decoration-border underline-offset-4 hover:decoration-fg"
                >
                  {link.label}
                  <ArrowUpRight className="text-muted" />
                </a>
              </li>
            ))}
          </ul>
        </>
      )}
    </Section>
  );
}
