import { Router, Request, Response } from 'express';
import { db } from '../db/database.js';
import { requireAuth, AuthRequest } from '../middleware/auth.js';
import { SiteSettings } from '../../src/types/portfolio.js';

const router = Router();

// Public: Get site settings
router.get('/', (_req: Request, res: Response) => {
  const data = db.getPortfolio();
  const s = data.settings;
  // Return public safe view
  res.json({
    siteTitle: s.siteTitle,
    metaDescription: s.metaDescription,
    ogTitle: s.ogTitle,
    ogDescription: s.ogDescription,
    ogImage: s.ogImage,
    canonicalUrl: s.canonicalUrl,
    allowPublicResumeDownload: s.allowPublicResumeDownload,
    showAvailabilityBadge: s.showAvailabilityBadge,
    analyticsNoticeEnabled: s.analyticsNoticeEnabled,
    privacyPolicyContent: s.privacyPolicyContent
  });
});

// Admin: Get all settings
router.get('/all', requireAuth, (_req: AuthRequest, res: Response) => {
  const data = db.getPortfolio();
  res.json(data.settings);
});

// Admin: Update settings
router.put('/', requireAuth, (req: AuthRequest, res: Response) => {
  const updates: Partial<SiteSettings> = req.body;

  const updated = db.updatePortfolio(current => ({
    ...current,
    settings: {
      ...current.settings,
      ...updates
    }
  }));

  res.json({ success: true, settings: updated.settings });
});

export default router;
