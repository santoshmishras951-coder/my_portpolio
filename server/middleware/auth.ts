import { Request, Response, NextFunction } from 'express';
import crypto from 'node:crypto';
import { db } from '../db/database.js';

export interface AuthRequest extends Request {
  user?: {
    username: string;
    email: string;
  };
}

interface TokenPayload {
  username: string;
  email: string;
  exp: number;
}

export function generateToken(username: string, email: string): string {
  const secret = db.getJwtSecret();
  const exp = Math.floor(Date.now() / 1000) + (24 * 60 * 60); // 24 hours
  const payload: TokenPayload = { username, email, exp };
  
  const headerStr = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${headerStr}.${payloadStr}`)
    .digest('base64url');

  return `${headerStr}.${payloadStr}.${signature}`;
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [headerStr, payloadStr, signature] = parts;
    const secret = db.getJwtSecret();

    const expectedSig = crypto
      .createHmac('sha256', secret)
      .update(`${headerStr}.${payloadStr}`)
      .digest('base64url');

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
      return null;
    }

    const payload: TokenPayload = JSON.parse(Buffer.from(payloadStr, 'base64url').toString('utf-8'));
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }

    return payload;
  } catch {
    return null;
  }
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Missing or malformed authorization token' });
    return;
  }

  const token = authHeader.substring(7).trim();
  const payload = verifyToken(token);

  if (!payload) {
    res.status(401).json({ error: 'Unauthorized: Session invalid or expired. Please sign in again.' });
    return;
  }

  req.user = {
    username: payload.username,
    email: payload.email
  };
  next();
}
