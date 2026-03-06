import { Request, Response, NextFunction } from 'express';
import { RateLimitError } from '../utils/errors';
import { logger } from '../utils/logger';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

export class RateLimiter {
  private store: RateLimitStore = {};
  private readonly windowMs: number;
  private readonly maxRequests: number;

  constructor(windowMs: number = 60000, maxRequests: number = 100) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;

    // Clean up expired entries every minute
    setInterval(() => this.cleanup(), 60000);
  }

  middleware() {
    return (req: Request, res: Response, next: NextFunction): void => {
      const key = this.getKey(req);
      const now = Date.now();
      
      if (!this.store[key]) {
        this.store[key] = {
          count: 1,
          resetTime: now + this.windowMs,
        };
        next();
        return;
      }

      const record = this.store[key];

      if (now > record.resetTime) {
        // Reset the window
        record.count = 1;
        record.resetTime = now + this.windowMs;
        next();
        return;
      }

      if (record.count >= this.maxRequests) {
        logger.warn('Rate limit exceeded', {
          key,
          count: record.count,
          maxRequests: this.maxRequests,
          ip: req.ip,
          userAgent: req.get('User-Agent'),
        });

        const resetTimeSeconds = Math.ceil((record.resetTime - now) / 1000);
        res.set({
          'X-RateLimit-Limit': this.maxRequests.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': resetTimeSeconds.toString(),
        });

        throw new RateLimitError(`Rate limit exceeded. Try again in ${resetTimeSeconds} seconds.`);
      }

      record.count++;
      
      res.set({
        'X-RateLimit-Limit': this.maxRequests.toString(),
        'X-RateLimit-Remaining': (this.maxRequests - record.count).toString(),
        'X-RateLimit-Reset': Math.ceil((record.resetTime - now) / 1000).toString(),
      });

      next();
    };
  }

  private getKey(req: Request): string {
    // Use IP address as the key for rate limiting
    return req.ip || 'unknown';
  }

  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, record] of Object.entries(this.store)) {
      if (now > record.resetTime) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => delete this.store[key]);

    if (keysToDelete.length > 0) {
      logger.debug(`Cleaned up ${keysToDelete.length} expired rate limit entries`);
    }
  }
}

export const rateLimiter = new RateLimiter();