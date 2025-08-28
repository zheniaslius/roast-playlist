import { RATE_LIMIT_CONFIG } from "./rate-limiter-config";

interface RateLimitInfo {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private limits: Map<string, RateLimitInfo> = new Map();
  public readonly maxRequests: number;
  public readonly windowMs: number;

  constructor(maxRequests: number = 10, windowMs: number = 60 * 1000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const limit = this.limits.get(identifier);

    if (!limit) {
      // First request
      this.limits.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      console.log(`[Rate Limiter] First request from ${identifier}, count: 1`);
      return true;
    }

    // Check if window has reset
    if (now > limit.resetTime) {
      this.limits.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      console.log(`[Rate Limiter] Window reset for ${identifier}, count: 1`);
      return true;
    }

    // Check if limit exceeded
    if (limit.count >= this.maxRequests) {
      console.log(
        `[Rate Limiter] Rate limit exceeded for ${identifier}, count: ${limit.count}/${this.maxRequests}`
      );
      return false;
    }

    // Increment count
    limit.count++;
    console.log(
      `[Rate Limiter] Request from ${identifier}, count: ${limit.count}/${this.maxRequests}`
    );
    return true;
  }

  getRemainingRequests(identifier: string): number {
    const limit = this.limits.get(identifier);
    if (!limit) {
      return this.maxRequests;
    }

    const now = Date.now();
    if (now > limit.resetTime) {
      return this.maxRequests;
    }

    return Math.max(0, this.maxRequests - limit.count);
  }

  getResetTime(identifier: string): number {
    const limit = this.limits.get(identifier);
    if (!limit) {
      return Date.now() + this.windowMs;
    }
    return limit.resetTime;
  }

  // Clean up expired entries periodically
  cleanup(): void {
    const now = Date.now();
    for (const [identifier, limit] of this.limits.entries()) {
      if (now > limit.resetTime) {
        this.limits.delete(identifier);
      }
    }
  }
}

// Create a global rate limiter instance for OpenAI API
export const openaiRateLimiter = new RateLimiter(
  RATE_LIMIT_CONFIG.openai.maxRequests,
  RATE_LIMIT_CONFIG.openai.windowMs
);

// Create a burst protection rate limiter
export const burstRateLimiter = new RateLimiter(
  RATE_LIMIT_CONFIG.burst.maxRequests,
  RATE_LIMIT_CONFIG.burst.windowMs
);

// Export the main rate limiter for backward compatibility
export const rateLimiter = openaiRateLimiter;

// Clean up expired entries every 5 minutes
setInterval(() => {
  openaiRateLimiter.cleanup();
  burstRateLimiter.cleanup();
}, 5 * 60 * 1000);

export default RateLimiter;
