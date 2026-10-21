// Builds the static site into dist/.
//   node scripts/build.mjs            preview build (placeholders allowed, listed as warnings)
//   node scripts/build.mjs --release  release build (fails while any placeholder remains)
// BASE_PATH sets the URL path the site is served from (default "/"), e.g.
//   BASE_PATH=/fai---internship-registration-/ for a GitHub Pages project site.

import { createHash } from 'node:crypto';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadContent, validateContent } from '../src/content.mjs';
import { renderIndex, renderNotFound } from '../src/render.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

export function normalizeBase(value = '/') {
  const base = `/${value}/`.replace(/\/{2,}/g, '/');
  if (!/^\/([A-Za-z0-9._-]+\/)*$/.test(base)) throw new Error(`Invalid BASE_PATH: ${value}`);
  return base;
}

export async function build({
  release = false,
  contentPath = join(root, 'content/site.json'),
  outDir = join(root, 'dist'),
  base = normalizeBase(process.env.BASE_PATH),
} = {}) {
  const content = await loadContent(contentPath);
  const result = validateContent(content, { release });
  if (result.errors.length > 0) return { ok: false, ...result };

  const css = await readFile(join(root, 'src/styles.css'), 'utf8');
  const hash = createHash('sha256').update(css).digest('hex').slice(0, 10);
  const cssFile = `assets/styles.${hash}.css`;
  const stylesheet = `${base}${cssFile}`;

  await rm(outDir, { recursive: true, force: true });
  await mkdir(join(outDir, 'assets'), { recursive: true });
  await writeFile(join(outDir, cssFile), css);
  await writeFile(join(outDir, 'index.html'), renderIndex(content, { stylesheet, base }));
  await writeFile(join(outDir, '404.html'), renderNotFound(content, { stylesheet, base }));
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
  console.log(`Built dist/ (${release ? 'release' : 'preview'} build, base path ${normalizeBase(process.env.BASE_PATH)}).`);
}
