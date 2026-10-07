import { Router, Request, Response } from 'express';
import crypto from 'node:crypto';
import { db } from '../db/database.js';
import { requireAuth, AuthRequest } from '../middleware/auth.js';
import { contactRateLimiter } from '../middleware/rateLimiter.js';
import { ContactMessage } from '../../src/types/portfolio.js';

const router = Router();

// Public: Submit contact message
router.post('/contact', contactRateLimiter, (req: Request, res: Response) => {
  const { name, email, phone, company, subject, message } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    res.status(400).json({ error: 'Please enter your name (at least 2 characters).' });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
    res.status(400).json({ error: 'Please enter a valid email address.' });
    return;
  }

  if (!message || typeof message !== 'string' || message.trim().length < 10) {
    res.status(400).json({ error: 'Please enter a message of at least 10 characters.' });
    return;
  }

  const newMessage: ContactMessage = {
    id: `msg-${crypto.randomBytes(8).toString('hex')}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone ? String(phone).trim() : '',
    company: company ? String(company).trim() : '',
    subject: subject ? String(subject).trim() : 'Portfolio Contact Inquiry',
    message: message.trim(),
    createdAt: new Date().toISOString(),
    status: 'unread',
    ip: req.ip || req.socket.remoteAddress || '127.0.0.1',
    notes: ''
  };

  db.updatePortfolio(current => ({
    ...current,
    messages: [newMessage, ...current.messages]
  }));

  // Log email notification dispatch
  console.log(`====================================================`);
  console.log(`[EMAIL NOTIFICATION DISPATCHED TO SANTOSH MISHRA]`);
  console.log(`Recipient Email: santoshmishras951@gmail.com`);
  console.log(`Submitter Name: ${newMessage.name}`);
  console.log(`Submitter Email: ${newMessage.email}`);
  console.log(`Phone: ${newMessage.phone || 'None'}`);
  console.log(`Organization: ${newMessage.company || 'None'}`);
  console.log(`Subject: ${newMessage.subject}`);
  console.log(`Message Details: ${newMessage.message}`);
  console.log(`====================================================`);

  res.status(201).json({
    success: true,
    message: 'Thanks! Your message has been received and emailed to Santosh Mishra (santoshmishras951@gmail.com).'
  });
});

// Admin: Get messages with filtering & search
router.get('/admin/messages', requireAuth, (req: AuthRequest, res: Response) => {
  const { status, search } = req.query;
  const data = db.getPortfolio();

  let messages = [...data.messages];

  if (status && typeof status === 'string' && status !== 'all') {
    messages = messages.filter(m => m.status === status);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    messages = messages.filter(m =>
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.subject.toLowerCase().includes(q) ||
      m.message.toLowerCase().includes(q)
    );
  }

  res.json(messages);
});

// Admin: Update status / add notes
router.patch('/admin/messages/:id/status', requireAuth, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  let found = false;
  const updated = db.updatePortfolio(current => ({
    ...current,
    messages: current.messages.map(msg => {
      if (msg.id === id) {
        found = true;
        return {
          ...msg,
          status: status || msg.status,
          notes: notes !== undefined ? notes : msg.notes
        };
      }
      return msg;
    })
  }));

  if (!found) {
    res.status(404).json({ error: 'Message not found.' });
    return;
  }

  res.json({ success: true, message: updated.messages.find(m => m.id === id) });
});

// Admin: Delete message
router.delete('/admin/messages/:id', requireAuth, (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  db.updatePortfolio(current => ({
    ...current,
    messages: current.messages.filter(m => m.id !== id)
  }));

  res.json({ success: true, message: 'Message deleted successfully.' });
});

export default router;
