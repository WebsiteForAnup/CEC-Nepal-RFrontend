const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://cecnepal.com.np';

// Define static routes
const staticRoutes = [
  '/',
  '/news',
  '/gallery',
  '/downloads',
  '/terms',
  '/privacy',
  '/team',
  '/careers'
];

const urls = [...staticRoutes];

// Load dynamic routes
try {
  const feedPath = path.join(__dirname, 'src/data/collections/news-events/feed.json');
  if (fs.existsSync(feedPath)) {
    const feed = JSON.parse(fs.readFileSync(feedPath, 'utf8'));
    const news = feed.newsAndEvents || [];
    news.forEach(item => {
      if (item.slug) urls.push(`/news-event/${item.slug}`);
    });
  }
} catch (e) {
  console.error('Error loading news routes:', e);
}

try {
  const servicesPath = path.join(__dirname, 'src/data/collections/services.json');
  if (fs.existsSync(servicesPath)) {
    const data = JSON.parse(fs.readFileSync(servicesPath, 'utf8'));
    const services = data.services || [];
    services.forEach(item => {
      if (item.slug) urls.push(`/service/${item.slug}`);
    });
  }
} catch (e) {
  console.error('Error loading services routes:', e);
}

try {
  const projectsPath = path.join(__dirname, 'src/data/collections/projects.json');
  if (fs.existsSync(projectsPath)) {
    const data = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));
    const projects = data.projects || [];
    projects.forEach(item => {
      if (item.slug) urls.push(`/project/${item.slug}`);
    });
  }
} catch (e) {
  console.error('Error loading projects routes:', e);
}

// Generate sitemap XML
const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${DOMAIN}${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>${url === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;

const outputPath = path.join(__dirname, 'public/sitemap.xml');
fs.writeFileSync(outputPath, sitemapContent, 'utf8');
console.log(`Successfully generated sitemap with ${urls.length} URLs at ${outputPath}`);
