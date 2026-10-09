import http from 'node:http';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { readFile, stat } from 'node:fs/promises';
import { generateSitemap, generateRobots, siteOrigin, resolveSiteOrigin } from './sitemap.mjs';
import { config as loadEnv } from 'dotenv';

const root = path.dirname(fileURLToPath(import.meta.url));
const environmentSiteUrl = process.env.SITE_URL;
loadEnv({ path: path.join(root, '.env'), quiet: true });
siteOrigin();
const production = process.argv.includes('--production');
let port = Number(process.env.PORT || 3001);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be an integer between 1 and 65535.');
}
const clientRoot = path.join(root, 'dist/client');
const server = http.createServer((req, res) => {
  const pathname = new URL(req.url || '/', 'http://localhost').pathname;
  if (pathname === '/sitemap.xml' || pathname === '/robots.txt') { void handle(req, res); return; }
  if (vite) vite.middlewares(req, res, () => { void handle(req, res); });
  else void handle(req, res);
});
const vite = production ? null : await (await import('vite')).createServer({
  root, configFile: path.join(root, 'vite.config.js'),
  server: { middlewareMode: true, hmr: { server } }, appType: 'custom',
});
const productionRender = production ? (await import(pathToFileURL(path.join(root, 'dist/server/entry-server.mjs')).href)).render : null;
const mime = { '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.html': 'text/html', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.pdf': 'application/pdf', '.woff2': 'font/woff2', '.geojson': 'application/geo+json' };
const escape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
async function handle(req, res) {
  try {
    if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405, { Allow: 'GET, HEAD' }); res.end(); return; }
    const url = req.url || '/';
    const pathname = decodeURIComponent(new URL(url, 'http://localhost').pathname);
    if (pathname === '/sitemap.xml' || pathname === '/robots.txt') {
      const canonicalOrigin = await resolveSiteOrigin(root, { environmentUrl: environmentSiteUrl, port });
      const body = pathname === '/sitemap.xml' ? await generateSitemap(root, canonicalOrigin) : generateRobots(canonicalOrigin);
      res.writeHead(200, { 'Content-Type': pathname === '/sitemap.xml' ? 'application/xml; charset=utf-8' : 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' });
      res.end(req.method === 'HEAD' ? undefined : body); return;
    }
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
async function listen() {
  for (let attempt = 0; ; attempt++) {
    try {
      await new Promise((resolve, reject) => {
        const onError = error => { server.off('listening', onListening); reject(error); };
        const onListening = () => { server.off('error', onError); resolve(); };
        server.once('error', onError);
        server.once('listening', onListening);
        server.listen(port, '127.0.0.1');
      });
      console.log('CEC Nepal SSR running at http://localhost:' + port);
      return;
    } catch (error) {
      if (error.code !== 'EADDRINUSE' || production || process.env.PORT || attempt >= 19 || port === 65535) throw error;
      console.log('Port ' + port + ' is already in use; trying ' + (port + 1) + '.');
      port++;
    }
  }
}
try { await listen(); } catch (error) {
  console.error('Unable to start CEC Nepal SSR: ' + (error.code === 'EADDRINUSE' ? 'port ' + port + ' is already in use.' : error.message));
  await vite?.close();
  process.exitCode = 1;
}
async function close() { await vite?.close(); server.close(() => process.exit(0)); }
process.on('SIGINT', close); process.on('SIGTERM', close);
