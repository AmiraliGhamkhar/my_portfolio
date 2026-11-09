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

## Animation and accessibility

GSAP/ScrollTrigger powers progressive entrance reveals and scroll progress. Timelines are scoped to React component lifecycles and reverted on route changes. CSS keeps content visible if JavaScript/animation fails, honors `prefers-reduced-motion`, and simplifies motion on smaller screens. Native horizontal scrolling and explicit previous/next controls keep the project rail usable by touch and keyboard.
