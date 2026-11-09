# Database and content model

The schema is `backend/migrations/001_schema.sql`; verified starter records are in `backend/seeds/001_verified_content.sql`. Both target MySQL/MariaDB with InnoDB and `utf8mb4`. Migrations are tracked in `schema_migrations`; seed statements use `INSERT IGNORE` so rerunning them fills missing starter rows without overwriting CMS edits.

## Content conventions

- Base tables contain language-neutral values such as slugs, URLs, status, visibility, order, and dates.
- Corresponding translation tables use `language CHAR(2)` with a database check for `fa` and `en`. Their primary key is the content ID plus language.
- Public endpoints return only published rows (or visible social links) with a translation for the requested language. Project slugs are shared between locales.
- Admin saves are partial and language-specific. An omitted field or the other locale is left unchanged.
- Long descriptions are stored as plain text; the API strips HTML tags and validates lengths before writes. Project `details` is a JSON array of strings.
- Missing biography, education, employment, awards, publications, and direct contact details are not seeded as facts. Optional timeline/publication/achievement entries remain drafts or absent until the owner supplies accurate information.

## Tables

| Table(s) | Purpose |
| --- | --- |
| `admin_users` | Admin account, password hash, active state, and login timestamps. |
| `profile`, `profile_translations` | Contact/profile fields plus Persian and English hero, biography, and SEO text. |
| `site_settings` | JSON-encoded settings; public reads are restricted to an explicit SEO/Open Graph allowlist. |
| `projects`, `project_translations` | Project slug, status, sort order, cover/media link, external URLs, featured state, bilingual text, details, and SEO. |
| `project_images` | Ordered project gallery entries with optional media association and per-language alt text. |
| `technologies`, `technology_translations`, `project_technologies` | Bilingual technology names, categories, and project associations. |
| `expertise`, `expertise_translations` | Published areas of expertise and their translations. |
| `experience`, `experience_translations` | Optional work/experience entries. No entries are invented. |
| `education`, `education_translations` | Optional education entries. No entries are invented. |
| `research`, `research_translations` | Research interests, distinct from publications or claimed research results. |
| `publications`, `publication_translations` | Optional publication metadata, abstract, authors, venue, and SEO. |
| `achievements`, `achievements_translations` | Optional dated items and issuer metadata; no awards are fabricated. |
| `social_links`, `social_link_translations` | Optional visible social/contact links. |
| `contact_messages` | Contact form submissions, status, timestamp, and keyed IP hash for abuse controls. |
| `media_library` | Uploaded image metadata and public URL; file bytes live in the configured upload directory. |
| `schema_migrations` | Applied migration filenames and timestamps. |

Content foreign keys cascade to their translations. Project-technology joins and media uploader references are constrained. Media references from profile/project/gallery records are additionally checked by the delete endpoint; remove a reference in the CMS before deleting media.

## Setup and maintenance

Use the PHP CLI scripts from the private application directory:

```bash
php bin/migrate.php
php bin/seed.php
php bin/create-admin.php --email=owner@example.com --name='Portfolio owner'
```

Take a database backup before schema changes. `migrate.php` applies migration files in sorted order and skips recorded migrations; MySQL DDL is not transactionally reversible. Add a new, numbered migration for future schema changes rather than editing a migration that has already been applied to a live installation.

`seed.php` is intended for a fresh database and safe backfilling. Because `INSERT IGNORE` deliberately preserves rows, it is not a content-reset command. Edit or remove content through the CMS after installation.
