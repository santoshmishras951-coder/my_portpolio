import { Router, Request, Response } from 'express';
import crypto from 'node:crypto';
import { db } from '../db/database.js';
import { requireAuth, AuthRequest } from '../middleware/auth.js';
import { Skill } from '../../src/types/portfolio.js';

const router = Router();

// Public: Get all visible skills
router.get('/', (_req: Request, res: Response) => {
  const data = db.getPortfolio();
  const visibleSkills = data.skills
    .filter(s => s.isVisible)
    .sort((a, b) => a.displayOrder - b.displayOrder);
  res.json(visibleSkills);
});

// Admin: Get all skills including hidden ones
router.get('/all', requireAuth, (_req: AuthRequest, res: Response) => {
  const data = db.getPortfolio();
  const sorted = [...data.skills].sort((a, b) => a.displayOrder - b.displayOrder);
  res.json(sorted);
});

// Admin: Create skill
router.post('/', requireAuth, (req: AuthRequest, res: Response) => {
  const { name, category, proficiency, yearsExperience, description, displayOrder, isVisible } = req.body;

  if (!name || !category) {
    res.status(400).json({ error: 'Skill name and category are required.' });
    return;
  }

  const newSkill: Skill = {
    id: `skill-${crypto.randomBytes(6).toString('hex')}`,
    name: String(name).trim(),
    category: category || 'Frontend',
    proficiency: proficiency || 'Intermediate',
    yearsExperience: yearsExperience || '',
    description: description || '',
    displayOrder: Number(displayOrder) || 99,
    isVisible: isVisible !== false
  };

  const updated = db.updatePortfolio(current => ({
    ...current,
    skills: [...current.skills, newSkill]
  }));

  res.status(201).json(newSkill);
});

// Admin: Update skill
router.put('/:id', requireAuth, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const updates: Partial<Skill> = req.body;

  let found = false;
  const updated = db.updatePortfolio(current => ({
    ...current,
    skills: current.skills.map(skill => {
      if (skill.id === id) {
        found = true;
        return { ...skill, ...updates, id };
      }
      return skill;
    })
  }));

  if (!found) {
    res.status(404).json({ error: 'Skill not found.' });
    return;
  }

  res.json({ success: true, skill: updated.skills.find(s => s.id === id) });
});

// Admin: Delete skill
router.delete('/:id', requireAuth, (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  db.updatePortfolio(current => ({
    ...current,
    skills: current.skills.filter(s => s.id !== id)
  }));

  res.json({ success: true, message: 'Skill deleted successfully.' });
});

export default router;
