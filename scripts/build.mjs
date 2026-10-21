// Builds the static site into dist/.
//   node scripts/build.mjs            preview build (placeholders allowed, listed as warnings)
//   node scripts/build.mjs --release  release build (fails while any placeholder remains)

import { createHash } from 'node:crypto';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadContent, validateContent } from '../src/content.mjs';
import { renderIndex, renderNotFound } from '../src/render.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

export async function build({ release = false, contentPath = join(root, 'content/site.json'), outDir = join(root, 'dist') } = {}) {
  const content = await loadContent(contentPath);
  const result = validateContent(content, { release });
  if (result.errors.length > 0) return { ok: false, ...result };

  const css = await readFile(join(root, 'src/styles.css'), 'utf8');
  const hash = createHash('sha256').update(css).digest('hex').slice(0, 10);
  const stylesheet = `/assets/styles.${hash}.css`;

  await rm(outDir, { recursive: true, force: true });
  await mkdir(join(outDir, 'assets'), { recursive: true });
  await writeFile(join(outDir, stylesheet), css);
  await writeFile(join(outDir, 'index.html'), renderIndex(content, { stylesheet }));
  await writeFile(join(outDir, '404.html'), renderNotFound(content, { stylesheet }));
  return { ok: true, ...result };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const release = process.argv.includes('--release');
  const result = await build({ release });
  for (const warning of result.warnings) console.warn(`warning: ${warning}`);
  if (result.placeholders.length > 0) {
    console.warn('Content still needed:');
    for (const { path, value } of result.placeholders) console.warn(`  ${path}: ${value}`);
  }
  if (!result.ok) {
    for (const error of result.errors) console.error(`error: ${error}`);
    console.error(`Build failed (${release ? 'release' : 'preview'}).`);
    process.exit(1);
  }
  console.log(`Built dist/ (${release ? 'release' : 'preview'} build).`);
}
