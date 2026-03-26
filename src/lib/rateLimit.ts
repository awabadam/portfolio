/**
 * Rate limiting utility for API routes
 * Uses in-memory storage (consider Redis for production with multiple instances)
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  const keysToDelete: string[] = [];
  rateLimitStore.forEach((entry, key) => {
    if (entry.resetAt < now) {
      keysToDelete.push(key);
    }
  });
  keysToDelete.forEach((key) => rateLimitStore.delete(key));
}, 60000); // Clean up every minute

export interface RateLimitConfig {
  /** Maximum number of requests allowed in the window */
  limit: number;
  /** Time window in milliseconds */
  windowMs: number;
  /** Identifier prefix (e.g., 'chat', 'leads') */
  prefix?: string;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
}

/**
 * Check rate limit for a given identifier
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const { limit, windowMs, prefix = "" } = config;
  const key = prefix ? `${prefix}:${identifier}` : identifier;
  const now = Date.now();

  const entry = rateLimitStore.get(key);

  if (!entry || entry.resetAt < now) {
    // No entry or expired, create new one
    const resetAt = now + windowMs;
    rateLimitStore.set(key, { count: 1, resetAt });
    return {
      success: true,
      limit,
      remaining: limit - 1,
      resetAt,
    };
  }

  // Entry exists and is still valid
  if (entry.count >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      resetAt: entry.resetAt,
    };
  }

  // Increment count
  entry.count++;
  rateLimitStore.set(key, entry);

  return {
    success: true,
    limit,
    remaining: limit - entry.count,
    resetAt: entry.resetAt,
  };
}

/**
 * Get rate limit headers for response
 */
export function getRateLimitHeaders(result: RateLimitResult): HeadersInit {
  return {
    "X-RateLimit-Limit": result.limit.toString(),
    "X-RateLimit-Remaining": result.remaining.toString(),
    "X-RateLimit-Reset": Math.ceil(result.resetAt / 1000).toString(),
  };
}

/**
 * Extract identifier from request (IP address)
 */
export function getIdentifier(request: Request): string {
  const headers = request.headers;
  return (
    headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    headers.get("x-real-ip") ||
    headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

// Pre-configured rate limiters
export const rateLimiters = {
  /** Chat API: 30 messages per minute per IP */
  chat: {
    limit: 30,
    windowMs: 60 * 1000,
    prefix: "chat",
  },
  /** Leads API: 10 submissions per hour per IP */
  leads: {
    limit: 10,
    windowMs: 60 * 60 * 1000,
    prefix: "leads",
  },
  /** Admin API: 100 requests per minute per IP */
  admin: {
    limit: 100,
    windowMs: 60 * 1000,
    prefix: "admin",
  },
  /** Search API: 30 requests per minute per IP */
  search: {
    limit: 30,
    windowMs: 60 * 1000,
    prefix: "search",
  },
};
