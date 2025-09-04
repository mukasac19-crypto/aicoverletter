// lib/subscription-plans.ts
import { SubscriptionPlan, SubscriptionTier } from '@/types/subscription';

// Simplified for FREE and PRO tiers only
export const SUBSCRIPTION_PLANS: Record<Exclude<SubscriptionTier, 'BUSINESS'>, SubscriptionPlan> = {
  FREE: {
    id: 'free',
    name: 'Free',
    description: 'Get started with basic features',
    features: [
      'Up to 3 resumes',
      'Up to 5 cover letters per month',
      'Basic templates',
      '10 exports per month',
      'Email support',
    ],
    limits: {
      coverLetters: 5,
      resumes: 3,
      templates: 'basic',
      atsScans: 0, // No ATS scans for free
      interviewSessions: 0, // No interview sessions
    },
    price: {
      monthly: 0,
      quarterly: 0,
      annually: 0,
    },
    stripePriceIds: {
      monthly: '',
      quarterly: '',
      annually: '',
    },
  },
  PRO: {
    id: 'pro',
    name: 'Professional',
    description: 'Everything you need for your job search',
    features: [
      'Unlimited resumes',
      'Unlimited cover letters',
      'All premium templates',
      'Unlimited exports',
      'ATS Scanner',
      'Priority email support',
      'Remove watermarks',
    ],
    limits: {
      coverLetters: -1, // -1 means unlimited
      resumes: -1,
      templates: 'all',
      atsScans: -1,
      interviewSessions: -1,
    },
    price: {
      monthly: 20,
      quarterly: 54, // 10% discount
      annually: 200, // ~17% discount
    },
    stripePriceIds: {
      // TODO: Replace with your actual Stripe Price IDs
      monthly: process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID || '',
      quarterly: process.env.NEXT_PUBLIC_STRIPE_PRO_QUARTERLY_PRICE_ID || '',
      annually: process.env.NEXT_PUBLIC_STRIPE_PRO_ANNUAL_PRICE_ID || '',
    },
  },
};