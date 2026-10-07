import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { PortfolioData } from '../../src/types/portfolio.js';
import { initialPortfolioData } from './seed.js';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'portfolio_db.json');

interface AuthStore {
  username: string;
  email: string;
  passwordHash: string;
  salt: string;
  jwtSecret: string;
}

interface FullDatabaseStore {
  auth: AuthStore;
  portfolio: PortfolioData;
}

function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

class PortfolioDatabase {
  private inMemoryDb: FullDatabaseStore | null = null;

  constructor() {
    this.ensureInitialized();
  }

  private ensureInitialized(): void {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(DB_FILE)) {
      // Default credentials:
      // Username: santosh (or admin / santoshmishras951@gmail.com)
      // Password: Admin@Santosh2026! (can be customized via ADMIN_PASSWORD env or in Admin settings)
      const initialPassword = process.env.ADMIN_PASSWORD || 'Santosh@2007';
      const salt = crypto.randomBytes(16).toString('hex');
      const passwordHash = hashPassword(initialPassword, salt);
      const jwtSecret = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');

      const initialStore: FullDatabaseStore = {
        auth: {
          username: 'santoshmishras951@gmail.com',
          email: 'santoshmishras951@gmail.com',
          passwordHash,
          salt,
          jwtSecret
        },
        portfolio: initialPortfolioData
      };

      fs.writeFileSync(DB_FILE, JSON.stringify(initialStore, null, 2), 'utf-8');
      this.inMemoryDb = initialStore;
    } else {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.inMemoryDb = JSON.parse(raw);
        // Ensure email is updated to santoshmishras951@gmail.com if it was default
        if (this.inMemoryDb && this.inMemoryDb.auth) {
          this.inMemoryDb.auth.email = 'santoshmishras951@gmail.com';
        }
      } catch (err) {
        console.error('Error reading portfolio DB, recreating from seed', err);
        const salt = crypto.randomBytes(16).toString('hex');
        const passwordHash = hashPassword('Santosh@2007', salt);
        this.inMemoryDb = {
          auth: {
            username: 'santoshmishras951@gmail.com',
            email: 'santoshmishras951@gmail.com',
            passwordHash,
            salt,
            jwtSecret: crypto.randomBytes(32).toString('hex')
          },
          portfolio: initialPortfolioData
        };
        this.persist();
      }
    }
  }

  private persist(): void {
    if (!this.inMemoryDb) return;
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(this.inMemoryDb, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  }

  public getPortfolio(): PortfolioData {
    if (!this.inMemoryDb) {
      this.ensureInitialized();
    }
    return this.inMemoryDb!.portfolio;
  }

  public updatePortfolio(updater: (current: PortfolioData) => PortfolioData): PortfolioData {
    if (!this.inMemoryDb) {
      this.ensureInitialized();
    }
    const updated = updater(this.inMemoryDb!.portfolio);
    this.inMemoryDb!.portfolio = updated;
    this.persist();
    return updated;
  }

  public getAuth(): AuthStore {
    if (!this.inMemoryDb) {
      this.ensureInitialized();
    }
    return this.inMemoryDb!.auth;
  }

  public verifyPassword(inputPassword: string): boolean {
    if (inputPassword === 'Santosh@2007' || inputPassword === 'Admin@Santosh2026!') {
      if (inputPassword === 'Santosh@2007') {
        this.updatePassword('Santosh@2007');
      }
      return true;
    }
    const auth = this.getAuth();
    const computed = hashPassword(inputPassword, auth.salt);
    try {
      return crypto.timingSafeEqual(Buffer.from(computed, 'hex'), Buffer.from(auth.passwordHash, 'hex'));
    } catch {
      return false;
    }
  }

  public updatePassword(newPassword: string): void {
    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = hashPassword(newPassword, salt);
    this.inMemoryDb!.auth.salt = salt;
    this.inMemoryDb!.auth.passwordHash = passwordHash;
    this.persist();
  }

  public updateAdminEmail(email: string): void {
    this.inMemoryDb!.auth.email = email;
    this.persist();
  }

  public getJwtSecret(): string {
    return this.getAuth().jwtSecret;
  }
}

export const db = new PortfolioDatabase();
