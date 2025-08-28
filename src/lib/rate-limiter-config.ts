export const RATE_LIMIT_CONFIG = {
  // OpenAI API rate limiting
  openai: {
    maxRequests: 10, // Maximum requests per window
    windowMs: 60 * 1000, // Time window in milliseconds (1 minute)
    message: "OpenAI API rate limit exceeded. Please try again later.",
  },

  // General API rate limiting (if needed for other endpoints)
  general: {
    maxRequests: 100, // Maximum requests per window
    windowMs: 60 * 1000, // Time window in milliseconds (1 minute)
    message: "Rate limit exceeded. Please try again later.",
  },

  // Burst protection
  burst: {
    maxRequests: 3, // Maximum requests in burst
    windowMs: 10 * 1000, // Time window in milliseconds (10 seconds)
    message: "Too many requests too quickly. Please slow down.",
  },
};

export const getRateLimitHeaders = (
  identifier: string,
  rateLimiter: {
    maxRequests: number;
    windowMs: number;
    getRemainingRequests: (id: string) => number;
    getResetTime: (id: string) => number;
  }
) => {
  return {
    "X-RateLimit-Limit": rateLimiter.maxRequests.toString(),
    "X-RateLimit-Remaining": rateLimiter
      .getRemainingRequests(identifier)
      .toString(),
    "X-RateLimit-Reset": rateLimiter.getResetTime(identifier).toString(),
    "X-RateLimit-Window": (rateLimiter.windowMs / 1000).toString(),
  };
};
