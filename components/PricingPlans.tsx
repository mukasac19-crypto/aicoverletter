// components/PricingPlans.tsx
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, CreditCard } from "lucide-react";
import { SubscriptionInterval, SubscriptionTier } from "@/types/subscription";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from '@/lib/utils';

interface PricingPlansProps {
  currentPlan?: SubscriptionTier;
  onSelectPlan?: (tier: SubscriptionTier, interval: SubscriptionInterval) => void;
  defaultInterval?: SubscriptionInterval | null;
}

const PLAN_FEATURES = {
  FREE: [
    '1 Cover letter per month',
    '1 Resume',
    'Basic templates only',
    '2 ATS scans per month',
    '1 Interview session',
    'Basic AI enhancement',
  ],
  PRO: [
    'Unlimited cover letters & resumes',
    'All premium templates',
    'Unlimited ATS scans',
    'Unlimited interview sessions',
    'Advanced AI feedback & rewriting',
    'Priority email support',
  ],
};

export default function PricingPlans({ currentPlan, onSelectPlan, defaultInterval }: PricingPlansProps) {
  const [selectedInterval, setSelectedInterval] = useState<SubscriptionInterval>('monthly');
  const { user } = useAuth();

  useEffect(() => {
    if (defaultInterval) setSelectedInterval(defaultInterval);
  }, [defaultInterval]);

  const getPrice = (tier: SubscriptionTier) => {
    if (tier === 'FREE') return 0;
    return selectedInterval === 'annually' ? 100 : 20;
  };

  const handleSelectPlan = (tier: SubscriptionTier) => {
    if (onSelectPlan) onSelectPlan(tier, selectedInterval);
    else if (user) window.location.href = `/api/stripe/create-checkout?tier=${tier}&interval=${selectedInterval}`;
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      {/* Toggle */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex p-1 bg-gray-100 rounded-lg">
          {['monthly', 'annually'].map((interval) => (
            <Button
              key={interval}
              size="sm"
              onClick={() => setSelectedInterval(interval as SubscriptionInterval)}
              className={cn(
                "text-sm rounded-md transition-all",
                selectedInterval === interval
                  ? "bg-orange-600 text-white hover:bg-orange-700"
                  : "text-gray-700 hover:text-orange-700"
              )}
            >
              {interval === 'annually' ? 'Annually (Save 58%)' : 'Monthly'}
            </Button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* FREE */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">Free</CardTitle>
            <CardDescription className="mt-2 text-sm">Try essential tools for free</CardDescription>
            <div className="mt-4 text-3xl font-bold text-gray-900">
              $0 <span className="text-sm text-muted-foreground ml-1">forever</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {PLAN_FEATURES.FREE.map((feature, i) => (
                <li key={i} className="flex items-start text-sm">
                  <CheckCircle2 className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" disabled>
              Current Plan
            </Button>
          </CardFooter>
        </Card>

        {/* PRO */}
        <Card className="border-orange-500 shadow-lg ring-2 ring-orange-400 relative">
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-orange-600 to-orange-500 text-white text-xs text-center py-1 font-semibold">
            MOST POPULAR
          </div>
          <CardHeader className="pt-7">
            <CardTitle className="text-xl font-bold text-orange-600">Pro</CardTitle>
            <CardDescription className="mt-2 text-sm">Everything you need to land your next job</CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">
                ${getPrice('PRO')}
              </span>
              <span className="text-sm text-muted-foreground ml-1">
                /{selectedInterval === 'monthly' ? 'mo' : 'yr'}
              </span>
              {selectedInterval === 'annually' && (
                <div className="text-sm text-orange-600 font-medium">Save 58% vs monthly</div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {PLAN_FEATURES.PRO.map((feature, i) => (
                <li key={i} className="flex items-start text-sm">
                  <CheckCircle2 className="h-4 w-4 text-orange-500 mr-2 mt-0.5" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button
              className="w-full bg-orange-600 hover:bg-orange-700 text-white text-lg py-5"
              onClick={() => handleSelectPlan('PRO')}
            >
              <CreditCard className="mr-2 h-5 w-5" /> Unlock Unlimited Cover Letters
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Try Pro risk-free • 7-day money-back guarantee
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
