# Architecture

## Public URL model

| URL | Purpose |
| --- | --- |
| `/` | Static redirect to the default Persian route `/fa/` |
| `/fa/`, `/en/` | Home page, localized editorial content |
| `/{fa|en}/projects/` | Selected projects |
| `/{fa|en}/projects/{slug}/` | Shareable project case study |
| `/admin/` | React CMS shell; authentication and data are server-side |
| `/api/v1/...` | Same-origin PHP JSON API |

The Vite build pre-renders known public routes into their own `index.html`, including titles, descriptions, canonical links and reciprocal `hreflang` links. Apache serves those files directly; its locale fallback serves a static shell for new client routes, and the React router renders a real not-found view for unknown slugs after hydration. New CMS project routes can be rendered client-side immediately; rebuild and upload the static site when they need crawler-visible pre-rendered HTML and metadata.

## Runtime boundaries

- Browser: static HTML/CSS/JS and same-origin `fetch('/api/v1/...')` only.
- Build machine: Node.js + Vite + TypeScript; creates `dist/` and the XML sitemap.
- Production host: Apache, PHP 8.2+, PDO MySQL/MariaDB, and filesystem uploads. No resident Node process.
- Private account files: PHP application, local configuration, logs, rate-limit data and database credentials live outside `public_html`. Public API entrypoint resolves the private bootstrap from `PORTFOLIO_PRIVATE_DIR` or the documented sibling `portfolio-private` directory.

## Content model

Base records contain language-neutral metadata. Separate translation tables store explicit `fa` and `en` content. Admin updates accept only the edited language and update only the submitted translation columns, so an empty or stale translation tab cannot overwrite the other language.

Project slugs are shared between locales by default; a language switch preserves the current project route. Each project has status, category, cover, optional gallery, optional linked technologies, external URLs, featured flag, sort order, and per-language title/summary/body/SEO fields.

The public UI contains a conservative editorial fallback. When PHP/MySQL is configured, public API results override fallback sections. Empty database content never erases the fallback site. Empty optional research/publication/achievement groups remain unpublished rather than being fabricated.

## Case-study content

Project translations carry an optional structured case study — `problem`, `solution`, an `engineering` list, and `outcome` — alongside the shorter `details` capability list. These are stored per language and edited in the CMS like any other translation field. When a translation leaves them empty the public UI falls back to its verified static copy, so a partially translated project still reads as a complete page.

## Animation and accessibility

GSAP/ScrollTrigger powers progressive entrance reveals and a scroll-progress indicator. Timelines are scoped to React component lifecycles and reverted on route changes. The reveal chunk is loaded on demand, and a timer removes the pre-animation hidden state if that chunk fails, so content never stays invisible. CSS honors `prefers-reduced-motion` and simplifies motion on smaller screens; no animation is required to read any content.
