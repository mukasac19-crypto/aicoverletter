// lib/api-helpers.ts
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { SUBSCRIPTION_PLANS } from './subscription-plans';

interface ApiContext {
  userId: string;
  isPro: boolean;
  supabase: any;
}

// Lightweight protection for API routes
export async function withAuth(
  request: NextRequest,
  handler: (context: ApiContext) => Promise<NextResponse>
): Promise<NextResponse> {
  const supabase = createRouteHandlerClient({ cookies });
  
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Check if user is PRO (simple query)
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('id')
    .eq('user_id', session.user.id)
    .eq('status', 'active')
    .maybeSingle();
  
  const context: ApiContext = {
    userId: session.user.id,
    isPro: !!subscription,
    supabase,
  };
  
  return handler(context);
}

// Check and track feature usage
export async function checkFeatureUsage(
  userId: string,
  feature: string,
  isPro: boolean,
  supabase: any
): Promise<{ allowed: boolean; error?: string }> {
  // PRO users have unlimited access
  if (isPro) return { allowed: true };
  
  // Get limit for FREE users
  const limit = SUBSCRIPTION_PLANS.FREE.limits[feature as keyof typeof SUBSCRIPTION_PLANS.FREE.limits];
  
  if (typeof limit !== 'number') return { allowed: true };
  if (limit === 0) return { 
    allowed: false, 
    error: 'This feature requires a PRO subscription' 
  };
  
  // Check usage using RPC function
  const { data, error } = await supabase
    .rpc('check_and_increment_usage', {
      p_user_id: userId,
      p_feature: feature,
      p_limit: limit
    });
  
  if (error) {
    console.error('Usage check error:', error);
    return { allowed: true }; // Fail open
  }
  
  if (!data.allowed) {
    return { 
      allowed: false, 
      error: `You've reached your monthly limit of ${limit} ${feature}. Upgrade to PRO for unlimited access.`
    };
  }
  
  return { allowed: true };
}