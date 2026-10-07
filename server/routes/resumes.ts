import { Router, Request, Response } from 'express';
import crypto from 'node:crypto';
import path from 'node:path';
import fs from 'node:fs';
import { db } from '../db/database.js';
import { requireAuth, AuthRequest } from '../middleware/auth.js';
import { ResumeItem } from '../../src/types/portfolio.js';

const router = Router();

// Public: Get current active resume
router.get('/', (_req: Request, res: Response) => {
  const data = db.getPortfolio();
  const current = data.resumes.find(r => r.isCurrent) || data.resumes[0] || null;
  res.json({
    current,
    allowDownload: data.settings.allowPublicResumeDownload
  });
});

// Admin: Get all resume versions
router.get('/all', requireAuth, (_req: AuthRequest, res: Response) => {
  const data = db.getPortfolio();
  res.json(data.resumes);
});

// Admin: Add/Register new resume
router.post('/', requireAuth, (req: AuthRequest, res: Response) => {
  const { title, fileUrl, fileName, fileSize, version, isCurrent } = req.body;

  if (!title || !fileUrl) {
    res.status(400).json({ error: 'Title and file URL are required.' });
    return;
  }

  const newResume: ResumeItem = {
    id: `res-${crypto.randomBytes(6).toString('hex')}`,
    title: String(title).trim(),
    fileUrl: String(fileUrl).trim(),
    fileName: fileName || 'resume.pdf',
    fileSize: fileSize || '150 KB',
    uploadDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    version: version || `v${Date.now().toString().slice(-4)}`,
    isCurrent: Boolean(isCurrent)
  };

  db.updatePortfolio(current => {
    let resumes = [...current.resumes];
    if (newResume.isCurrent) {
      resumes = resumes.map(r => ({ ...r, isCurrent: false }));
    }
    resumes.unshift(newResume);
    return { ...current, resumes };
  });

  res.status(201).json(newResume);
});

// Admin: Mark resume as current
router.put('/:id/current', requireAuth, (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  db.updatePortfolio(current => ({
    ...current,
    resumes: current.resumes.map(r => ({
      ...r,
      isCurrent: r.id === id
    }))
  }));

  res.json({ success: true, message: 'Active resume updated.' });
});

// Admin: Delete resume
router.delete('/:id', requireAuth, (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  db.updatePortfolio(current => {
    const remaining = current.resumes.filter(r => r.id !== id);
    if (remaining.length > 0 && !remaining.some(r => r.isCurrent)) {
      remaining[0].isCurrent = true;
    }
    return { ...current, resumes: remaining };
  });

  res.json({ success: true, message: 'Resume deleted successfully.' });
});

// Public: Download Resume route
router.get('/download', (_req: Request, res: Response) => {
  const data = db.getPortfolio();
  if (!data.settings.allowPublicResumeDownload) {
    res.status(403).json({ error: 'Public resume download is currently disabled by administrator.' });
    return;
  }

  const currentResume = data.resumes.find(r => r.isCurrent) || data.resumes[0];

  // If a physical file exists in uploads or custom path
  if (currentResume && currentResume.fileUrl.startsWith('/uploads/')) {
    const filename = path.basename(currentResume.fileUrl);
    const filePath = path.resolve(process.cwd(), 'uploads', filename);
    if (fs.existsSync(filePath)) {
      res.download(filePath, currentResume.fileName || 'Santosh_Mishra_Resume.pdf');
      return;
    }
  }

  // Fallback: Generate clean, professional PDF for Santosh Mishra dynamically
  const p = data.profile;
  const skillsList = data.skills.filter(s => s.isVisible).map(s => s.name).join(', ');
  const projectsList = data.projects.filter(p => p.isVisible).slice(0, 3).map(p => `• ${p.title}: ${p.shortDescription}`).join('\n\n');
  const edu = data.education[0];

  const resumeText = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 1200 >>
stream
BT
/F1 18 Tf
50 740 Td
(${p.name} - Software Engineer) Tj
/F1 10 Tf
0 -18 Td
(${p.location} | ${p.email} | ${p.phone || ''} | ${p.currentStatus}) Tj
0 -25 Td
/F1 12 Tf
(CAREER OBJECTIVE) Tj
/F1 10 Tf
0 -14 Td
(${p.headline}) Tj
0 -14 Td
(${p.subheadline}) Tj
0 -25 Td
/F1 12 Tf
(EDUCATION) Tj
/F1 10 Tf
0 -14 Td
(${edu ? `${edu.degree} - ${edu.institution} (${edu.startYear} - ${edu.endYear}) [CGPA: ${edu.grade || 'N/A'}]` : 'B.Tech in Computer Science & Engineering'}) Tj
0 -25 Td
/F1 12 Tf
(CORE TECHNICAL SKILLS) Tj
/F1 10 Tf
0 -14 Td
(${skillsList}) Tj
0 -25 Td
/F1 12 Tf
(NOTABLE SOFTWARE PROJECTS) Tj
/F1 10 Tf
0 -14 Td
(1. Kaniha Medical: Clinic & Health Inventory Management System - React, Node.js, Express, PostgreSQL) Tj
0 -14 Td
(2. TechGrads: Engineering Placement Readiness Portal - React, Node.js, MongoDB, REST APIs) Tj
0 -14 Td
(3. CraftOdisha: AI-Assisted Artisan Marketplace - React, TypeScript, Firestore, Node.js) Tj
0 -14 Td
(4. Personal Developer Portfolio & CMS: Dynamic Headless Architecture - React, TypeScript, Express) Tj
0 -25 Td
/F1 12 Tf
(STATUS & AVAILABILITY) Tj
/F1 10 Tf
0 -14 Td
(${p.availabilityStatus}) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000060 00000 n 
0000000117 00000 n 
0000000244 00000 n 
0000001500 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
1590
%%EOF`;

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="Santosh_Mishra_Resume.pdf"');
  res.send(Buffer.from(resumeText, 'binary'));
});

export default router;
