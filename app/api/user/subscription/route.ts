// app/api/user/subscription/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { SUBSCRIPTION_PLANS } from "@/lib/subscription-client"
import { SubscriptionTier, SubscriptionStatus } from '@/types/subscription';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/utils/server-side-client';
import { cookies } from 'next/headers';







export async function GET(request: NextRequest) {
  try {
   

    const supabase = await createClient();
    const {data:{user}} = await supabase.auth.getUser()
    const {data:{session}} = await supabase.auth.getSession()

    const userId = user?.id;
    const accessToken = session?.access_token;


    if (!userId || !accessToken) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized: Missing user ID' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }


    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }


    // const supabase = await createClient(accessToken); // Use service role for admin access
    
    // Get user's subscription from database
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching subscription:', error);
      throw error;
    }

    console.log(subscription,'===========supabase subs response =============') // null
    
    // If no active subscription, return FREE tier status
    if (!subscription) {
      const freeStatus: SubscriptionStatus = {
        tier: 'FREE',
        status: 'active',
      };


      console.log("No active subscription found, returning FREE status");
      console.log("============FREE STATUS============", freeStatus);
      return NextResponse.json(freeStatus);
    }
    
    // For active subscriptions, get additional data from Stripe
    let stripeSubscription = null;
    if (subscription.stripe_subscription_id) {
      try {
        stripeSubscription = await stripe.subscriptions.retrieve(
          subscription.stripe_subscription_id
        );
      } catch (stripeError) {
        console.error('Error fetching Stripe subscription:', stripeError);
        // Continue without Stripe data
      }
    }
    
    // Map subscription data from the database to our SubscriptionStatus type
    const subscriptionStatus: SubscriptionStatus = {
      tier: mapPlanIdToTier(subscription.plan_id),
      interval: subscription.interval,
      currentPeriodEnd: subscription.current_period_end,
      cancelAtPeriodEnd: subscription.cancel_at_period_end || 
                          (stripeSubscription?.cancel_at_period_end || false),
      status: subscription.status,
    };
    
    console.log("============SUBSCRIPTION STATUS============", subscriptionStatus);
    return NextResponse.json(subscriptionStatus);
  } catch (error: any) {
    console.error('Error fetching user subscription:', error);
    
    return NextResponse.json(
      { error: error.message || 'Failed to fetch subscription information' }, 
      { status: 500 }
    );
  }
}

/**
 * Map subscription plan ID to subscription tier
 * This handles both simple plan names and Stripe price IDs
 */
function mapPlanIdToTier(planId: string): SubscriptionTier {
  // First check if it's a simple plan name
  const simplePlanMap: Record<string, SubscriptionTier> = {
    'free': 'FREE',
    'pro': 'PRO',
    
  };
  
  if (simplePlanMap[planId.toLowerCase()]) {
    return simplePlanMap[planId.toLowerCase()];
  }
  
  // Create a reverse map of Stripe price IDs to tiers
  const stripePriceToTier: Record<string, SubscriptionTier> = {};
  
  Object.entries(SUBSCRIPTION_PLANS).forEach(([tier, plan]) => {
    if (plan.stripePriceIds.monthly) {
      stripePriceToTier[plan.stripePriceIds.monthly] = tier as SubscriptionTier;
    }
    if (plan.stripePriceIds.quarterly) {
      stripePriceToTier[plan.stripePriceIds.quarterly] = tier as SubscriptionTier;
    }
    if (plan.stripePriceIds.annually) {
      stripePriceToTier[plan.stripePriceIds.annually] = tier as SubscriptionTier;
    }
  });
  
  // Check if the planId matches any Stripe price ID
  if (stripePriceToTier[planId]) {
    return stripePriceToTier[planId];
  }
  
  // Default to FREE if no match found
  console.warn(`Unknown plan ID: ${planId}, defaulting to FREE tier`);
  return 'FREE';
}