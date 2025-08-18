// app/actions/subscription.ts
"use server";

import { createClient } from '@/utils/server-side-client'; // Your server-side Supabase client helper
import { cookies } from 'next/headers'; // To access the user's session cookies on the server
import { SubscriptionStatus, SubscriptionTier } from '@/types/subscription'; // Your existing types
import { LimitedFeature } from '@/lib/subscription-enforcement'; // Your existing types

// Helper to create a server-side Supabase client


interface GetSubscriptionDataResponse {
  subscription: SubscriptionStatus | null;
  usageStats: Record<LimitedFeature, any> | null;
  error: string | null;
}

/**
 * Server Action to fetch a user's subscription status and usage statistics.
 * This runs on the server, so it's secure.
 */
export async function getSubscriptionData(): Promise<GetSubscriptionDataResponse> {
 

  try {
    const supabase = await createClient();
    
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;

    console.log("===========SERVER ACTION USER ============", session);
     

    if (!user) {
      return { subscription: null, usageStats: null, error: null }; // No user, no subscription/usage data
    }

    // You might need to adjust your API routes /api/user/subscription and /api/user/usage
    // to either be replaced by direct Supabase calls here, or for these server actions
    // to make internal fetch calls to those existing API routes.
    // For simplicity and to completely bypass client-side headers, we'll assume direct Supabase calls here.
    // If you need to keep your existing API routes, modify this section to `fetch` them internally.

    // Fetch subscription data directly from Supabase (assuming you have a 'subscriptions' table)
    const { data: subData, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single(); // Assuming one subscription per user

    if (subError && subError.code !== 'PGRST116') { // PGRST116 is "No rows found", which is fine for no sub
      console.error('Error fetching subscription from DB:', subError);
      return { subscription: null, usageStats: null, error: subError.message };
    }

    const subscription: SubscriptionStatus | null = subData ? {
      tier: subData.tier as SubscriptionTier, // Cast to your SubscriptionTier type
      status: subData.status,
      // Add other relevant fields from your 'subscriptions' table
      // current_period_end: subData.current_period_end,
      // ... etc
    } : null;

    // Fetch usage data directly from Supabase (assuming you have a 'usage_metrics' table or similar)
    // This is a simplified example. Your actual usage tracking might be more complex.
    const { data: usageMetrics, error: usageError } = await supabase
      .from('usage_metrics')
      .select('*')
      .eq('user_id', user.id)
      .single(); // Assuming one usage metrics record per user

    if (usageError && usageError.code !== 'PGRST116') {
      console.error('Error fetching usage metrics from DB:', usageError);
      return { subscription, usageStats: null, error: usageError.message };
    }

    const usageStats: Record<any,any> | null = usageMetrics ? {
      coverLetters: {
        used: usageMetrics.cover_letters_used || 0,
        limit: usageMetrics.cover_letters_limit || 5, // Default for free tier
        unlimited: usageMetrics.cover_letters_unlimited || false,
      },
      resumes: {
        used: usageMetrics.resumes_used || 0,
        limit: usageMetrics.resumes_limit || 2, // Default for free tier
        unlimited: usageMetrics.resumes_unlimited || false,
      },
      atsScans: {
        used: usageMetrics.ats_scans_used || 0,
        limit: usageMetrics.ats_scans_limit || 10, // Default for free tier
        unlimited: usageMetrics.ats_scans_unlimited || false,
      },
      // Add other features as needed
    } : null;

    // IMPORTANT: Define default usage limits if no usageMetrics are found (e.g., new user)
    // This provides fallback values for FREE tier
    const defaultUsageStats: Record<any,any> = {
      coverLetters: { used: 0, limit: 5, unlimited: false },
      resumes: { used: 0, limit: 2, unlimited: false },
      atsScans: { used: 0, limit: 10, unlimited: false },
    };

    return {
      subscription,
      usageStats: usageStats || defaultUsageStats, // Use default if no record found
      error: null
    };

  } catch (err: any) {
    console.error('Server Action Error (getSubscriptionData):', err);
    return { subscription: null, usageStats: null, error: err.message || 'An unknown error occurred.' };
  }
}


interface CheckAndTrackResponse {
  allowed: boolean;
  reason?: string;
  error?: string; // For server-side errors
}

/**
 * Server Action to check and track usage for a specific feature.
 * This replaces your /api/subscription/check-and-track API route.
 */
export async function checkAndTrackUsage(feature: LimitedFeature): Promise<CheckAndTrackResponse> {
  const supabase = await createClient()

  try {
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;

    console.log("===========SERVER ACTION USER vcx ============", user);

    if (!user) {
      return { allowed: false, reason: 'User not authenticated.' };
    }

    // Fetch current usage limits for the user
    const { data: usageMetrics, error: fetchError } = await supabase
      .from('usage_metrics')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching usage metrics for tracking:', fetchError);
      return { allowed: false, reason: 'Failed to retrieve usage data.', error: fetchError.message };
    }

    // Determine current usage and limit
    let currentUsed = usageMetrics?.[`${feature}_used`] || 0;
    const currentLimit = usageMetrics?.[`${feature}_limit`] || 0;
    const isUnlimited = usageMetrics?.[`${feature}_unlimited`] || false;

    // Check if allowed
    if (!isUnlimited && currentUsed >= currentLimit) {
      return { allowed: false, reason: `You have reached your limit for ${feature}.` };
    }

    // Increment usage
    const newUsed = currentUsed + 1;

    // Update usage in the database
    const { data, error: updateError } = await supabase
      .from('usage_metrics')
      .upsert(
        { user_id: user.id, [`${feature}_used`]: newUsed },
        { onConflict: 'user_id' } // Insert if not exists, update if exists
      )
      .single();

    if (updateError) {
      console.error('Error updating usage metrics:', updateError);
      return { allowed: false, reason: 'Failed to update usage.', error: updateError.message };
    }

    return { allowed: true };

  } catch (err: any) {
    console.error('Server Action Error (checkAndTrackUsage):', err);
    return { allowed: false, reason: 'An unexpected server error occurred.', error: err.message };
  }
}
