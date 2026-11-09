import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const routes = [
  ['/fa/', 'fa', 'rtl', 'سلام، من امیرعلی هستم.'],
  ['/en/', 'en', 'ltr', 'Hi, I&#x27;m Amirali.'],
  ['/fa/projects/', 'fa', 'rtl', 'پروژه'],
  ['/en/projects/', 'en', 'ltr', 'Projects'],
  ['/fa/contact/', 'fa', 'rtl', 'بیایید چیزی هوشمندانه بسازیم.'],
  ['/en/contact/', 'en', 'ltr', 'Let&#x27;s Build Something Intelligent.'],
  ['/fa/projects/gamas-bot/', 'fa', 'rtl', 'گاماس بات'],
  ['/en/projects/gamas-bot/', 'en', 'ltr', 'Gamas Bot'],
  ['/fa/projects/gamas-website/', 'fa', 'rtl', 'وب‌سایت گاماس'],
  ['/en/projects/gamas-website/', 'en', 'ltr', 'Gamas Website'],
  ['/fa/projects/deepgram-fa-speech/', 'fa', 'rtl', 'گفتار پزشکی فارسی'],
  ['/en/projects/deepgram-fa-speech/', 'en', 'ltr', 'Medical STT'],
  ['/admin/', 'fa', 'rtl', 'پنل مدیریت'],
];
for (const [route, lang, dir, marker] of routes) {
  const file = route === '/admin/' ? path.join(dist, 'admin/index.html') : path.join(dist, route.slice(1), 'index.html');
  const html = await readFile(file, 'utf8');
  assert.match(html, new RegExp(`<html lang="${lang}" dir="${dir}">`), `${route} has the correct document language and direction`);
  assert.ok(html.includes(marker), `${route} contains its prerendered page content`);
  assert.match(html, /<title>[^<]+<\/title>/, `${route} has a title`);
  assert.match(html, /name="description" content="[^"]+"/, `${route} has a description`);
  assert.match(html, /rel="canonical"/, `${route} has a canonical URL`);
  if (route !== '/admin/') assert.match(html, /property="og:image"/, `${route} has a social preview image`);
  if (route !== '/admin/') {
    assert.match(html, /hreflang="fa"/, `${route} has Persian hreflang`);
    assert.match(html, /hreflang="en"/, `${route} has English hreflang`);
  }
}
const sitemap = await readFile(path.join(dist, 'sitemap.xml'), 'utf8');
assert.ok(sitemap.includes('https://amiralighamkhar.ir/fa/projects/deepgram-fa-speech/'));
assert.ok(sitemap.includes('hreflang="x-default"'));
assert.ok(sitemap.includes('https://amiralighamkhar.ir/en/contact/'));
await access(path.join(dist, '.htaccess'));
await access(path.join(dist, 'api/index.php'));
await access(path.join(dist, 'uploads/.htaccess'));
await access(path.join(dist, 'og-card.svg'));
console.log(`Static build checks passed for ${routes.length} routes, SEO tags, sitemap, and deployment files.`);
