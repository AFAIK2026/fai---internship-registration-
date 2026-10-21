// Minimal static server for local preview and tests. Serves dist/ and
// returns 404.html with status 404 for unknown paths, like a static host.

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { dirname, extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.json': 'application/json',
};

export function startServer({ dir, port = 0, host = '127.0.0.1' }) {
  const server = createServer(async (req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const relative = pathname.endsWith('/') ? `${pathname}index.html` : pathname;
    const file = normalize(join(dir, relative));
    if (!file.startsWith(dir + sep)) {
      res.writeHead(400).end();
      return;
    }
    try {
      const body = await readFile(file);
      res.writeHead(200, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream' });
      res.end(body);
    } catch {
      const body = await readFile(join(dir, '404.html'));
      res.writeHead(404, { 'Content-Type': TYPES['.html'] });
      res.end(body);
    }
  });
  return new Promise((resolve) => {
    server.listen(port, host, () => resolve(server));
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
  const port = Number(process.env.PORT ?? 4173);
  const server = await startServer({ dir, port });
  console.log(`Serving dist/ at http://127.0.0.1:${server.address().port}`);
}
