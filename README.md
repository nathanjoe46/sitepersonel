# Portfolio — Jonathan Alix Pierre Dort

Site personnel bilingue (français / anglais) d'ingénieur logiciel, exporté en HTML statique et publié sur GitHub Pages.

**En ligne :** https://nathanjoe46.github.io/sitepersonel/

|             |                                                                   |
| ----------- | ----------------------------------------------------------------- |
| Framework   | [Next.js](https://nextjs.org) (App Router, export statique)       |
| Langage     | TypeScript en mode strict                                         |
| Styles      | Tailwind CSS v4, thème clair / sombre                             |
| Contenu     | Fichiers JSON validés par [zod](https://zod.dev) à chaque build   |
| Admin       | [Sveltia CMS](https://sveltiacms.app) sur `/admin/`, sans serveur |
| Qualité     | ESLint, Prettier, Vitest, Playwright + axe, Lighthouse CI         |
| Déploiement | GitHub Actions → GitHub Pages                                     |

---

## Modifier le contenu

### Avec l'admin (recommandé)

1. Ouvrir **https://nathanjoe46.github.io/sitepersonel/admin/**.
2. Se connecter avec un **jeton d'accès GitHub** (à créer une seule fois, voir ci-dessous).
3. Modifier le profil, les projets, le parcours… Chaque champ traduisible a une version **Français** et une version **English**.
4. Enregistrer : l'admin crée un commit sur `main`, GitHub Actions reconstruit le site, qui est en ligne en 1 à 2 minutes environ.

Si une saisie est invalide (une traduction manquante, une date mal écrite…), le build échoue et **le site en ligne reste sur la version précédente**. L'erreur est indiquée dans l'onglet _Actions_ du dépôt.

**Créer le jeton (une fois) :**
GitHub → _Settings_ → _Developer settings_ → _Personal access tokens_ → _Fine-grained tokens_ → _Generate new token_.

- _Repository access_ : **Only select repositories** → `nathanjoe46/sitepersonel`
- _Permissions_ → _Repository permissions_ → **Contents : Read and write**
- Expiration : 90 jours conseillés (il suffit d'en recréer un ensuite)

Ne partagez jamais ce jeton. L'admin le garde uniquement dans votre navigateur.

### Directement dans les fichiers

Tout le texte du site se trouve dans [`content/`](content/) :

| Fichier              | Contenu                                                                |
| -------------------- | ---------------------------------------------------------------------- |
| `profile.json`       | Nom, titre, accroche, photo, à propos, langues, CV                     |
| `contact.json`       | Email, WhatsApp, liens (LinkedIn, GitHub…)                             |
| `projects/*.json`    | Un fichier par projet ; `body` (Markdown) crée une page d'étude de cas |
| `experience.json`    | Parcours professionnel                                                 |
| `skills.json`        | Expertise par domaine                                                  |
| `education.json`     | Diplôme et certifications                                              |
| `company.json`       | PragmaTech Solution                                                    |
| `public-sector.json` | Travaux institutionnels (présentés sans nom ni détail : confidentiels) |
| `teaching.json`      | Contenu pédagogique (cybersécurité, transactions électroniques)        |

Les libellés de l'interface (menus, boutons) sont dans [`src/i18n/dictionaries.ts`](src/i18n/dictionaries.ts).
Les images vont dans `public/images/` : elles sont converties automatiquement en AVIF et WebP au build.

---

## Développement

Rien n'est nécessaire en local pour publier : GitHub Actions construit et déploie le site. Pour travailler sur le code (en local ou dans GitHub Codespaces) :

```bash
pnpm install
pnpm dev          # http://localhost:3000/fr/
```

| Commande        | Rôle                                                        |
| --------------- | ----------------------------------------------------------- |
| `pnpm build`    | Export statique dans `out/`                                 |
| `pnpm serve`    | Sert `out/` comme GitHub Pages (http://localhost:4173/fr/)  |
| `pnpm check`    | Formatage, lint, typage et tests unitaires                  |
| `pnpm test:e2e` | Tests Playwright et accessibilité (axe), après `pnpm build` |
| `pnpm lhci`     | Lighthouse CI sur `out/`                                    |
| `pnpm og`       | Régénère les images de partage `public/og/*.png`            |

Prérequis : Node.js 22 et pnpm 10 (`corepack enable`).

### Structure

```
content/               Contenu éditorial (JSON), modifiable depuis l'admin
public/admin/          Admin (Sveltia CMS) et sa configuration
public/images/         Images sources (optimisées au build)
scripts/               Optimisation des images, images de partage, serveur statique
src/app/[locale]/      Pages (/fr/…, /en/…)
src/components/        Mise en page, sections, composants d'interface
src/i18n/              Langues et libellés de l'interface
src/lib/               Schémas de contenu, chargement, SEO, utilitaires
tests/                 Tests unitaires (Vitest) et e2e (Playwright)
```

---

## Qualité

Chaque pull request passe par [la CI](.github/workflows/ci.yml) :

- Prettier, ESLint (règles `strict-type-checked` et `jsx-a11y` strict), TypeScript strict ;
- tests unitaires : validité du contenu, parité FR/EN, dates, sécurité du rendu ;
- tests e2e sur ordinateur et mobile : langue, thème, menu, 404, liens, absence de défilement horizontal ;
- accessibilité **WCAG 2.2 AA** vérifiée par axe sur chaque page, en thème clair et sombre ;
- **Lighthouse ≥ 95** dans les quatre catégories (médiane de 5 mesures), sinon la CI échoue.

---

## Déploiement

[`deploy.yml`](.github/workflows/deploy.yml) publie le site à chaque push sur `main`.

**Réglage à faire une fois :** _Settings_ → _Pages_ → _Build and deployment_ → _Source_ : **GitHub Actions**.

### Domaine personnalisé

1. Chez le registrar, créer un enregistrement `CNAME` (ex. `www`) vers `nathanjoe46.github.io`, ou des enregistrements `A` vers les adresses IP de GitHub Pages pour le domaine racine.
2. _Settings_ → _Pages_ → _Custom domain_ : saisir le domaine, puis cocher _Enforce HTTPS_.
3. Mettre à jour `site_url` et `display_url` dans `public/admin/config.yml` et l'URL par défaut dans `src/lib/site.ts`.

Le sous-dossier et l'URL publique sont fournis automatiquement au build par `actions/configure-pages` : le code n'a pas besoin d'autre changement.
