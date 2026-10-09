import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { parse } from 'dotenv';

const routes = ['/', '/about', '/company-profile', '/services', '/projects', '/team', '/news', '/gallery', '/downloads', '/careers', '/faq', '/contact', '/privacy', '/terms'];
const escapeXml = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');

export function siteOrigin(value = process.env.SITE_URL?.trim() || `http://localhost:${process.env.PORT || 3001}`) {
  const url = new URL(value);
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
    throw new Error('SITE_URL must be an HTTP(S) origin without a path or credentials.');
  }
  return url.origin;
}

export async function resolveSiteOrigin(root, { environmentUrl, port = 3001 } = {}) {
  if (environmentUrl?.trim()) return siteOrigin(environmentUrl.trim());
  let fileUrl;
  try {
    fileUrl = parse(await readFile(path.join(root, '.env'))).SITE_URL;
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  return siteOrigin(fileUrl?.trim() || `http://localhost:${port}`);
}

export async function generateSitemap(root, origin = siteOrigin()) {
  // Read each request, rather than importing cached or build-time JSON.
  const files = [
    ['services.json', 'services', '/service/'],
    ['projects.json', 'projects', '/project/'],
    ['news-events/feed.json', 'newsAndEvents', '/news-event/'],
  ];
  const entries = new Map(routes.map(route => [origin + route, '']));
  const collections = await Promise.all(files.map(async ([file, key, prefix]) => {
    const content = JSON.parse(await readFile(path.join(root, 'src/data/collections', file), 'utf8'));
    if (!Array.isArray(content[key])) throw new Error('Invalid sitemap collection: ' + file);
    return { items: content[key], prefix };
  }));
  for (const { items, prefix } of collections) {
    for (const item of items) {
      if (item.isDemo || typeof item.slug !== 'string' || !item.slug.trim()) continue;
      const loc = origin + prefix + encodeURIComponent(item.slug);
      const updated = item.updated_at || item.updatedAt || item.lastModified;
      // Event dates describe events, not edits. Never use generation time as lastmod.
      const lastmod = typeof updated === 'string' && /^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(updated) && Number.isFinite(Date.parse(updated))
        ? new Date(updated).toISOString() : '';
      entries.set(loc, lastmod);
    }
  }
  if (entries.size > 50000) throw new Error('Sitemap exceeds 50,000 URLs; split into a sitemap index.');
  return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    [...entries].map(([loc, lastmod]) => `  <url><loc>${escapeXml(loc)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`).join('\n') + '\n</urlset>\n';
}

export function generateRobots(origin = siteOrigin()) {
  return `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /auth\nDisallow: /account\n\nSitemap: ${origin}/sitemap.xml\n`;
}
