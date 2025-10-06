"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import PricingPlans from "@/components/PricingPlans";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { SubscriptionTier, SubscriptionInterval } from '@/types/subscription';

export default function PricingClient() {
  const { user, loading } = useAuth();
  const [currentPlan, setCurrentPlan] = useState<SubscriptionTier>('FREE');
  const [isLoadingPlan, setIsLoadingPlan] = useState(true);
  const [redirecting, setRedirecting] = useState(false); // NEW STATE
  const router = useRouter();
  const searchParams = useSearchParams();

  const defaultInterval = searchParams.get('interval') as SubscriptionInterval | null;

  // --- Fetch user's subscription tier ---
  useEffect(() => {
    const fetchSubscriptionTier = async () => {
      if (!user) {
        setIsLoadingPlan(false);
        return;
      }

      try {
        const response = await fetch('/api/user/subscription');
        if (!response.ok) throw new Error('Failed to fetch subscription status');
        const data = await response.json();
        setCurrentPlan(data.tier);
      } catch (error) {
        console.error('Error fetching subscription tier:', error);
      } finally {
        setIsLoadingPlan(false);
      }
    };

    if (!loading) {
      fetchSubscriptionTier();
    }
  }, [user, loading]);

  // --- Handle Plan Selection ---
  const handleSelectPlan = async (tier: SubscriptionTier, interval: string) => {
    if (!user) {
      // Redirect to login if not logged in
      router.push(`/auth/login?redirect=/pricing&msg=Login to unlock unlimited features`);
      return;
    }

    // If already on this tier, redirect to billing
    if (tier === currentPlan) {
      router.push('/dashboard/billing');
      return;
    }

    // Trigger redirect feedback
    setRedirecting(true);
    router.push(`/api/stripe/create-checkout?tier=${tier}&interval=${interval}`);
  };

  // --- Loading states ---
  if (loading || isLoadingPlan) {
    return (
      <div className="flex justify-center my-8">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    );
  }

  // --- Redirecting feedback state ---
  if (redirecting) {
    return (
      <div className="flex flex-col items-center justify-center my-16 text-center">
        <LoadingSpinner className="h-10 w-10 mb-3 text-orange-600" />
        <p className="text-sm text-muted-foreground">
          Redirecting to secure checkout...
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Please don’t refresh this page.
        </p>
      </div>
    );
  }

  // --- Render Pricing Plans ---
  return (
    <PricingPlans
      currentPlan={currentPlan}
      onSelectPlan={handleSelectPlan}
      defaultInterval={defaultInterval}
    />
  );
}
