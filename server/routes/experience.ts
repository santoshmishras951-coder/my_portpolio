import { Router, Request, Response } from 'express';
import crypto from 'node:crypto';
import { db } from '../db/database.js';
import { requireAuth, AuthRequest } from '../middleware/auth.js';
import { Experience } from '../../src/types/portfolio.js';

const router = Router();

// Public: Get all experience items
router.get('/', (_req: Request, res: Response) => {
  const data = db.getPortfolio();
  const sorted = [...data.experience].sort((a, b) => a.displayOrder - b.displayOrder);
  res.json(sorted);
});

// Admin: Create experience
router.post('/', requireAuth, (req: AuthRequest, res: Response) => {
  const {
    company,
    position,
    employmentType,
    location,
    startDate,
    endDate,
    currentlyWorking,
    description,
    responsibilities,
    achievements,
    technologies,
    companyLogo,
    companyUrl,
    displayOrder
  } = req.body;

  if (!company || !position || !startDate) {
    res.status(400).json({ error: 'Company, position, and start date are required.' });
    return;
  }

  const newExp: Experience = {
    id: `exp-${crypto.randomBytes(6).toString('hex')}`,
    company: String(company).trim(),
    position: String(position).trim(),
    employmentType: employmentType || 'Full-time',
    location: location || '',
    startDate: String(startDate).trim(),
    endDate: endDate || '',
    currentlyWorking: Boolean(currentlyWorking),
    description: description || '',
    responsibilities: Array.isArray(responsibilities) ? responsibilities : [],
    achievements: Array.isArray(achievements) ? achievements : [],
    technologies: Array.isArray(technologies) ? technologies : [],
    companyLogo: companyLogo || '',
    companyUrl: companyUrl || '',
    displayOrder: Number(displayOrder) || 99
  };

  db.updatePortfolio(current => ({
    ...current,
    experience: [...current.experience, newExp]
  }));

  res.status(201).json(newExp);
});

// Admin: Update experience
router.put('/:id', requireAuth, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const updates: Partial<Experience> = req.body;

  let found = false;
  const updated = db.updatePortfolio(current => ({
    ...current,
    experience: current.experience.map(exp => {
      if (exp.id === id) {
        found = true;
        return { ...exp, ...updates, id };
      }
      return exp;
    })
  }));

  if (!found) {
    res.status(404).json({ error: 'Experience record not found.' });
    return;
  }

  res.json({ success: true, experience: updated.experience.find(e => e.id === id) });
});

// Admin: Delete experience
router.delete('/:id', requireAuth, (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  db.updatePortfolio(current => ({
    ...current,
    experience: current.experience.filter(e => e.id !== id)
  }));

  res.json({ success: true, message: 'Experience record deleted successfully.' });
});

export default router;
