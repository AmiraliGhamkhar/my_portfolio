# Verification and launch checklist

## Checks run in the development workspace

Run from the repository root:

```bash
npm run typecheck
npm test
npm run build
```

The automated suite includes source-level route/content/security assertions, PHP grammar parsing with `php-parser` using the PHP 8.2 grammar, and a static check that CMS field validators match SQL column widths. The production build pre-renders the known Persian and English routes, project details, contact pages, and admin shell; it checks HTML language/direction, metadata, sitemap entries, and required deployment files.

These checks do **not** execute PHP, connect to MySQL, interpret Apache rewrite rules, validate cPanel permissions, or substitute for browser/device testing. A PHP grammar parse is not a runtime test. Do not report an API or production deployment as verified based on these checks alone.

## Local integration setup (when PHP/MySQL are available)

1. Create a disposable test database and a private copy of the PHP backend/configuration.
2. Enable PHP 8.2+, PDO MySQL, Fileinfo, sessions, and JSON; configure a disposable app key and test upload/data directories. In a local checkout, `backend/config.php` is ignored by Git; copy `backend/config.example.php` there and fill only test values. Set `PORTFOLIO_DATA_DIR` and `PORTFOLIO_UPLOAD_DIR` to temporary directories outside the repository, and set `allowed_origin` to the exact browser origin used for Vite (for example `http://localhost:5173`).
3. From the repository root, run `php backend/bin/migrate.php`, `php backend/bin/seed.php`, and create a throwaway admin with `php backend/bin/create-admin.php`.
4. Start the API with `PORTFOLIO_PRIVATE_DIR="$PWD/backend" php -S 127.0.0.1:8080 -t public public/api/index.php`, then start Vite in a second terminal with `npm run dev`. Vite's `/api` proxy is already configured; keep browser code on relative `/api/...` URLs.
5. Exercise the smoke tests below with browser devtools/network and the PHP/database logs. Use a disposable database; do not test destructive actions against production.

## Pre-launch smoke tests

- **Static pages:** open `/fa/`, `/en/`, project lists/details, and contact pages directly in a fresh browser tab. Check `lang`, `dir`, canonical/hreflang tags, titles/descriptions, navigation, mobile layout, keyboard focus, reduced-motion behavior, and console/network errors.
- **Admin auth:** sign in with the CLI-created account; reload to confirm the session; verify invalid credentials, expired/missing CSRF, and unauthenticated admin reads/writes are rejected. Change the password and sign in with the new one.
- **Translations/content:** edit one Persian field and one English field separately; confirm the untouched language remains unchanged. Create, publish, unpublish, update, and delete a test project; verify its route and project-list behavior.
- **Media:** upload each supported type (JPEG/PNG/WebP/AVIF), select it as a portrait/cover/gallery image, confirm safe rendering and localized alt text, and verify deletion is blocked while referenced. Confirm SVG, a renamed non-image, and an over-limit upload are rejected.
- **Messages:** send a valid public contact request and confirm it appears in the admin; reject invalid email/short text; confirm the hidden honeypot is not shown to visitors. The system stores messages but does not send email.
- **Apache/API:** request `/api/v1/health`, all API rewrites, `/sitemap.xml`, `/robots.txt`, and unknown locale/project deep links over HTTPS. Confirm static assets compress/cache, API failures return JSON without PHP warnings, `.htaccess` headers are present, and `uploads/` cannot execute scripts or list contents.
- **Recovery:** take and restore a test database backup and a copy of private data/uploads before relying on the site.

Keep the PHP/MySQL/cPanel results and the date/hosting version with the release record; the repository does not claim those environment-specific checks were run here.
