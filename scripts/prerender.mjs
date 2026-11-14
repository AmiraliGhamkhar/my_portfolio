import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'dist');
const vite = await createServer({
  configFile: path.join(root, 'vite.config.ts'),
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
});

try {
  const [{ render }, { publicRoutes }, { alternateUrls, getSeoForPath, siteUrl }] = await Promise.all([
    vite.ssrLoadModule('/src/entry-server.tsx'),
    vite.ssrLoadModule('/src/content.ts'),
    vite.ssrLoadModule('/src/lib/seo.ts'),
  ]);
  const template = await readFile(path.join(outDir, 'index.html'), 'utf8');
  const htmlEscape = (value) => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  const upsertMeta = (html, selector, tag) => {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`<meta\\s+${escaped}[^>]*>`, 'i');
    return pattern.test(html) ? html.replace(pattern, tag) : html.replace('</head>', `    ${tag}\n  </head>`);
  };
  const replaceMeta = (html, key, value, property = false) => upsertMeta(
    html,
    `${property ? 'property' : 'name'}="${key}"`,
    `<meta ${property ? 'property' : 'name'}="${key}" content="${htmlEscape(value)}" />`,
  );
  const replaceLink = (html, rel, href, hreflang = '') => {
    const attrs = `rel="${rel}"${hreflang ? ` hreflang="${hreflang}"` : ''}`;
    const pattern = new RegExp(`<link\\s+${attrs.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^>]*>`, 'i');
    const tag = `<link ${attrs} href="${htmlEscape(href)}" />`;
    return pattern.test(html) ? html.replace(pattern, tag) : html.replace('</head>', `    ${tag}\n  </head>`);
  };

  for (const route of publicRoutes) {
    const seo = getSeoForPath(route);
    const markup = render(route);
    const locale = route.startsWith('/en') ? 'en' : 'fa';
    let page = template
      .replace('<html lang="fa" dir="rtl">', `<html lang="${locale}" dir="${locale === 'fa' ? 'rtl' : 'ltr'}">`)
      .replace(/<title>[^<]*<\/title>/i, `<title>${htmlEscape(seo.title)}</title>`)
      .replace('<div id="root"></div>', `<div id="root">${markup}</div>`);

    page = replaceMeta(page, 'description', seo.description);
    page = replaceMeta(page, 'og:title', seo.title, true);
    page = replaceMeta(page, 'og:description', seo.description, true);
    page = replaceMeta(page, 'og:url', seo.canonical, true);
    page = replaceMeta(page, 'og:type', seo.type, true);
    page = replaceMeta(page, 'og:locale', locale === 'fa' ? 'fa_IR' : 'en_US', true);
    page = replaceMeta(page, 'twitter:card', 'summary_large_image');
    page = replaceMeta(page, 'twitter:title', seo.title);
    page = replaceMeta(page, 'twitter:description', seo.description);
    page = replaceLink(page, 'canonical', seo.canonical);
    if (route.startsWith('/fa/') || route.startsWith('/en/')) {
      const { fa, en, xDefault } = alternateUrls(route);
      page = replaceLink(page, 'alternate', fa, 'fa');
      page = replaceLink(page, 'alternate', en, 'en');
      page = replaceLink(page, 'alternate', xDefault, 'x-default');
    }
    if (route.startsWith('/admin')) {
      page = replaceMeta(page, 'robots', 'noindex,nofollow');
      page = page.replace(/\s*<link rel="alternate" hreflang="[^"]+" href="[^"]+" \/>/g, '');
      page = page.replace(/\s*<meta (?:property="og:image[^"]*"|name="twitter:image") content="[^"]+" \/>/g, '');
    }

    const destination = route === '/admin/' ? path.join(outDir, 'admin', 'index.html') : path.join(outDir, route.slice(1), 'index.html');
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, page, 'utf8');
  }

  const publicPaths = publicRoutes.filter((route) => route.startsWith('/fa/') || route.startsWith('/en/'));
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${publicPaths.map((route) => {
    const { fa, en, xDefault } = alternateUrls(route);
    return `  <url><loc>${siteUrl(route)}</loc><xhtml:link rel="alternate" hreflang="fa" href="${fa}"/><xhtml:link rel="alternate" hreflang="en" href="${en}"/><xhtml:link rel="alternate" hreflang="x-default" href="${xDefault}"/></url>`;
  }).join('\n')}\n</urlset>\n`;
  await writeFile(path.join(outDir, 'sitemap.xml'), sitemap, 'utf8');

  const { fa: rootFa, en: rootEn, xDefault: rootDefault } = alternateUrls('/');
  const rootPage = `<!doctype html>\n<html lang="fa" dir="rtl">\n<head>\n<meta charset="UTF-8"/>\n<meta name="viewport" content="width=device-width, initial-scale=1.0"/>\n<meta name="robots" content="noindex,follow"/>\n<meta http-equiv="refresh" content="0;url=/fa/"/>\n<title>Amirali Ghamkhar — Persian / فارسی</title>\n<link rel="canonical" href="${rootFa}"/>\n<link rel="alternate" hreflang="fa" href="${rootFa}"/>\n<link rel="alternate" hreflang="en" href="${rootEn}"/>\n<link rel="alternate" hreflang="x-default" href="${rootDefault}"/>\n</head>\n<body><p><a href="/fa/">ادامه به فارسی</a> · <a href="/en/">Continue in English</a></p></body>\n</html>\n`;
  await writeFile(path.join(outDir, 'index.html'), rootPage, 'utf8');
  console.log(`Pre-rendered ${publicRoutes.length} routes and generated sitemap.xml.`);
} finally {
  await vite.close();
}
