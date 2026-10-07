import { Router, Request, Response } from 'express';
import { db } from '../db/database.js';
import { generateToken, requireAuth, AuthRequest } from '../middleware/auth.js';
import { loginRateLimiter, resetLoginAttempts } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/login', loginRateLimiter, (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: 'Username/email and password are required.' });
    return;
  }

  const auth = db.getAuth();
  const lowerUser = username.trim().toLowerCase();
  const isMatchUsername = lowerUser === auth.username.toLowerCase() || 
                          lowerUser === auth.email.toLowerCase() || 
                          lowerUser === 'santoshmishras951@gmail.com' || 
                          lowerUser === 'admin';

  if (!isMatchUsername || !db.verifyPassword(password.trim())) {
    res.status(401).json({ error: 'Invalid username/email or password.' });
    return;
  }

  // Success
  resetLoginAttempts(req.ip || req.socket.remoteAddress || 'unknown');
  const token = generateToken(auth.username, auth.email);

  res.json({
    token,
    user: {
      username: auth.username,
      email: auth.email
    }
  });
});

router.get('/me', requireAuth, (req: AuthRequest, res: Response) => {
  const auth = db.getAuth();
  res.json({
    user: {
      username: auth.username,
      email: auth.email
    }
  });
});

router.post('/change-password', requireAuth, (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400).json({ error: 'Current password and new password are required.' });
    return;
  }

  if (newPassword.length < 8) {
    res.status(400).json({ error: 'New password must be at least 8 characters long.' });
    return;
  }

  if (!db.verifyPassword(currentPassword)) {
    res.status(401).json({ error: 'Current password is incorrect.' });
    return;
  }

  db.updatePassword(newPassword);
  res.json({ success: true, message: 'Password updated successfully.' });
});

router.post('/change-email', requireAuth, (req: AuthRequest, res: Response) => {
  const { newEmail } = req.body;
  if (!newEmail || !newEmail.includes('@')) {
    res.status(400).json({ error: 'A valid email address is required.' });
    return;
  }
  db.updateAdminEmail(newEmail);
  res.json({ success: true, message: 'Admin email updated successfully.' });
});

export default router;
