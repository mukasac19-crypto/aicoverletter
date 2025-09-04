// contexts/SubscriptionContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createBrowserClient } from '@/lib/supabase';
import { SUBSCRIPTION_PLANS } from '@/lib/subscription-plans';

interface SubscriptionContextType {
  isPro: boolean;
  isLoading: boolean;
  usage: Record<string, { used: number; limit: number }>;
  refreshSubscription: () => Promise<void>;
  canUseFeature: (feature: string) => boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [isPro, setIsPro] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [usage, setUsage] = useState<Record<string, { used: number; limit: number }>>({});
  const supabase = createBrowserClient();

  // Fetch subscription and usage
  const refreshSubscription = useCallback(async () => {
    if (!user?.id) {
      setIsPro(false);
      setUsage({});
      return;
    }

    setIsLoading(true);
    try {
      // Check if user has active subscription
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();

      setIsPro(!!subscription);

      // Get usage stats if FREE user
      if (!subscription) {
        const { data: usageData } = await supabase
          .rpc('get_user_usage', { p_user_id: user.id });

        if (usageData) {
          const usageMap: Record<string, { used: number; limit: number }> = {};
          
          usageData.forEach((stat: any) => {
            const limit = SUBSCRIPTION_PLANS.FREE.limits[stat.feature as keyof typeof SUBSCRIPTION_PLANS.FREE.limits];
            if (typeof limit === 'number') {
              usageMap[stat.feature] = {
                used: stat.used,
                limit: limit
              };
            }
          });

          // Add limits for features not yet used
          ['coverLetters', 'resumes', 'exports'].forEach(feature => {
            if (!usageMap[feature]) {
              const limit = SUBSCRIPTION_PLANS.FREE.limits[feature as keyof typeof SUBSCRIPTION_PLANS.FREE.limits];
              if (typeof limit === 'number') {
                usageMap[feature] = { used: 0, limit };
              }
            }
          });

          setUsage(usageMap);
        }
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, supabase]);

  // Check if user can use a feature
  const canUseFeature = useCallback((feature: string): boolean => {
    if (isPro) return true;
    
    const featureUsage = usage[feature];
    if (!featureUsage) return true;
    
    return featureUsage.used < featureUsage.limit;
  }, [isPro, usage]);

  // Initialize on mount and user change
  useEffect(() => {
    refreshSubscription();
  }, [user?.id]);

  // Listen for subscription changes
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
        () => {
          refreshSubscription();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, supabase, refreshSubscription]);

  const contextValue = useMemo(() => ({
    isPro,
    isLoading,
    usage,
    refreshSubscription,
    canUseFeature,
  }), [isPro, isLoading, usage, refreshSubscription, canUseFeature]);

  return (
    <SubscriptionContext.Provider value={contextValue}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}