// lib/subscription-client.ts
import { SubscriptionTier } from '@/types/subscription';
import { SUBSCRIPTION_PLANS } from './subscription-plans';

// Export SUBSCRIPTION_PLANS from the new file
export { SUBSCRIPTION_PLANS };

// Features for each tier (simplified for FREE/PRO)
export const FEATURES: Record<Exclude<SubscriptionTier, 'BUSINESS'>, string[]> = {
  FREE: [
    'Up to 3 resumes',
    'Up to 5 cover letters per month',
    'Basic templates',
    '10 exports per month',
    'Email support',
  ],
  PRO: [
    'Unlimited resumes',
    'Unlimited cover letters',
    'All premium templates',
    'Unlimited exports',
    'ATS Scanner',
    'Interview Buddy AI',
    'Priority email support',
    'Remove watermarks',
  ],
};

// Helper to check if a tier includes a specific feature
export function tierIncludesFeature(tier: SubscriptionTier, feature: string): boolean {
  // Handle legacy BUSINESS tier by treating it as PRO
  const effectiveTier = (tier as any) === 'BUSINESS' ? 'PRO' : tier;
  const features = FEATURES[effectiveTier as keyof typeof FEATURES] || FEATURES.FREE;
  return features.some((f: string) => f.toLowerCase().includes(feature.toLowerCase()));
}

// Get display name for tier
export function getTierDisplayName(tier: SubscriptionTier): string {
  const names: Record<SubscriptionTier, string> = {
    FREE: 'Free',
    PRO: 'Professional',
  };
  return names[tier] || tier;
}

// Get tier badge color
export function getTierBadgeColor(tier: SubscriptionTier): string {
  const colors: Record<SubscriptionTier, string> = {
    FREE: 'bg-gray-100 text-gray-800',
    PRO: 'bg-purple-100 text-purple-800',
  };
  return colors[tier] || 'bg-gray-100 text-gray-800';
}

// Get tier icon (new helper function)
export function getTierIcon(tier: SubscriptionTier): string {
  const icons: Record<SubscriptionTier, string> = {
    FREE: 'user',
    PRO: 'crown',
  };
  return icons[tier] || 'user';
}

// Check if user needs upgrade (new helper function)
export function needsUpgrade(currentTier: SubscriptionTier): boolean {
  return currentTier === 'FREE';
}

// Get upgrade benefits (new helper function)
export function getUpgradeBenefits(): string[] {
  return [
    'Unlimited resumes (vs 3)',
    'Unlimited cover letters (vs 5/month)',
    'Premium templates',
    'ATS Scanner',
    'Interview Buddy AI',
    'Priority support',
    'No watermarks',
  ];
}