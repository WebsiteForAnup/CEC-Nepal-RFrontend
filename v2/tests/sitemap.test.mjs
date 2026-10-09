import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { generateSitemap, generateRobots, siteOrigin, resolveSiteOrigin } from '../sitemap.mjs';

test('sitemap reflects additions, edits and deletions on the next request', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'cec-sitemap-'));
  try {
    const collections = path.join(root, 'src/data/collections');
    await mkdir(path.join(collections, 'news-events'), { recursive: true });
    await writeFile(path.join(collections, 'services.json'), JSON.stringify({ services: [{ slug: 'design' }, { slug: 'design' }] }));
    await writeFile(path.join(collections, 'projects.json'), JSON.stringify({ projects: [{ slug: 'river & dam' }] }));
    const feed = path.join(collections, 'news-events/feed.json');
    await writeFile(feed, JSON.stringify({ newsAndEvents: [{ slug: 'old', date: '2026-01-01' }, { slug: 'demo', isDemo: true }] }));
    const first = await generateSitemap(root, 'https://example.com');
    assert.match(first, /river%20%26%20dam/);
    assert.equal((first.match(/\/service\/design/g) || []).length, 1);
    assert.doesNotMatch(first, /demo|lastmod|\/admin|\/auth|\/account/);
    await writeFile(feed, JSON.stringify({ newsAndEvents: [{ slug: 'new', updated_at: '2026-10-09' }] }));
    const second = await generateSitemap(root, 'https://example.com');
    assert.match(second, /\/news-event\/new/);
    assert.match(second, /<lastmod>2026-10-09T00:00:00.000Z<\/lastmod>/);
    assert.doesNotMatch(second, /\/news-event\/old/);
    await writeFile(feed, 'invalid');
    await assert.rejects(generateSitemap(root, 'https://example.com'));
  } finally { await rm(root, { recursive: true, force: true }); }
});

test('canonical origin and robots do not depend on incoming host headers', () => {
  assert.equal(siteOrigin('https://example.com/'), 'https://example.com');
  for (const url of ['https://example.com/path', 'https://user:pass@example.com', 'file:///tmp']) assert.throws(() => siteOrigin(url));
  assert.match(generateRobots('https://example.com'), /Sitemap: https:\/\/example.com\/sitemap.xml/);
});

test('SITE_URL edits are reflected without restarting and external environment wins', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'cec-origin-'));
  try {
    assert.equal(await resolveSiteOrigin(root, { port: 3098 }), 'http://localhost:3098');
    const envFile = path.join(root, '.env');
    await writeFile(envFile, 'PORT=3098\nSITE_URL=\n');
    assert.equal(await resolveSiteOrigin(root, { port: 3098 }), 'http://localhost:3098');
    await writeFile(envFile, 'SITE_URL="   "\n');
    assert.equal(await resolveSiteOrigin(root, { environmentUrl: '   ', port: 3098 }), 'http://localhost:3098');
    await writeFile(envFile, 'SITE_URL=https://first.example\n');
    assert.equal(await resolveSiteOrigin(root), 'https://first.example');
    await writeFile(envFile, 'SITE_URL="http://localhost:3001"\n');
    assert.equal(await resolveSiteOrigin(root), 'http://localhost:3001');
    assert.equal(await resolveSiteOrigin(root, { environmentUrl: 'https://external.example' }), 'https://external.example');
    await writeFile(envFile, 'SITE_URL=\n');
    assert.equal(await resolveSiteOrigin(root, { port: 3098 }), 'http://localhost:3098');
  } finally { await rm(root, { recursive: true, force: true }); }
});
