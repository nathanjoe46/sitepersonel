import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const pages = [
  { path: '/fr/', lang: 'fr' },
  { path: '/en/', lang: 'en' },
  { path: '/fr/projects/jl-express/', lang: 'fr' },
  { path: '/en/projects/jl-express/', lang: 'en' },
];

async function expectNoA11yViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
}

for (const { path, lang } of pages) {
  test.describe(path, () => {
    test('se charge sans erreur, avec la bonne langue et un seul h1', async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('console', (message) => {
        if (message.type() === 'error') errors.push(message.text());
      });

      await page.goto(path);
      await expect(page.locator('html')).toHaveAttribute('lang', lang);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/(fr|en)\//);
      await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
      expect(errors).toEqual([]);
    });

    for (const scheme of ['light', 'dark'] as const) {
      test(`accessibilité WCAG AA — thème ${scheme === 'light' ? 'clair' : 'sombre'}`, async ({
        page,
      }) => {
        await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });
        await page.goto(path);
        await expect(page.locator('html')).toHaveClass(new RegExp(scheme));
        await expectNoA11yViolations(page);
      });
    }
  });
}

test('la racine redirige vers une langue', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/(fr|en)\/$/);
});

test('les URL inconnues affichent la page 404 bilingue', async ({ page }) => {
  const response = await page.goto('/fr/nexiste-pas/');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'Page introuvable' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
});

test('le changement de langue conserve la page', async ({ page }) => {
  await page.goto('/fr/projects/jl-express/');
  await page.getByRole('link', { name: /Read this page in English/ }).click();
  await expect(page).toHaveURL(/\/en\/projects\/jl-express\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('le thème se bascule et persiste', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/fr/');
  await page.getByRole('button', { name: 'Passer au thème sombre' }).click();
  await expect(page.locator('html')).toHaveClass(/dark/);
  await page.reload();
  await expect(page.locator('html')).toHaveClass(/dark/);
  await expect(page.getByRole('button', { name: 'Passer au thème clair' })).toBeVisible();
});

test('le lien d’évitement mène au contenu', async ({ page }) => {
  await page.goto('/fr/');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Aller au contenu' });
  await expect(skip).toBeFocused();
  await skip.press('Enter');
  await expect(page).toHaveURL(/#main$/);
});

test('le CV et les images sont servis', async ({ page, request }) => {
  await page.goto('/fr/');
  const cv = page.getByRole('link', { name: /Télécharger le CV/ });
  const href = await cv.getAttribute('href');
  expect(href).toMatch(/\.pdf$/);
  expect((await request.get(href ?? '')).status()).toBe(200);

  const images = page.locator('main img');
  for (const img of await images.all()) {
    await img.scrollIntoViewIfNeeded();
    await expect
      .poll(() => img.evaluate((el: HTMLImageElement) => el.naturalWidth))
      .toBeGreaterThan(0);
  }
});

test.describe('mobile', () => {
  test.skip(({ isMobile }) => !isMobile, 'Menu réservé aux petits écrans');

  test('le menu s’ouvre, se ferme avec Échap et rend le focus', async ({ page }) => {
    await page.goto('/fr/');
    const button = page.getByRole('button', { name: 'Ouvrir le menu' });
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await button.click();
    const close = page.getByRole('button', { name: 'Fermer le menu' });
    await expect(close).toHaveAttribute('aria-expanded', 'true');
    await expect(
      page
        .getByRole('navigation', { name: 'Navigation principale' })
        .getByRole('link', { name: 'Projets' })
        .last(),
    ).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('button', { name: 'Ouvrir le menu' })).toBeFocused();
  });

  test('aucun défilement horizontal', async ({ page }) => {
    for (const path of ['/fr/', '/en/projects/jl-express/']) {
      await page.goto(path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, path).toBeLessThanOrEqual(0);
    }
  });
});
