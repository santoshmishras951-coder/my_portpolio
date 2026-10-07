import { Router, Request, Response } from 'express';
import crypto from 'node:crypto';
import { db } from '../db/database.js';
import { requireAuth, AuthRequest } from '../middleware/auth.js';
import { Achievement } from '../../src/types/portfolio.js';

const router = Router();

// Public: Get all achievements
router.get('/', (_req: Request, res: Response) => {
  const data = db.getPortfolio();
  const sorted = [...data.achievements].sort((a, b) => a.displayOrder - b.displayOrder);
  res.json(sorted);
});

// Admin: Create achievement
router.post('/', requireAuth, (req: AuthRequest, res: Response) => {
  const { title, organization, date, description, certificateImage, verificationUrl, category, displayOrder } = req.body;

  if (!title || !organization) {
    res.status(400).json({ error: 'Title and organization are required.' });
    return;
  }

  const newAch: Achievement = {
    id: `ach-${crypto.randomBytes(6).toString('hex')}`,
    title: String(title).trim(),
    organization: String(organization).trim(),
    date: date || '',
    description: description || '',
    certificateImage: certificateImage || '',
    verificationUrl: verificationUrl || '',
    category: category || 'Hackathon',
    displayOrder: Number(displayOrder) || 99
  };

  db.updatePortfolio(current => ({
    ...current,
    achievements: [...current.achievements, newAch]
  }));

  res.status(201).json(newAch);
});

// Admin: Update achievement
router.put('/:id', requireAuth, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const updates: Partial<Achievement> = req.body;

  let found = false;
  const updated = db.updatePortfolio(current => ({
    ...current,
    achievements: current.achievements.map(ach => {
      if (ach.id === id) {
        found = true;
        return { ...ach, ...updates, id };
      }
      return ach;
    })
  }));

  if (!found) {
    res.status(404).json({ error: 'Achievement record not found.' });
    return;
  }

  res.json({ success: true, achievement: updated.achievements.find(a => a.id === id) });
});

// Admin: Delete achievement
router.delete('/:id', requireAuth, (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  db.updatePortfolio(current => ({
    ...current,
    achievements: current.achievements.filter(a => a.id !== id)
  }));

  res.json({ success: true, message: 'Achievement record deleted successfully.' });
});

export default router;
