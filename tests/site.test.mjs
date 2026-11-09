import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relative) => readFile(path.join(root, relative), 'utf8');

test('the two explicit locales and project slugs are present', async () => {
  const content = await read('src/content.ts');
  assert.match(content, /export type Locale = 'fa' \| 'en'/);
  const slugs = [...content.matchAll(/slug: '([^']+)'/g)].map((match) => match[1]);
  assert.deepEqual(slugs, ['gamas-bot', 'gamas-website', 'deepgram-fa-speech']);
  assert.match(content, /مهندس هوش مصنوعی که سیستم‌های هوشمند برای سلامت، آموزش و محصولات واقعی می‌سازد\./);
  assert.match(content, /AI Engineer building intelligent systems for healthcare, education and real-world products\./);
});

test('the public Apache rules preserve PHP API routes and use a static SPA fallback', async () => {
  const rules = await read('public/.htaccess');
  assert.match(rules, /RewriteRule \^\(\?:api\|uploads\)/);
  assert.match(rules, /RewriteRule \^ index\.html \[L\]/);
  assert.match(rules, /https:\/\/amiralighamkhar\.ir/);
  const uploadRules = await read('public/uploads/.htaccess');
  assert.match(uploadRules, /FilesMatch/);
  assert.match(uploadRules, /Require all denied/);
});

test('the database schema contains bilingual content and authentication tables', async () => {
  const schema = await read('backend/migrations/001_schema.sql');
  for (const table of ['admin_users', 'profile_translations', 'projects', 'project_translations', 'project_images', 'expertise_translations', 'technologies', 'experience_translations', 'education_translations', 'research_translations', 'publication_translations', 'achievements_translations', 'social_link_translations', 'contact_messages', 'media_library']) {
    assert.ok(schema.includes(`CREATE TABLE IF NOT EXISTS ${table}`), `missing table ${table}`);
  }
  assert.match(schema, /CHECK \(language IN \('fa','en'\)\)/);
});

test('public mutations are guarded by CSRF and sensitive password handling', async () => {
  const api = await read('backend/src/router.php');
  const bootstrap = await read('backend/bootstrap.php');
  assert.match(api, /app_require_csrf\(\)/);
  assert.match(api, /password_verify\(/);
  assert.match(api, /password_hash\(/);
  assert.match(api, /strlen\(\$next\) > 72/);
  assert.match(api, /\$verified = password_verify\(\$password, \$hash\)/);
  assert.match(api, /new finfo\(FILEINFO_MIME_TYPE\)/);
  assert.match(bootstrap, /httponly' => true/);
  assert.match(bootstrap, /samesite' => 'Strict'/);
  assert.match(bootstrap, /app_rate_limit/);
});

test('the build uses local fonts and the project never contains credentials', async () => {
  const css = await read('src/styles.css');
  assert.doesNotMatch(css, /fonts\.googleapis\.com/);
  assert.doesNotMatch(css, /ticker/);
  const example = await read('backend/config.example.php');
  assert.match(example, /getenv\('DB_PASSWORD'\)/);
  assert.doesNotMatch(example, /password'\s*=>\s*'[^']+'/);
});

test('empty API collections preserve the verified static fallback content', async () => {
  const data = await read('src/lib/usePortfolioData.ts');
  assert.match(data, /if \(remoteProjects\?\.length\)/);
  assert.match(data, /if \(remoteExpertise\?\.length\)/);
  assert.match(data, /if \(remoteTechnologies\?\.length\)/);
  assert.match(data, /if \(research\?\.length\) \{ next\.research = research; next\.researchConfigured = true; \}/);
});

test('SEO image selection prioritizes CMS Open Graph settings and resolves local uploads', async () => {
  const seo = await read('src/components/SeoManager.tsx');
  assert.match(seo, /project\?\.coverUrl \|\| publicSettings\.og_image \|\| profile\.portraitUrl/);
  assert.match(seo, /socialImage\.startsWith\('\/'\) \? `https:\/\/amiralighamkhar\.ir\$\{socialImage\}`/);
});

test('project technology editing uses slugs and public lists hide draft technologies', async () => {
  const api = await read('backend/src/router.php');
  assert.match(api, /app_record_technologies\(\$id, 'en', true\)/);
  assert.match(api, /app_record_technologies\(\(int\) \$row\['id'\], \$language, false, true\)/);
  assert.match(api, /\$publishedOnly \? " AND tech\.status='published'"/);
});
