import { Router, Response } from 'express';
import crypto from 'node:crypto';
import path from 'node:path';
import fs from 'node:fs';
import { db } from '../db/database.js';
import { requireAuth, AuthRequest } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { MediaItem } from '../../src/types/portfolio.js';

const router = Router();

// Admin: Upload file
router.post('/upload', requireAuth, upload.single('file'), (req: AuthRequest, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded or file format was rejected.' });
    return;
  }

  const mediaItem: MediaItem = {
    id: `med-${crypto.randomBytes(6).toString('hex')}`,
    name: req.body.title || req.file.originalname,
    originalName: req.file.originalname,
    url: `/uploads/${req.file.filename}`,
    mimeType: req.file.mimetype,
    size: req.file.size,
    uploadedAt: new Date().toISOString()
  };

  db.updatePortfolio(current => ({
    ...current,
    media: [mediaItem, ...current.media]
  }));

  res.status(201).json({
    success: true,
    file: mediaItem
  });
});

// Admin: List media library
router.get('/', requireAuth, (_req: AuthRequest, res: Response) => {
  const data = db.getPortfolio();
  res.json(data.media || []);
});

// Admin: Delete media item
router.delete('/:id', requireAuth, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const data = db.getPortfolio();
  const item = data.media.find(m => m.id === id);

  if (item && item.url.startsWith('/uploads/')) {
    const filename = path.basename(item.url);
    const filePath = path.resolve(process.cwd(), 'uploads', filename);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.warn('Could not delete physical file', err);
      }
    }
  }

  db.updatePortfolio(current => ({
    ...current,
    media: current.media.filter(m => m.id !== id)
  }));

  res.json({ success: true, message: 'Media item deleted.' });
});

export default router;
