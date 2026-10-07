import { Request, Response, NextFunction } from 'express';

interface AttemptRecord {
  count: number;
  resetAt: number;
}

const loginAttempts = new Map<string, AttemptRecord>();
const contactAttempts = new Map<string, AttemptRecord>();

function cleanMap(map: Map<string, AttemptRecord>): void {
  const now = Date.now();
  for (const [key, value] of map.entries()) {
    if (value.resetAt < now) {
      map.delete(key);
    }
  }
}

// Clean up old entries every 5 minutes
setInterval(() => {
  cleanMap(loginAttempts);
  cleanMap(contactAttempts);
}, 5 * 60 * 1000);

export function loginRateLimiter(req: Request, res: Response, next: NextFunction): void {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (record && record.resetAt > now) {
    if (record.count >= 5) {
      const waitSeconds = Math.ceil((record.resetAt - now) / 1000);
      res.status(429).json({
        error: `Too many login attempts. For security, please wait ${waitSeconds} seconds before trying again.`
      });
      return;
    }
    record.count++;
  } else {
    loginAttempts.set(ip, { count: 1, resetAt: now + (15 * 60 * 1000) }); // 15 mins
  }

  next();
}

export function resetLoginAttempts(ip: string): void {
  loginAttempts.delete(ip);
}

export function contactRateLimiter(req: Request, res: Response, next: NextFunction): void {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const record = contactAttempts.get(ip);

  if (record && record.resetAt > now) {
    if (record.count >= 6) {
      const waitSeconds = Math.ceil((record.resetAt - now) / 1000);
      res.status(429).json({
        error: `Submission limit reached. Please wait ${waitSeconds} seconds before sending another message.`
      });
      return;
    }
    record.count++;
  } else {
    contactAttempts.set(ip, { count: 1, resetAt: now + (60 * 60 * 1000) }); // 1 hour
  }

  next();
}
