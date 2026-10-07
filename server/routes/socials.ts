import { Router, Request, Response } from 'express';
import crypto from 'node:crypto';
import { db } from '../db/database.js';
import { requireAuth, AuthRequest } from '../middleware/auth.js';
import { SocialLink } from '../../src/types/portfolio.js';

const router = Router();

// Public: Get visible social links
router.get('/', (_req: Request, res: Response) => {
  const data = db.getPortfolio();
  const visible = data.socialLinks
    .filter(s => s.isVisible)
    .sort((a, b) => a.displayOrder - b.displayOrder);
  res.json(visible);
});

// Admin: Get all social links
router.get('/all', requireAuth, (_req: AuthRequest, res: Response) => {
  const data = db.getPortfolio();
  const sorted = [...data.socialLinks].sort((a, b) => a.displayOrder - b.displayOrder);
  res.json(sorted);
});

// Admin: Create social link
router.post('/', requireAuth, (req: AuthRequest, res: Response) => {
  const { platform, url, iconName, displayName, isVisible, displayOrder } = req.body;

  if (!platform || !url) {
    res.status(400).json({ error: 'Platform and URL are required.' });
    return;
  }

  const newLink: SocialLink = {
    id: `soc-${crypto.randomBytes(6).toString('hex')}`,
    platform: String(platform).trim(),
    url: String(url).trim(),
    iconName: iconName || 'Globe',
    displayName: displayName || platform,
    isVisible: isVisible !== false,
    displayOrder: Number(displayOrder) || 99
  };

  db.updatePortfolio(current => ({
    ...current,
    socialLinks: [...current.socialLinks, newLink]
  }));

  res.status(201).json(newLink);
});

// Admin: Update social link
router.put('/:id', requireAuth, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const updates: Partial<SocialLink> = req.body;

  let found = false;
  const updated = db.updatePortfolio(current => ({
    ...current,
    socialLinks: current.socialLinks.map(link => {
      if (link.id === id) {
        found = true;
        return { ...link, ...updates, id };
      }
      return link;
    })
  }));

  if (!found) {
    res.status(404).json({ error: 'Social link not found.' });
    return;
  }

  res.json({ success: true, link: updated.socialLinks.find(s => s.id === id) });
});

// Admin: Delete social link
router.delete('/:id', requireAuth, (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  db.updatePortfolio(current => ({
    ...current,
    socialLinks: current.socialLinks.filter(s => s.id !== id)
  }));

  res.json({ success: true, message: 'Social link deleted successfully.' });
});

export default router;
