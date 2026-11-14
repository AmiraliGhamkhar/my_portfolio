import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Engine from 'php-parser';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const php = await readFile(path.join(root, 'backend/src/router.php'), 'utf8');
const schema = await readFile(path.join(root, 'backend/migrations/001_schema.sql'), 'utf8');
const parser = new Engine({ parser: { phpVersion: '8.2', suppressErrors: false }, ast: { withPositions: true } });
const ast = parser.parseCode(php, 'backend/src/router.php');

function phpValue(node) {
  if (!node) return null;
  if (node.kind === 'string') return node.value;
  if (node.kind === 'array') {
    const items = node.items.map((item) => [item.key ? phpValue(item.key) : null, phpValue(item.value)]);
    return items.every(([key]) => key === null)
      ? items.map(([, value]) => value)
      : Object.fromEntries(items.map(([key, value]) => [String(key), value]));
  }
  return null;
}

const resourceFunction = ast.children.find((node) => node.kind === 'function' && node.name.name === 'app_resource_map');
assert.ok(resourceFunction, 'app_resource_map exists');
const resourceReturn = resourceFunction.body.children.find((node) => node.kind === 'return');
const resources = phpValue(resourceReturn?.expr);
assert.ok(resources && typeof resources === 'object', 'app_resource_map returns a literal array');

const tables = new Map();
for (const match of schema.matchAll(/CREATE TABLE IF NOT EXISTS ([a-z_]+)\s*\(([\s\S]*?)\) ENGINE=/gi)) {
  const [, name, body] = match;
  const columns = new Map();
  for (const line of body.split('\n')) {
    const column = line.match(/^\s*([a-z_][a-z0-9_]*)\s+([a-z]+)(?:\((\d+)\))?/i);
    if (column) columns.set(column[1], { type: column[2].toUpperCase(), width: column[3] ? Number(column[3]) : null });
  }
  tables.set(name, columns);
}

function assertColumn(tableName, columnName, validatorType, context) {
  const column = tables.get(tableName)?.get(columnName);
  assert.ok(column, `${context}: ${tableName}.${columnName} exists in SQL schema`);
  const textWidth = validatorType.match(/^text_(\d+)$/)?.[1];
  if (textWidth) {
    assert.equal(column.type, 'VARCHAR', `${context}: ${tableName}.${columnName} is VARCHAR`);
    assert.equal(column.width, Number(textWidth), `${context}: PHP text limit matches ${tableName}.${columnName}`);
    assert.match(php, /preg_match\('\/\^text_\(\\d\+\)\$\/',\s*\$type,\s*\$matches\)\)\s*return app_safe_text\(\$value \?\? '', \(int\) \$matches\[1\]\)/, `text_${textWidth} has a matching validator`);
    return;
  }
  switch (validatorType) {
    case 'slug':
      assert.deepEqual(column, { type: 'VARCHAR', width: 120 }, `${context}: slug uses VARCHAR(120)`);
      break;
    case 'email':
      assert.deepEqual(column, { type: 'VARCHAR', width: 254 }, `${context}: email uses VARCHAR(254)`);
      break;
    case 'url':
    case 'asset_url':
      assert.deepEqual(column, { type: 'VARCHAR', width: 1000 }, `${context}: URL uses VARCHAR(1000)`);
      break;
    case 'long_text':
      assert.ok(column.type === 'TEXT' || column.type === 'LONGTEXT', `${context}: long text uses TEXT/LONGTEXT`);
      assert.match(php, /'long_text'\s*=>\s*app_safe_text\(\$value\s*\?\?\s*'',\s*12000\)/, 'long text validator is bounded to 12,000 characters');
      break;
    case 'json_array':
      assert.equal(column.type, 'JSON', `${context}: JSON array is stored as JSON`);
      break;
    case 'status':
      assert.equal(column.type, 'ENUM', `${context}: status uses an SQL enum`);
      break;
    case 'bool':
      assert.equal(column.type, 'TINYINT', `${context}: boolean uses TINYINT`);
      break;
    case 'int':
      assert.equal(column.type, 'INT', `${context}: order uses INT`);
      break;
    case 'nullable_id':
      assert.ok(column.type === 'BIGINT' || column.type === 'TINYINT', `${context}: nullable id uses an integer ID type`);
      break;
    case 'datetime':
      assert.equal(column.type, 'DATETIME', `${context}: datetime uses DATETIME`);
      break;
    default:
      assert.fail(`${context}: no schema assertion exists for validator ${validatorType}`);
  }
}

for (const [resource, spec] of Object.entries(resources)) {
  for (const [field, type] of Object.entries(spec.base_fields)) {
    assertColumn(spec.table, field, type, `${resource} base field ${field}`);
  }
  for (const [field, type] of Object.entries(spec.translation_fields)) {
    assertColumn(spec.translation_table, field === 'details' ? 'details_json' : field, type, `${resource} translation field ${field}`);
  }
}

const profileFunction = ast.children.find((node) => node.kind === 'function' && node.name.name === 'app_save_profile');
assert.ok(profileFunction, 'app_save_profile exists');
const profileSource = php.slice(profileFunction.loc.start.offset, profileFunction.loc.end.offset);
assert.match(profileSource, /\$baseFields\s*=\s*\['email'\s*=>\s*'email',\s*'github_url'\s*=>\s*'url',\s*'linkedin_url'\s*=>\s*'url',\s*'portrait_url'\s*=>\s*'asset_url',\s*'portrait_media_id'\s*=>\s*'nullable_id'\]/);
assert.match(profileSource, /'name'\s*=>\s*'text_200'.*'role'\s*=>\s*'text_300'.*'hero_greeting'\s*=>\s*'text_300'.*'statement'\s*=>\s*'text_600'.*'about'\s*=>\s*'long_text'.*'seo_title'\s*=>\s*'text_300'.*'seo_description'\s*=>\s*'text_500'/s);
for (const [field, type] of Object.entries({ email: 'email', github_url: 'url', linkedin_url: 'url', portrait_url: 'asset_url', portrait_media_id: 'nullable_id' })) {
  assertColumn('profile', field, type, `profile base field ${field}`);
}
for (const [field, type] of Object.entries({ name: 'text_200', role: 'text_300', hero_greeting: 'text_300', statement: 'text_600', about: 'long_text', seo_title: 'text_300', seo_description: 'text_500' })) {
  assertColumn('profile_translations', field, type, `profile translation field ${field}`);
}

const expertise = resources.expertise;
assert.equal(expertise.translation_fields.title, 'text_220');
console.log(`Schema field limits match PHP validation for ${Object.keys(resources).length} CMS resources and the profile.`);
