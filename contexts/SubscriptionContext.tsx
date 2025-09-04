// contexts/SubscriptionContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SubscriptionTier, SubscriptionStatus } from '@/types/subscription';
import { createBrowserClient } from '@/lib/supabase';

interface SubscriptionCache {
  status: SubscriptionStatus;
  timestamp: number;
}

interface SubscriptionContextType {
  subscription: SubscriptionStatus;
  isLoading: boolean;
  error: string | null;
  refreshSubscription: () => Promise<void>;
  hasFeatureAccess: (feature: string) => boolean;
  isFeatureLimited: (feature: string, used?: number) => boolean;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const CACHE_KEY = 'subscription_cache';

// Default free tier subscription
const DEFAULT_SUBSCRIPTION: SubscriptionStatus = {
  tier: 'FREE',
  status: 'active',
};

// Feature access mapping
// Feature access mapping
const FEATURE_ACCESS: Record<string, SubscriptionTier[]> = {
  'unlimited_resumes': ['PRO', 'BUSINESS'],
  'unlimited_cover_letters': ['PRO', 'BUSINESS'],
  'ats_scanner': ['PRO', 'BUSINESS'],
  'interview_buddy': ['BUSINESS'],
  'advanced_templates': ['PRO', 'BUSINESS'],
  'priority_support': ['BUSINESS'],
  'bulk_export': ['PRO', 'BUSINESS'],
  'team_collaboration': ['BUSINESS'],
};

// Feature limits for free tier
const FREE_TIER_LIMITS: Record<string, number> = {
  resumes: 3,
  cover_letters: 5,
  exports_per_month: 10,
  templates: 5,
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionStatus>(DEFAULT_SUBSCRIPTION);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createBrowserClient();

  // Load from cache
  const loadFromCache = useCallback((): SubscriptionCache | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;
      
      const data: SubscriptionCache = JSON.parse(cached);
      const now = Date.now();
      
      // Check if cache is still valid
      if (now - data.timestamp > CACHE_DURATION) {
        localStorage.removeItem(CACHE_KEY);
        return null;
      }
      
      return data;
    } catch {
      return null;
    }
  }, []);

  // Save to cache
  const saveToCache = useCallback((status: SubscriptionStatus) => {
    if (typeof window === 'undefined') return;
    
    try {
      const cache: SubscriptionCache = {
        status,
        timestamp: Date.now(),
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch {
      // Ignore cache errors
    }
  }, []);

  // Clear cache
  const clearCache = useCallback(() => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(CACHE_KEY);
  }, []);

  // Fetch subscription from API
  const fetchSubscription = useCallback(async (userId: string) => {
    try {
      const response = await fetch('/api/user/subscription', {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch subscription');
      }
      
      const data: SubscriptionStatus = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching subscription:', error);
      return DEFAULT_SUBSCRIPTION;
    }
  }, []);

  // Refresh subscription status
  const refreshSubscription = useCallback(async () => {
    if (!user?.id) {
      setSubscription(DEFAULT_SUBSCRIPTION);
      clearCache();
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const status = await fetchSubscription(user.id);
      setSubscription(status);
      saveToCache(status);
    } catch (err) {
      setError('Failed to load subscription status');
      // Keep existing subscription on error
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, fetchSubscription, saveToCache, clearCache]);

  // Check feature access
  const hasFeatureAccess = useCallback((feature: string): boolean => {
    const allowedTiers = FEATURE_ACCESS[feature];
    if (!allowedTiers) return true; // Unknown features are allowed
    
    return allowedTiers.includes(subscription.tier);
  }, [subscription.tier]);

  // Check if feature is limited (for free tier)
  const isFeatureLimited = useCallback((feature: string, used: number = 0): boolean => {
    if (subscription.tier !== 'FREE') return false;
    
    const limit = FREE_TIER_LIMITS[feature];
    if (limit === undefined) return false;
    
    return used >= limit;
  }, [subscription.tier]);

  // Initialize subscription on mount and user change
  useEffect(() => {
    if (!user?.id) {
      setSubscription(DEFAULT_SUBSCRIPTION);
      clearCache();
      return;
    }

    // Try to load from cache first
    const cached = loadFromCache();
    if (cached) {
      setSubscription(cached.status);
      // Still refresh in background for latest data
      refreshSubscription();
    } else {
      // No cache, fetch immediately
      refreshSubscription();
    }
  }, [user?.id]); // Only depend on user ID changes

  // Set up real-time subscription updates
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel(`subscription:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscriptions',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          // Refresh subscription when database changes
          refreshSubscription();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, supabase, refreshSubscription]);

  // Memoize context value
  const contextValue = useMemo(() => ({
    subscription,
    isLoading,
    error,
    refreshSubscription,
    hasFeatureAccess,
    isFeatureLimited,
  }), [subscription, isLoading, error, refreshSubscription, hasFeatureAccess, isFeatureLimited]);

  return (
    <SubscriptionContext.Provider value={contextValue}>
      {children}
    </SubscriptionContext.Provider>
  );
}

// Hook to use subscription context
export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}

// HOC for protecting premium features
export function withFeatureAccess<P extends object>(
  Component: React.ComponentType<P>,
  feature: string,
  FallbackComponent?: React.ComponentType<any>
) {
  return function ProtectedComponent(props: P) {
    const { hasFeatureAccess, isLoading } = useSubscription();
    
    if (isLoading) {
      // Show loading state or render component with limited features
      return <Component {...props} isFeatureLocked={true} />;
    }
    
    if (!hasFeatureAccess(feature)) {
      if (FallbackComponent) {
        return <FallbackComponent {...props} requiredFeature={feature} />;
      }
      return null;
    }
    
    return <Component {...props} isFeatureLocked={false} />;
  };
}

// Utility hook for checking multiple features
export function useFeatureAccess(features: string[]): Record<string, boolean> {
  const { hasFeatureAccess } = useSubscription();
  
  return useMemo(() => {
    const access: Record<string, boolean> = {};
    for (const feature of features) {
      access[feature] = hasFeatureAccess(feature);
    }
    return access;
  }, [features, hasFeatureAccess]);
}