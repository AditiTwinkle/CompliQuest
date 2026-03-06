import { logger } from './logger';
import { config } from '../config/environment';

export interface RetryOptions {
  maxAttempts?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  backoffMultiplier?: number;
  jitterMs?: number;
}

export class RetryHandler {
  private readonly maxAttempts: number;
  private readonly baseDelayMs: number;
  private readonly maxDelayMs: number;
  private readonly backoffMultiplier: number;
  private readonly jitterMs: number;

  constructor(options: RetryOptions = {}) {
    this.maxAttempts = options.maxAttempts || config.scraping.maxRetryAttempts;
    this.baseDelayMs = options.baseDelayMs || config.scraping.retryBackoffMs;
    this.maxDelayMs = options.maxDelayMs || 30000; // 30 seconds max
    this.backoffMultiplier = options.backoffMultiplier || 2;
    this.jitterMs = options.jitterMs || 1000;
  }

  async executeWithRetry<T>(
    operation: () => Promise<T>,
    operationName: string = 'operation'
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= this.maxAttempts; attempt++) {
      try {
        logger.debug(`Executing ${operationName}, attempt ${attempt}/${this.maxAttempts}`);
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === this.maxAttempts) {
          logger.error(`${operationName} failed after ${this.maxAttempts} attempts`, {
            error: lastError.message,
            stack: lastError.stack,
          });
          break;
        }

        const delay = this.calculateDelay(attempt);
        logger.warn(`${operationName} failed on attempt ${attempt}, retrying in ${delay}ms`, {
          error: lastError.message,
          attempt,
          maxAttempts: this.maxAttempts,
        });

        await this.sleep(delay);
      }
    }

    throw lastError!;
  }

  private calculateDelay(attempt: number): number {
    const exponentialDelay = this.baseDelayMs * Math.pow(this.backoffMultiplier, attempt - 1);
    const jitter = Math.random() * this.jitterMs;
    return Math.min(exponentialDelay + jitter, this.maxDelayMs);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const defaultRetryHandler = new RetryHandler();