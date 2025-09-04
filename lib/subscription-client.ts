import { SubscriptionTier } from '@/types/subscription';

// We explicitly type FEATURES to ensure its keys match the SubscriptionTier type.
export const FEATURES: Record<SubscriptionTier, string[]> = {
  FREE: [
    'Up to 3 resumes',
    'Up to 5 cover letters per month',
    'Basic templates',
    '10 exports per month',
    'Email support',
  ],
  // FIX: Changed 'PROFESSIONAL' to 'PRO'
  PRO: [
    'Unlimited resumes',
    'Unlimited cover letters',
    'All premium templates',
    'Unlimited exports',
    'ATS Scanner',
    'Priority email support',
    'Remove watermarks',
  ],
  // FIX: Changed 'PREMIUM' to 'BUSINESS'
  BUSINESS: [
    'Everything in Professional',
    'Interview Buddy AI',
    'Advanced analytics',
    'Team collaboration',
    'API access',
    'Priority phone support',
    'Custom branding',
  ],
};

// Helper to check if a tier includes a specific feature
export function tierIncludesFeature(tier: SubscriptionTier, feature: string): boolean {
  const features = FEATURES[tier] || [];
  // FIX: Added 'string' type to parameter 'f' to remove implicit 'any' error
  return features.some((f: string) => f.toLowerCase().includes(feature.toLowerCase()));
}

// Get display name for tier
export function getTierDisplayName(tier: SubscriptionTier): string {
  const names: Record<SubscriptionTier, string> = {
    FREE: 'Free',
    // FIX: Changed 'PROFESSIONAL' to 'PRO'
    PRO: 'Professional',
    // FIX: Changed 'PREMIUM' to 'BUSINESS'
    BUSINESS: 'Premium',
  };
  return names[tier] || tier;
}

// Get tier badge color
export function getTierBadgeColor(tier: SubscriptionTier): string {
  const colors: Record<SubscriptionTier, string> = {
    FREE: 'bg-gray-100 text-gray-800',
    // FIX: Changed 'PROFESSIONAL' to 'PRO'
    PRO: 'bg-purple-100 text-purple-800',
    // FIX: Changed 'PREMIUM' to 'BUSINESS'
    BUSINESS: 'bg-yellow-100 text-yellow-800',
  };
  return colors[tier] || 'bg-gray-100 text-gray-800';
}