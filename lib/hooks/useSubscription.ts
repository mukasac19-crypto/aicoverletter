// hooks/useSubscription.ts
"use client";
export const dynamic = 'force-dynamic'

import { useState, useEffect, useCallback, useMemo } from 'react'; // Added useMemo
import { useAuthStore } from '@/stores/authstore'; // Corrected import to useAuthStore
import { SubscriptionStatus, SubscriptionTier } from '@/types/subscription';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { LimitedFeature } from '@/lib/subscription-enforcement';
import initSupabase, { createClient } from '@/utils/client-side-client'; // Client creation

export interface FeatureUsage {
  used: number;
  limit: number;
  unlimited: boolean;
}

export function useSubscription() {

  console.log("============== use sub called ==============");
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [usageStats, setUsageStats] = useState<Record<LimitedFeature, FeatureUsage> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get user and loading state from the global AuthStore
  const { user, loading: authLoading,session } = useAuthStore();

  const { toast } = useToast();
  const router = useRouter();

  // Initialize Supabase client once and make it stable
  const supabase = initSupabase

  // Memoize fetchSubscriptionData with useCallback
  // It only re-creates if user or supabase client changes
  const fetchSubscriptionData = useCallback(async () => {
    console.log(session, "=================== useSubscription user from useAuthStore ===================");
    if (!session) {
      setSubscription(null);
      setUsageStats(null);
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);

      const accessToken = session?.access_token;

      
      if (!accessToken) {
        throw new Error('User is not authenticated');
      } 
      console.log("============SUBSCRIPTION and usage REQUEST============", accessToken);
      
      const [subResponse, usageResponse] = await Promise.all([
        fetch('/api/user/subscription', { 
          headers: { 
            'x-access-token': accessToken as string,
            'x-user-id': user?.id ?? ""
          },
          cache: "no-store", 
        }),
        fetch('/api/user/usage', { 
          headers: { 
            'x-access-token': accessToken as string,
            'x-user-id': user?.id ?? ""
          },
          cache: "no-store"
        }),
      ]);

      console.log("============SUB RESPONSE============", subResponse);
      console.log("============USAGE RESPONSE============", usageResponse);
      
      if (!subResponse.ok) {
        const errorData = await subResponse.json();
        throw new Error(errorData.message || 'Failed to fetch subscription data');
      }
      if (!usageResponse.ok) {
        const errorData = await usageResponse.json();
        throw new Error(errorData.message || 'Failed to fetch usage data');
      }

      const subData = await subResponse.json();
      const usageData = await usageResponse.json();

      setSubscription(subData);
      setUsageStats(usageData);

    } catch (error: any) {
      console.error('Error fetching subscription data:', error);
      setError(error.message || 'Failed to load subscription information');
      
      toast({
        title: 'Error',
        description: 'Failed to load subscription information. Please try again.',
        variant: 'destructive',
      });

    } finally {
      setIsLoading(false);
    }
  }, [user, supabase, toast,session]); // Dependencies for useCallback

  // Initial fetch effect: calls the stable fetchSubscriptionData
  useEffect(() => {
    console.log("----------------------- use sub effect run",authLoading);
    // Only fetch if authLoading is false and user is known (null or object)
    if (!authLoading) { 
      // fetchSubscriptionData();
    }
  }, [authLoading]); // Dependencies for useEffect

  // Get current tier
  const tier = subscription?.tier || 'FREE';
  
  // Get current status
  const status = subscription?.status || 'active';
  
  // Check if user has access to a feature
  const hasAccess = useCallback((requiredTier: SubscriptionTier): boolean => {
    if (!subscription) return false;
    
    const tierValues: Record<SubscriptionTier, number> = {
      'FREE': 0,
      'PRO': 1,
    };
    
    return tierValues[subscription.tier] >= tierValues[requiredTier];
  }, [subscription]); // Depends on subscription state

  // Check if user can access a feature (with usage limits)
  const canAccess = useCallback((feature: LimitedFeature): boolean => {
    if (!usageStats || !usageStats[feature]) return true; // Default to true if no stats
    
    const usage = usageStats[feature];
    return usage.unlimited || usage.used < usage.limit;
  }, [usageStats]); // Depends on usageStats state
  
  // Get usage for a specific feature
  const getUsage = useCallback((feature: LimitedFeature): FeatureUsage | null => {
    if (!usageStats) return null;
    return usageStats[feature] || null;
  }, [usageStats]); // Depends on usageStats state
  
  // Check and track usage in one call
  const checkAndTrack = useCallback(async (feature: LimitedFeature): Promise<{ allowed: boolean; reason?: string }> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;

      if (!accessToken) {
        return { allowed: false, reason: 'User not authenticated to track usage.' };
      }

      const response = await fetch('/api/subscription/check-and-track', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-access-token': accessToken,
          'x-user-id': user?.id || '' // Ensure user?.id is provided
        },
        body: JSON.stringify({ feature }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { allowed: false, reason: data.error };
      }
      
      // Refresh usage data after tracking
      await fetchSubscriptionData(); // Call the stable memoized function
      
      return { allowed: true };
    } catch (error) {
      console.error('Error checking/tracking usage:', error);
      return { allowed: false, reason: 'Failed to verify subscription' };
    }
  }, [supabase, user, fetchSubscriptionData]); // Dependencies for useCallback
  
  // Upgrade subscription
  const upgradeSubscription = useCallback((minimumTier?: SubscriptionTier) => {
    const tierParam = minimumTier ? `?tier=${minimumTier}` : '';
    router.push(`/pricing${tierParam}`);
  }, [router]);
  
  // Manage subscription
  const manageSubscription = useCallback(() => {
    router.push('/dashboard/billing');
  }, [router]);
  
  // Refresh usage data (simply calls the memoized fetch function)
  const refreshUsage = useCallback(() => {
    return fetchSubscriptionData();
  }, [fetchSubscriptionData]);
  
  return {
    // State
    subscription,
    usageStats,
    loading: isLoading, // Renamed to isLoading for clarity if authLoading also present
    error,
    tier,
    status,
    
    // Methods
    hasAccess,
    canAccess,
    getUsage,
    checkAndTrack,
    upgradeSubscription,
    manageSubscription,
    refreshUsage,
  };
}
