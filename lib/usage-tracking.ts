// lib/usage-tracking.ts
import { createBrowserClient } from '@/lib/supabase';
import { getServerClient } from '@/lib/supabase-server';
import { SUBSCRIPTION_PLANS } from './subscription-plans';
import { SubscriptionTier } from '@/types/subscription';

export interface UsageRecord {
  id: string;
  user_id: string;
  feature: string;
  count: number;
  period_start: string;
  period_end: string;
  created_at: string;
  updated_at: string;
}

export interface UsageStats {
  feature: string;
  used: number;
  limit: number;
  remaining: number;
  percentage: number;
  period_end: string;
}

/**
 * Get the current billing period (monthly)
 */
export function getCurrentPeriod(): { start: Date; end: Date } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  return { start, end };
}

/**
 * Track usage of a feature
 */
export async function trackUsage(
  userId: string,
  feature: string,
  increment: number = 1,
  isServer: boolean = false
): Promise<{ success: boolean; remaining?: number; error?: string }> {
  const supabase = isServer ? await getServerClient() : createBrowserClient();
  const { start, end } = getCurrentPeriod();
  
  try {
    // Get user's subscription tier
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('plan_id')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();
    
    // Simple check: if they have an active subscription, they're PRO
    const tier: SubscriptionTier = subscription ? 'PRO' : 'FREE';
    
    const plan = SUBSCRIPTION_PLANS[tier];
    const limit = getFeatureLimit(plan, feature);
    
    // If unlimited (-1), just return success
    if (limit === -1) {
      return { success: true, remaining: -1 };
    }
    
    // Get or create usage record
    const { data: existingUsage, error: fetchError } = await supabase
      .from('usage_limits')
      .select('*')
      .eq('user_id', userId)
      .eq('feature', feature)
      .gte('period_start', start.toISOString())
      .lte('period_end', end.toISOString())
      .single();
    
    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }
    
    let currentUsage = existingUsage?.used_count || 0;
    const newUsage = currentUsage + increment;
    
    // Check if limit exceeded
    if (newUsage > limit) {
      return {
        success: false,
        remaining: Math.max(0, limit - currentUsage),
        error: `${feature} limit exceeded. Upgrade to PRO for unlimited access.`,
      };
    }
    
    // Update or create usage record
    if (existingUsage) {
      const { error: updateError } = await supabase
        .from('usage_limits')
        .update({
          used_count: newUsage,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingUsage.id);
      
      if (updateError) throw updateError;
    } else {
      const { error: insertError } = await supabase
        .from('usage_limits')
        .insert({
          user_id: userId,
          feature,
          used_count: increment,
          limit_count: limit,
          period_start: start.toISOString(),
          period_end: end.toISOString(),
        });
      
      if (insertError) throw insertError;
    }
    
    return {
      success: true,
      remaining: limit - newUsage,
    };
  } catch (error) {
    console.error('Error tracking usage:', error);
    return {
      success: false,
      error: 'Failed to track usage',
    };
  }
}

/**
 * Get usage statistics for a user
 */
export async function getUsageStats(
  userId: string,
  isServer: boolean = false
): Promise<Record<string, UsageStats>> {
  const supabase = isServer ? await getServerClient() : createBrowserClient();
  const { start, end } = getCurrentPeriod();
  
  try {
    // Get user's subscription tier
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('plan_id')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();
    
    // Simple check: if they have an active subscription, they're PRO
    const tier: SubscriptionTier = subscription ? 'PRO' : 'FREE';
    
    const plan = SUBSCRIPTION_PLANS[tier];
    
    // Get all usage records for current period
    const { data: usageRecords, error } = await supabase
      .from('usage_limits')
      .select('*')
      .eq('user_id', userId)
      .gte('period_start', start.toISOString())
      .lte('period_end', end.toISOString());
    
    if (error) throw error;
    
    // Build usage stats
    const stats: Record<string, UsageStats> = {};
    const features = ['coverLetters', 'resumes', 'atsScans', 'exports'];
    
    for (const feature of features) {
      const usage = usageRecords?.find((r: any) => r.feature === feature);
      const limit = getFeatureLimit(plan, feature);
      const used = usage?.used_count || 0;
      
      stats[feature] = {
        feature,
        used,
        limit,
        remaining: limit === -1 ? -1 : Math.max(0, limit - used),
        percentage: limit === -1 ? 0 : Math.min(100, (used / limit) * 100),
        period_end: end.toISOString(),
      };
    }
    
    return stats;
  } catch (error) {
    console.error('Error getting usage stats:', error);
    return {};
  }
}

/**
 * Check if user can use a feature
 */
export async function canUseFeature(
  userId: string,
  feature: string,
  isServer: boolean = false
): Promise<boolean> {
  const stats = await getUsageStats(userId, isServer);
  const featureStats = stats[feature];
  
  if (!featureStats) return true;
  if (featureStats.limit === -1) return true;
  
  return featureStats.remaining > 0;
}

/**
 * Helper to get feature limit from plan
 */
function getFeatureLimit(plan: any, feature: string): number {
  const limits = plan.limits;
  
  switch (feature) {
    case 'coverLetters':
      return limits.coverLetters;
    case 'resumes':
      return limits.resumes;
    case 'atsScans':
      return limits.atsScans;
    case 'exports':
      return limits.exports || 10; // Default 10 exports for free tier
    case 'interviewSessions':
      return limits.interviewSessions;
    default:
      return 0;
  }
}