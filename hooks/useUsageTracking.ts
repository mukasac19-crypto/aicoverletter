// hooks/useUsageTracking.ts
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { createBrowserClient } from '@/lib/supabase';

interface UsageData {
  feature: string;
  used_count: number;
  limit_count: number;
  period_start: string;
  period_end: string;
}

interface UsageTrackingResult {
  usage: UsageData | null;
  isLoading: boolean;
  error: string | null;
  canUseFeature: boolean;
  remainingUses: number;
  percentageUsed: number;
  incrementUsage: () => Promise<boolean>;
  refreshUsage: () => Promise<void>;
}

export function useUsageTracking(feature: string): UsageTrackingResult {
  const { user } = useAuth();
  const { subscription, isFeatureLimited } = useSubscription();
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createBrowserClient();

  // Fetch current usage
  const fetchUsage = useCallback(async () => {
    if (!user?.id || subscription.tier !== 'FREE') {
      setIsLoading(false);
      return;
    }

    try {
      const now = new Date();
      const { data, error: fetchError } = await supabase
        .from('usage_limits')
        .select('*')
        .eq('user_id', user.id)
        .eq('feature', feature)
        .gte('period_end', now.toISOString())
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      setUsage(data || null);
    } catch (err) {
      console.error('Error fetching usage:', err);
      setError('Failed to load usage data');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, feature, subscription.tier, supabase]);

  // Increment usage count
  const incrementUsage = useCallback(async (): Promise<boolean> => {
    if (!user?.id || subscription.tier !== 'FREE') {
      return true; // No limits for paid tiers
    }

    try {
      const now = new Date();
      const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

      // Use upsert to handle both new and existing records
      const { data, error: upsertError } = await supabase
        .from('usage_limits')
        .upsert({
          user_id: user.id,
          feature,
          used_count: (usage?.used_count || 0) + 1,
          limit_count: usage?.limit_count || getDefaultLimit(feature),
          period_start: periodStart.toISOString(),
          period_end: periodEnd.toISOString(),
          updated_at: now.toISOString(),
        }, {
          onConflict: 'user_id,feature,period_start',
        })
        .select()
        .single();

      if (upsertError) {
        throw upsertError;
      }

      setUsage(data);
      
      // Check if limit exceeded
      return data.used_count <= data.limit_count;
    } catch (err) {
      console.error('Error incrementing usage:', err);
      return false;
    }
  }, [user?.id, feature, usage, subscription.tier, supabase]);

  // Calculate derived values
  const canUseFeature = !isFeatureLimited(feature, usage?.used_count || 0);
  const remainingUses = Math.max(0, (usage?.limit_count || getDefaultLimit(feature)) - (usage?.used_count || 0));
  const percentageUsed = usage ? (usage.used_count / usage.limit_count) * 100 : 0;

  // Initial fetch
  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);

  return {
    usage,
    isLoading,
    error,
    canUseFeature,
    remainingUses,
    percentageUsed,
    incrementUsage,
    refreshUsage: fetchUsage,
  };
}

// Default limits for features
function getDefaultLimit(feature: string): number {
  const limits: Record<string, number> = {
    resumes: 3,
    cover_letters: 5,
    exports_per_month: 10,
    templates: 5,
    ats_scans: 2,
    interview_sessions: 3,
  };
  return limits[feature] || 10;
}

// Hook for batch checking multiple features
export function useMultipleUsageTracking(features: string[]): Record<string, UsageTrackingResult> {
  const results: Record<string, UsageTrackingResult> = {};
  
  // This is a simplified version - in production, you'd want to batch the queries
  features.forEach(feature => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    results[feature] = useUsageTracking(feature);
  });
  
  return results;
}