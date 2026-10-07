import { Router, Request, Response } from 'express';
import { db } from '../db/database.js';
import { upload } from '../middleware/upload.js';
import { Profile } from '../../src/types/portfolio.js';

const router = Router();

// Public: Get profile
router.get('/', (_req: Request, res: Response) => {
  const data = db.getPortfolio();
  res.json(data.profile);
});

// Update profile fields
router.put('/', (req: Request, res: Response) => {
  const updates: Partial<Profile> = req.body;
  if (!updates.name || !updates.headline) {
    res.status(400).json({ error: 'Name and professional headline are required.' });
    return;
  }

  const updated = db.updatePortfolio(current => ({
    ...current,
    profile: {
      ...current.profile,
      ...updates
    }
  }));

  res.json({ success: true, profile: updated.profile });
});

// Upload profile avatar
router.post('/avatar', upload.single('avatar'), (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: 'No image file uploaded or invalid file format.' });
    return;
  }

  const newAvatarUrl = `/uploads/${req.file.filename}`;

  const updated = db.updatePortfolio(current => ({
    ...current,
    profile: {
      ...current.profile,
      avatarUrl: newAvatarUrl
    }
  }));

  res.json({
    success: true,
    avatarUrl: newAvatarUrl,
    profile: updated.profile
  });
});

export default router;
