// lib/simple-rate-limiter.ts
import redisConnection from './redis';
import { getUserSubscriptionTier } from './subscription';

// Rate limits per tier (requests per hour)
const RATE_LIMITS = {
  FREE: 60,
  PRO: 300,
  BUSINESS: 1000,
};

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
}

/**
 * Simple rate limiter using Redis
 */
export async function checkRateLimit(
  userId: string,
  endpoint: string
): Promise<RateLimitResult> {
  // Get user's subscription tier
  const tier = await getUserSubscriptionTier(userId);
  const limit = RATE_LIMITS[tier as keyof typeof RATE_LIMITS] || RATE_LIMITS.FREE;
  
  // Create a unique key for this user + endpoint
  const key = `rate_limit:${userId}:${endpoint}`;
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hour window
  const windowStart = now - windowMs;
  
  try {
    // Remove old entries outside the window
    await redisConnection.zremrangebyscore(key, '-inf', windowStart);
    
    // Count requests in current window
    const count = await redisConnection.zcard(key);
    
    if (count >= limit) {
      // Get the oldest entry to determine when limit resets
      const oldestEntries = await redisConnection.zrange(key, 0, 0, 'WITHSCORES');
      const resetAt = oldestEntries.length >= 2 
        ? parseInt(oldestEntries[1]) + windowMs 
        : now + windowMs;
      
      return {
        allowed: false,
        limit,
        remaining: 0,
        resetAt,
      };
    }
    
    // Add current request
    await redisConnection.zadd(key, now, `${now}-${Math.random()}`);
    
    // Set expiry on the key
    await redisConnection.expire(key, 3600); // 1 hour
    
    return {
      allowed: true,
      limit,
      remaining: limit - count - 1,
      resetAt: now + windowMs,
    };
  } catch (error) {
    console.error('Rate limit check failed:', error);
    // Fail open - allow request if Redis is down
    return {
      allowed: true,
      limit,
      remaining: limit,
      resetAt: now + windowMs,
    };
  }
}

/**
 * Middleware helper for API routes
 */
export async function rateLimitApiRoute(
  userId: string,
  endpoint: string
): Promise<{ 
  allowed: boolean; 
  headers: Record<string, string>;
  error?: { status: number; message: string };
}> {
  const result = await checkRateLimit(userId, endpoint);
  
  const headers: Record<string, string> = {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': new Date(result.resetAt).toISOString(),
  };
  
  if (!result.allowed) {
    const retryAfter = Math.ceil((result.resetAt - Date.now()) / 1000);
    headers['Retry-After'] = retryAfter.toString();
    
    return {
      allowed: false,
      headers,
      error: {
        status: 429,
        message: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
      },
    };
  }
  
  return { allowed: true, headers };
}