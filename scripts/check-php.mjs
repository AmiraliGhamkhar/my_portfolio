import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Engine from 'php-parser';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const parser = new Engine({
  parser: { phpVersion: '8.2', suppressErrors: false, extractDoc: true },
  ast: { withPositions: true },
});
const files = [];
async function walk(directory) {
  for (const item of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, item.name);
    if (item.isDirectory()) await walk(file);
    else if (file.endsWith('.php')) files.push(file);
  }
}
await walk(path.join(root, 'backend'));
files.push(path.join(root, 'public/api/index.php'));
let failed = false;
for (const file of files) {
  try {
    parser.parseCode(await readFile(file, 'utf8'), path.relative(root, file));
    console.log(`PHP syntax OK (parser): ${path.relative(root, file)}`);
  } catch (error) {
    failed = true;
    console.error(`PHP syntax error: ${path.relative(root, file)}\n${error.message}`);
  }
}
if (failed) process.exit(1);
console.log(`Parsed ${files.length} PHP files using php-parser (PHP 8.2 grammar).`);
