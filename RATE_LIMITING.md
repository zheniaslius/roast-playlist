# Rate Limiting System

This project includes a comprehensive rate limiting system to protect your OpenAI API usage and prevent abuse.

## How It Works

The rate limiting system uses two layers of protection:

### 1. Burst Protection

- **Limit**: 3 requests per 10 seconds
- **Purpose**: Prevents rapid-fire requests that could overwhelm the system
- **Response**: 429 status with message "Too many requests too quickly. Please slow down."

### 2. OpenAI API Protection

- **Limit**: 10 requests per minute
- **Purpose**: Protects your OpenAI API quota from being exhausted too quickly
- **Response**: 429 status with message "OpenAI API rate limit exceeded. Please try again later."

## Configuration

You can adjust the rate limiting settings in `src/lib/rate-limiter-config.ts`:

```typescript
export const RATE_LIMIT_CONFIG = {
  openai: {
    maxRequests: 10, // Change this to adjust OpenAI API limit
    windowMs: 60 * 1000, // Change this to adjust time window
    message: "OpenAI API rate limit exceeded. Please try again later.",
  },

  burst: {
    maxRequests: 3, // Change this to adjust burst limit
    windowMs: 10 * 1000, // Change this to adjust burst window
    message: "Too many requests too quickly. Please slow down.",
  },
};
```

## Response Headers

When a request is successful, the API returns rate limit information in headers:

- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Remaining requests in current window
- `X-RateLimit-Reset`: Timestamp when the limit resets
- `X-RateLimit-Window`: Time window in seconds

## Error Responses

When rate limits are exceeded, the API returns a 429 status with:

```json
{
  "error": "Rate limit message",
  "remainingTime": "45 seconds",
  "limit": "10 requests per minute"
}
```

## Monitoring

The rate limiter logs all requests to the console with the format:

```
[Rate Limiter] Request from IP_ADDRESS, count: 5/10
[Rate Limiter] Rate limit exceeded for IP_ADDRESS, count: 10/10
```

## IP Detection

The system detects client IPs using these headers (in order of preference):

1. `x-forwarded-for` (for requests behind proxies/load balancers)
2. `x-real-ip` (for nginx reverse proxies)
3. `cf-connecting-ip` (for Cloudflare)

## Cleanup

The system automatically cleans up expired rate limit entries every 5 minutes to prevent memory leaks.

## Customization

You can create additional rate limiters for other endpoints by importing the `RateLimiter` class:

```typescript
import { RateLimiter } from "@/lib/rate-limiter";

const customLimiter = new RateLimiter(20, 5 * 60 * 1000); // 20 requests per 5 minutes
```
