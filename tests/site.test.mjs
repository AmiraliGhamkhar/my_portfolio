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
  assert.match(content, /ایده‌ها را به سیستم‌های هوشمند تبدیل می‌کنم\./);
  assert.match(content, /Turning Ideas Into Intelligent Systems\./);
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
  const seoManager = await read('src/components/SeoManager.tsx');
  const seoLib = await read('src/lib/seo.ts');
  assert.match(seoManager, /project\?\.coverUrl \|\| publicSettings\.og_image \|\| profile\.portraitUrl/);
  assert.match(seoManager, /siteUrl\(socialImage\)/);
  assert.match(seoLib, /\$\{ORIGIN\}\$\{path\.startsWith\('\/'\) \? path : `\/\$\{path\}`\}/);
});

test('project technology editing uses slugs and public lists hide draft technologies', async () => {
  const api = await read('backend/src/router.php');
  assert.match(api, /app_project_technology_slugs_map/);
  assert.match(api, /AND tech\.status='published'/);
});

test('SQL splitter is shared in bootstrap, CLI scripts guard SAPI, and admin UI avoids technology array crash', async () => {
  const bootstrap = await read('backend/bootstrap.php');
  const migrate = await read('backend/bin/migrate.php');
  const seed = await read('backend/bin/seed.php');
  const createAdmin = await read('backend/bin/create-admin.php');
  const adminUi = await read('src/pages/admin/AdminApp.tsx');

  assert.match(bootstrap, /function app_split_sql_statements\(string \$sql\): array/);
  assert.match(bootstrap, /HTTP_REFERER/);
  for (const cli of [migrate, seed, createAdmin]) {
    assert.match(cli, /PHP_SAPI !== 'cli'/);
  }
  assert.match(createAdmin, /utf8_character_count\(\$name\)/);
  assert.match(adminUi, /Array\.isArray\(nextBase\.technologies\)/);
  assert.match(adminUi, /key=\{`\$\{item\.id\}-\$\{activeLocale\}`\}/);
});

test('public and admin collections batch relational lookups instead of N+1 queries', async () => {
  const api = await read('backend/src/router.php');
  assert.match(api, /WHERE pt\.project_id IN \(\{\$in\}\)/);
  assert.match(api, /WHERE pi\.project_id IN \(\{\$in\}\)/);
  assert.match(api, /ORDER BY r\.' \. str_replace\(', ', ', r\.', \$spec\['order'\]\)/);
  assert.match(api, /ESCAPE '\\\\\\\\'/);
  assert.doesNotMatch(api, /foreach \(\$stmt->fetchAll\(PDO::FETCH_COLUMN\) as \$id\)/);
});

test('admin bilingual forms preserve edits across FA/EN tab switches before saving', async () => {
  const adminUi = await read('src/pages/admin/AdminApp.tsx');
  assert.match(adminUi, /serializedTranslations\[lang\] = currentLang/);
  assert.match(adminUi, /dirtyLocales\[other\]/);
});
