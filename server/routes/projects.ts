import { Router, Request, Response } from 'express';
import crypto from 'node:crypto';
import { db } from '../db/database.js';
import { requireAuth, AuthRequest } from '../middleware/auth.js';
import { Project } from '../../src/types/portfolio.js';

const router = Router();

// Public: Get visible projects (supports category filter)
router.get('/', (req: Request, res: Response) => {
  const { category, featured } = req.query;
  const data = db.getPortfolio();

  let projects = data.projects
    .filter(p => p.isVisible)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  if (category && typeof category === 'string' && category !== 'All') {
    projects = projects.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (featured === 'true') {
    projects = projects.filter(p => p.isFeatured);
  }

  res.json(projects);
});

// Public: Get single project by ID (including rich case study)
router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const data = db.getPortfolio();
  const project = data.projects.find(p => p.id === id);

  if (!project || (!project.isVisible && !req.headers.authorization)) {
    res.status(404).json({ error: 'Project not found.' });
    return;
  }

  res.json(project);
});

// Admin: Get all projects (including unlisted/draft)
router.get('/admin/all', requireAuth, (_req: AuthRequest, res: Response) => {
  const data = db.getPortfolio();
  const sorted = [...data.projects].sort((a, b) => a.displayOrder - b.displayOrder);
  res.json(sorted);
});

// Admin: Create project
router.post('/', requireAuth, (req: AuthRequest, res: Response) => {
  const {
    title,
    shortDescription,
    detailedDescription,
    category,
    projectImage,
    galleryImages,
    technologies,
    githubUrl,
    liveDemoUrl,
    caseStudyUrl,
    startDate,
    completionDate,
    isFeatured,
    displayOrder,
    challenges,
    solution,
    keyFeatures,
    myContribution,
    results,
    architectureExplanation,
    isVisible
  } = req.body;

  if (!title || !shortDescription) {
    res.status(400).json({ error: 'Project title and short description are required.' });
    return;
  }

  const newProject: Project = {
    id: `proj-${crypto.randomBytes(6).toString('hex')}`,
    title: String(title).trim(),
    shortDescription: String(shortDescription).trim(),
    detailedDescription: detailedDescription || shortDescription,
    category: category || 'Web Application',
    projectImage: projectImage || '',
    galleryImages: Array.isArray(galleryImages) ? galleryImages : [],
    technologies: Array.isArray(technologies) ? technologies : [],
    githubUrl: githubUrl || '',
    liveDemoUrl: liveDemoUrl || '',
    caseStudyUrl: caseStudyUrl || '',
    startDate: startDate || '',
    completionDate: completionDate || '',
    isFeatured: Boolean(isFeatured),
    displayOrder: Number(displayOrder) || 99,
    challenges: challenges || '',
    solution: solution || '',
    keyFeatures: Array.isArray(keyFeatures) ? keyFeatures : [],
    myContribution: myContribution || '',
    results: results || '',
    architectureExplanation: architectureExplanation || '',
    isVisible: isVisible !== false
  };

  db.updatePortfolio(current => ({
    ...current,
    projects: [...current.projects, newProject]
  }));

  res.status(201).json(newProject);
});

// Admin: Update project
router.put('/:id', requireAuth, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const updates: Partial<Project> = req.body;

  let found = false;
  const updated = db.updatePortfolio(current => ({
    ...current,
    projects: current.projects.map(proj => {
      if (proj.id === id) {
        found = true;
        return { ...proj, ...updates, id };
      }
      return proj;
    })
  }));

  if (!found) {
    res.status(404).json({ error: 'Project not found.' });
    return;
  }

  res.json({ success: true, project: updated.projects.find(p => p.id === id) });
});

// Admin: Delete project
router.delete('/:id', requireAuth, (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  db.updatePortfolio(current => ({
    ...current,
    projects: current.projects.filter(p => p.id !== id)
  }));

  res.json({ success: true, message: 'Project deleted successfully.' });
});

export default router;
