import { Router, Request, Response } from 'express';
import crypto from 'node:crypto';
import { db } from '../db/database.js';
import { requireAuth, AuthRequest } from '../middleware/auth.js';
import { Education } from '../../src/types/portfolio.js';

const router = Router();

// Public: Get all education items
router.get('/', (_req: Request, res: Response) => {
  const data = db.getPortfolio();
  const sorted = [...data.education].sort((a, b) => a.displayOrder - b.displayOrder);
  res.json(sorted);
});

// Admin: Create education
router.post('/', requireAuth, (req: AuthRequest, res: Response) => {
  const {
    institution,
    degree,
    field,
    startYear,
    endYear,
    currentStatus,
    grade,
    description,
    institutionLogo,
    certificateLink,
    displayOrder
  } = req.body;

  if (!institution || !degree || !startYear) {
    res.status(400).json({ error: 'Institution, degree, and start year are required.' });
    return;
  }

  const newEdu: Education = {
    id: `edu-${crypto.randomBytes(6).toString('hex')}`,
    institution: String(institution).trim(),
    degree: String(degree).trim(),
    field: field || '',
    startYear: String(startYear).trim(),
    endYear: endYear || '',
    currentStatus: currentStatus || '',
    grade: grade || '',
    description: description || '',
    institutionLogo: institutionLogo || '',
    certificateLink: certificateLink || '',
    displayOrder: Number(displayOrder) || 99
  };

  db.updatePortfolio(current => ({
    ...current,
    education: [...current.education, newEdu]
  }));

  res.status(201).json(newEdu);
});

// Admin: Update education
router.put('/:id', requireAuth, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const updates: Partial<Education> = req.body;

  let found = false;
  const updated = db.updatePortfolio(current => ({
    ...current,
    education: current.education.map(edu => {
      if (edu.id === id) {
        found = true;
        return { ...edu, ...updates, id };
      }
      return edu;
    })
  }));

  if (!found) {
    res.status(404).json({ error: 'Education record not found.' });
    return;
  }

  res.json({ success: true, education: updated.education.find(e => e.id === id) });
});

// Admin: Delete education
router.delete('/:id', requireAuth, (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  db.updatePortfolio(current => ({
    ...current,
    education: current.education.filter(e => e.id !== id)
  }));

  res.json({ success: true, message: 'Education record deleted successfully.' });
});

export default router;
