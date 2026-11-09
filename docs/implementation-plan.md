# Implementation plan and research notes

## Initial inspection

- The checkout was a clean, one-file repository at `64cb5a6` on the required Arena branch; it contained only a short README and no application, dependencies, or existing design assets.
- Node.js 22.22.3 and npm 10.9.8 are available. PHP, Composer, and a database runtime are not installed in this workspace.
- The reference URL (`danielkiss.hu`) is outside the sandbox's permitted outbound hosts, so its page was not fetched or visually inspected here. The implementation will use the supplied creative brief as direction and will not copy the reference's branding, code, or assets.
- GitHub API repository metadata and README files were inspected for the three supplied projects:
  - **Gamas Bot**: Python / Telethon Telegram study assistant for Persian/English audio and learning documents; README describes transcripts, booklets, quizzes, flashcards and exports. Repository README last updated 2026-11-07.
  - **Gamas Website**: React 18, Vite 6, `vite-react-ssg`, and PHP 8.2+ static site/API for Gamas; README describes cPanel/Apache deployment without a production Node process. Last updated 2026-11-02.
  - **deepgram-fa-speech**: Python Windows application for Persian/English medical dictation with Deepgram session tokens and deterministic terminology/BiDi processing. Its README explicitly says it is not a clinical NLP system or medical device. Last updated 2026-11-01.
- These are descriptions from project READMEs, not a security or functional audit of those separate applications.

## Architecture decisions

1. **Frontend**: Vite + React + TypeScript, React Router, GSAP/ScrollTrigger, Lucide icons, self-hosted variable WOFF2 fonts. Build-time prerendering creates independently addressable HTML for Persian and English routes, including each project detail page.
2. **Locale**: explicit `/fa/` and `/en/` routes, Persian default, actual `lang`/`dir` updates, and language links that retain the current route and project slug.
3. **Content integrity**: bilingual editorial seed content is separate from components; only supported facts are stated. The portrait remains abstract; missing email, education, experience, awards and social profiles stay unpublished until supplied.
4. **Backend**: PHP 8.2+ front controller, PDO/MySQL, versioned JSON API, prepared statements, whitelist-driven CRUD, sessions, CSRF, rate limiting and image-only uploads. The private bootstrap/configuration is deployed outside `public_html`; only the API entrypoint is public.
5. **CMS**: same-origin admin route with server authentication and independent `fa`/`en` translation editing. Content CRUD uses REST-style resource routes; profile/settings, media, messages and account security have dedicated operations.
6. **Hosting**: static Vite output plus Apache rewrites and a PHP API. Node is needed only to build/update the static output.

## Execution phases

- [x] Phase 1 — inspect the repository, available runtimes, and verified project references.
- [x] Phase 2 — document routes, API/data model, deployment shape, and a measurable implementation plan.
- [x] Phase 3 — establish an editorial visual system, RTL/LTR typography, responsive layout, and reduced-motion behavior.
- [x] Phase 4 — implement the bilingual public site, route-preserving switcher, project case studies, local content fallback, SEO/prerender, and contact UI.
- [x] Phase 5 — implement PHP API, MySQL schema/seed, authenticated bilingual CMS, and upload/security paths.
- [x] Phase 6 — connect public content and admin/contact forms to same-origin versioned API routes.
- [x] Phase 7 — run frontend typecheck, source tests, PHP 8.2 grammar parsing, and the static production build. PHP runtime, database/API integration, Apache, and browser checks are unavailable here and are documented as outstanding.
- [x] Phase 8 — document cPanel installation, updates, rollback, and release checks. A real hosting deployment cannot be verified without the owner's cPanel/database environment and is not claimed as completed.

## Acceptance boundaries

This repository prepares a real deployable application, but this sandbox does not provide PHP, MySQL, or the production cPanel account. Consequently production API login, persistence, upload permissions, cPanel rewrites, and deployed performance must be verified in that environment before calling the live deployment complete. No secrets are requested or committed.
