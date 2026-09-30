import http from 'node:http';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { readFile, stat } from 'node:fs/promises';

const root = path.dirname(fileURLToPath(import.meta.url));
const production = process.argv.includes('--production');
const port = Number(process.env.PORT || 3001);
const clientRoot = path.join(root, 'dist/client');
const vite = production ? null : await (await import('vite')).createServer({
  root, configFile: path.join(root, 'vite.config.js'),
  server: { middlewareMode: true, hmr: { port: port + 1 } }, appType: 'custom',
});
const productionRender = production ? (await import(pathToFileURL(path.join(root, 'dist/server/entry-server.mjs')).href)).render : null;
const mime = { '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.html': 'text/html', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.pdf': 'application/pdf', '.woff2': 'font/woff2', '.geojson': 'application/geo+json' };
const escape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
async function handle(req, res) {
  try {
    if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405, { Allow: 'GET, HEAD' }); res.end(); return; }
    const url = req.url || '/';
    const pathname = decodeURIComponent(new URL(url, 'http://localhost').pathname);
    if (production && pathname !== '/' && pathname !== '/index.html') {
      const file = path.resolve(clientRoot, '.' + pathname);
      if (file.startsWith(clientRoot + path.sep)) {
        try {
          if ((await stat(file)).isFile()) {
            res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' });
            res.end(req.method === 'HEAD' ? undefined : await readFile(file)); return;
          }
        } catch (error) { if (!['ENOENT', 'ENOTDIR'].includes(error.code)) throw error; }
      }
    }
    if (pathname.startsWith('/assets/') || /\.(png|jpe?g|webp|svg|ico|pdf|css|js|json|woff2)$/.test(pathname)) {
      res.writeHead(404); res.end('Not found'); return;
    }
    let template = await readFile(path.join(production ? clientRoot : root, 'index.html'), 'utf8');
    if (vite) template = await vite.transformIndexHtml(url, template);
    const render = productionRender || (await vite.ssrLoadModule('/src/entry-server.tsx')).render;
    const result = await render(url);
    const html = template.replace('<!--ssr-outlet-->', () => result.html).replace(/<title>.*?<\/title>/s, () => '<title>' + escape(result.title) + '</title>');
    res.writeHead(result.status, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(req.method === 'HEAD' ? undefined : html);
  } catch (error) {
    vite?.ssrFixStacktrace(error);
    console.error(error);
    res.writeHead(500, { 'Content-Type': 'text/plain' }); res.end('Unable to render this page.');
  }
}
const server = http.createServer((req, res) => {
  if (vite) vite.middlewares(req, res, () => { void handle(req, res); });
  else void handle(req, res);
});
server.listen(port, '127.0.0.1', () => console.log('CEC Nepal SSR running at http://localhost:' + port));
async function close() { await vite?.close(); server.close(() => process.exit(0)); }
process.on('SIGINT', close); process.on('SIGTERM', close);
