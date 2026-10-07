import { Router, Request, Response } from 'express';
import { db } from '../db/database.js';

const router = Router();

// Dynamic sitemap.xml
router.get('/sitemap.xml', (_req: Request, res: Response) => {
  const data = db.getPortfolio();
  const baseUrl = data.settings.canonicalUrl || 'https://santosh-mishra.dev';
  const lastMod = new Date().toISOString().split('T')[0];

  const projectUrls = data.projects
    .filter(p => p.isVisible)
    .map(p => `  <url>
    <loc>${baseUrl}/#projects</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
${projectUrls}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.send(xml);
});

// Dynamic robots.txt
router.get('/robots.txt', (_req: Request, res: Response) => {
  const data = db.getPortfolio();
  const baseUrl = data.settings.canonicalUrl || 'https://santosh-mishra.dev';
  const txt = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/admin/

Sitemap: ${baseUrl}/sitemap.xml
`;
  res.setHeader('Content-Type', 'text/plain');
  res.send(txt);
});

export default router;
