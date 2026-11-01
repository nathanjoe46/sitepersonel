import { ButtonLink } from '@/components/ui/button-link';
import { Container } from '@/components/ui/container';
import { ArrowRight, Download } from '@/components/ui/icons';
import { Picture } from '@/components/ui/picture';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Profile } from '@/lib/schema';
import { asset } from '@/lib/site';

interface HeroProps {
  locale: Locale;
  dict: Dictionary;
  profile: Profile;
}

export function Hero({ locale, dict, profile }: HeroProps) {
  const cv = profile.cv[locale] ?? profile.cv.fr;
  const cvIsTranslated = profile.cv[locale] !== undefined;

  return (
    <Container className="pt-12 pb-16 sm:pt-20 sm:pb-24">
      <div className="grid gap-10 md:grid-cols-[1fr_14rem] md:items-start md:gap-14 lg:grid-cols-[1fr_16rem]">
        <div>
          <p className="font-mono text-xs tracking-wide text-muted">
            {profile.role[locale]} · {profile.location[locale]}
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            {profile.name}
          </h1>
          <p className="mt-5 max-w-2xl text-xl leading-snug text-balance sm:text-2xl">
            {profile.headline[locale]}
          </p>
          <p className="mt-5 max-w-2xl leading-relaxed text-muted">{profile.intro[locale]}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="#projects">
              {dict.hero.viewProjects}
              <ArrowRight />
            </ButtonLink>
            <ButtonLink
              variant="secondary"
              href={asset(cv)}
              download
              type="application/pdf"
              {...(cvIsTranslated ? {} : { hrefLang: 'fr' })}
            >
              <Download />
              {dict.hero.downloadCv}
              {!cvIsTranslated && <span className="text-muted">(FR)</span>}
            </ButtonLink>
          </div>
          <p className="mt-8 flex max-w-2xl items-start gap-2.5 text-sm text-muted">
            <span aria-hidden="true" className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
            {profile.availability[locale]}
          </p>
        </div>
        <div className="order-first w-40 sm:w-48 md:order-none md:w-full">
          <Picture
            src={profile.photo.src}
            alt={profile.photo.alt[locale]}
            sizes="(min-width: 1024px) 16rem, (min-width: 768px) 14rem, 12rem"
            priority
            className="aspect-[4/5] w-full rounded-lg object-cover"
          />
        </div>
      </div>
    </Container>
  );
}
