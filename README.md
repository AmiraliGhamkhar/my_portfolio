# Amirali Ghamkhar — Personal Portfolio

A bilingual Persian/English portfolio for **Amirali Ghamkhar**, built as a statically rendered React + TypeScript site with a PHP 8.2+ / MySQL API and an independently deployable CMS. The production frontend is static; PHP serves the API and no Node.js process is required on the host.

## Quick start

```bash
npm ci
npm run dev
```

The public site defaults to `/fa/`; English lives at `/en/`. The admin application is at `/admin/`. The CMS and contact form need the PHP API and MySQL configured; the public website remains readable from its built-in, carefully sourced bilingual content if the API is not configured.

## Build and verify

```bash
npm run typecheck
npm test
npm run build
```

`npm run build` creates `dist/`, pre-renders the known public routes with language-specific metadata, and generates the XML sitemap. Upload `dist/` contents to `public_html`; place the private PHP application outside the document root. See [`docs/DEPLOY_CPANEL.md`](docs/DEPLOY_CPANEL.md).

## Project map

- `src/` — React UI, bilingual content, routes, SEO and animation.
- `backend/` — PHP API, migrations, seed content, and safe admin bootstrap.
- `public/` — files copied to the static build (Apache rules, API entrypoint, favicon, robots).
- `docs/` — implementation plan, architecture, API reference, database model, security, cPanel deployment, and verification checklist.

## Operations documentation

- [cPanel deployment](docs/DEPLOY_CPANEL.md)
- [API reference](docs/api.md)
- [Database/content model](docs/database.md)
- [Security model](docs/security.md)
- [Verification checklist](docs/testing.md)
- [Architecture](docs/architecture.md) and [implementation notes](docs/implementation-plan.md)

CMS text/SEO edits appear on the client-rendered site after the API refresh. Because production uses static files and has no Node process, rebuild and upload `dist/` when new public routes need crawler-visible prerendered HTML or when the canonical domain changes.

## Content integrity

Public project summaries are grounded in the three linked GitHub repositories. No education, employment, awards, client work, email address, or personal photograph has been invented. Unknown biography and contact fields remain editable placeholders in the CMS. The portrait is an abstract replaceable illustration until Amirali uploads a real image.

## Deployment note

The workspace used for implementation does not have PHP or a MySQL server installed. Frontend type checks, tests, and production build are run here; PHP/API and database integration checks are documented for a PHP 8.2+ / MySQL deployment environment and are not claimed as executed in this workspace.
