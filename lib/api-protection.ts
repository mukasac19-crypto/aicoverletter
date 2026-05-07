// lib/api-protection.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerClient } from '@/lib/supabase-server';
import { getUserSubscriptionTier } from './subscription';
import { canUseFeature, trackUsage } from './usage-tracking';
import { checkRateLimit } from './simple-rate-limiter';

export interface ApiProtectionOptions {
  requireAuth?: boolean;
  requiredTiers?: string[];
  feature?: string;
  trackUsage?: boolean;
  rateLimit?: boolean;
}

export interface ApiContext {
  userId: string;
  tier: string;
  supabase: any;
}

/**
 * Protect API routes with authentication, subscription checks, and rate limiting
 */
export async function protectApiRoute(
  request: NextRequest,
  options: ApiProtectionOptions = {},
  handler: (context: ApiContext) => Promise<NextResponse>
): Promise<NextResponse> {
  const {
    requireAuth = true,
    requiredTiers = [],
    feature,
    trackUsage: shouldTrackUsage = false,
    rateLimit = true,
  } = options;

  try {
    const supabase = await getServerClient();
    
    // Authentication check
    if (requireAuth) {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        return NextResponse.json(
          { error: 'Unauthorized', message: 'Please log in to continue' },
          { status: 401 }
        );
      }
      
      const userId = session.user.id;
      
      // Get user tier
      const tier = await getUserSubscriptionTier(userId);
      
      // Rate limiting
      if (rateLimit) {
        const endpoint = new URL(request.url).pathname;
        const { allowed, limit, remaining, resetAt } = await checkRateLimit(
          userId,
          endpoint
        );
        const resetDate = new Date(resetAt);
        
        // Add rate limit headers to response
        const headers = {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': resetDate.toISOString(),
        };
        
        if (!allowed) {
          return NextResponse.json(
            {
              error: 'Too Many Requests',
              message: `Rate limit exceeded. Try again after ${resetDate.toLocaleTimeString()}.`,
              retryAfter: resetDate,
            },
            {
              status: 429,
              headers: {
                ...headers,
                'Retry-After': Math.ceil((resetDate.getTime() - Date.now()) / 1000).toString(),
              },
            }
          );
        }
      }
      
      // Subscription tier check
      if (requiredTiers.length > 0 && !requiredTiers.includes(tier)) {
        return NextResponse.json(
          {
            error: 'Subscription Required',
            message: `This feature requires a ${requiredTiers[0]} subscription or higher.`,
            requiredTier: requiredTiers[0],
            currentTier: tier,
            upgradeUrl: '/pricing',
          },
          { status: 403 }
        );
      }
      
      // Feature usage check
      if (feature) {
        const canUse = await canUseFeature(userId, feature, true);
        
        if (!canUse) {
          return NextResponse.json(
            {
              error: 'Usage Limit Exceeded',
              message: `You've reached your ${feature} limit for this month. Upgrade to continue.`,
              feature,
              upgradeUrl: '/pricing',
            },
            { status: 403 }
          );
        }
        
        // Track usage if requested
        if (shouldTrackUsage) {
          const { success, remaining, error } = await trackUsage(userId, feature, 1, true);
          
          if (!success) {
            return NextResponse.json(
              {
                error: 'Usage Limit Exceeded',
                message: error || `You've reached your ${feature} limit.`,
                feature,
                remaining,
                upgradeUrl: '/pricing',
              },
              { status: 403 }
            );
          }
        }
      }
      
      // Execute the handler
      const context: ApiContext = { userId, tier, supabase };
      const response = await handler(context);
      
      // Add rate limit headers to successful response
      if (rateLimit) {
        const endpoint = new URL(request.url).pathname;
        const { limit, remaining, resetAt } = await checkRateLimit(
          userId,
          endpoint
        );
        const resetDate = new Date(resetAt);
        
        response.headers.set('X-RateLimit-Limit', limit.toString());
        response.headers.set('X-RateLimit-Remaining', remaining.toString());
        response.headers.set('X-RateLimit-Reset', resetDate.toISOString());
      }
      
      return response;
    } else {
      // No auth required
      const context: ApiContext = { userId: '', tier: 'FREE', supabase };
      return await handler(context);
    }
  } catch (error) {
    console.error('API protection error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

/**
 * Example usage in an API route:
 * 
 * export async function POST(request: NextRequest) {
 *   return protectApiRoute(
 *     request,
 *     {
 *       requireAuth: true,
 *       requiredTiers: ['PRO', 'BUSINESS'],
 *       feature: 'coverLetters',
 *       trackUsage: true,
 *       rateLimit: true,
 *     },
 *     async ({ userId, tier, supabase }) => {
 *       // Your API logic here
 *       const data = await request.json();
 *       
 *       // Process the request...
 *       
 *       return NextResponse.json({ success: true, data: result });
 *     }
 *   );
 * }
 */