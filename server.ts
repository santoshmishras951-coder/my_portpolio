import express, { Request, Response, NextFunction } from 'express';
import path from 'node:path';
import fs from 'node:fs';
import dotenv from 'dotenv';
import authRoutes from './server/routes/auth.js';
import profileRoutes from './server/routes/profile.js';
import skillsRoutes from './server/routes/skills.js';
import projectsRoutes from './server/routes/projects.js';
import experienceRoutes from './server/routes/experience.js';
import educationRoutes from './server/routes/education.js';
import achievementsRoutes from './server/routes/achievements.js';
import resumesRoutes from './server/routes/resumes.js';
import messagesRoutes from './server/routes/messages.js';
import socialsRoutes from './server/routes/socials.js';
import mediaRoutes from './server/routes/media.js';
import settingsRoutes from './server/routes/settings.js';
import seoRoutes from './server/routes/seo.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Security Headers
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// JSON and URL-encoded body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Ensure uploads folder exists
const uploadsDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Also serve src/assets/images and public statically if needed
const assetsDir = path.resolve(process.cwd(), 'src/assets/images');
if (fs.existsSync(assetsDir)) {
  app.use('/src/assets/images', express.static(assetsDir));
}
const publicDir = path.resolve(process.cwd(), 'public');
if (fs.existsSync(publicDir)) {
  app.use('/public', express.static(publicDir));
  app.use(express.static(publicDir));
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/achievements', achievementsRoutes);
app.use('/api/resumes', resumesRoutes);
app.use('/api/resume', resumesRoutes);
app.use('/api', messagesRoutes);
app.use('/api/socials', socialsRoutes);
app.use('/api/admin/media', mediaRoutes);
app.use('/api/settings', settingsRoutes);

// SEO endpoints (/sitemap.xml and /robots.txt)
app.use('/', seoRoutes);

// Global error handler for API
app.use('/api', (err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('API Error:', err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Internal server error occurred.'
  });
});

async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa'
    });
    
    // Mount Vite middlewares
    app.use(vite.middlewares);

    // Fallback to transformIndexHtml for SPA navigation
    app.use('*', async (req: Request, res: Response, next: NextFunction) => {
      const url = req.originalUrl;
      // Do not intercept API, uploads, or assets
      if (
        url.startsWith('/api') ||
        url.startsWith('/uploads') ||
        url.startsWith('/@') ||
        url.includes('.')
      ) {
        return next();
      }

      try {
        const indexPath = path.resolve(process.cwd(), 'index.html');
        let template = fs.readFileSync(indexPath, 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response, next: NextFunction) => {
      if (req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('/uploads')) {
        return next();
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[Server] Portfolio CMS running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
