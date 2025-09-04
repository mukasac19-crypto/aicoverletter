// app/api/user/subscription/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/api-helpers';
import { SubscriptionStatus } from '@/types/subscription';

export async function GET(request: NextRequest) {
  return withAuth(request, async ({ userId, isPro, supabase }) => {
    try {
      // If no active subscription, return FREE status
      if (!isPro) {
        const freeStatus: SubscriptionStatus = {
          tier: 'FREE',
          status: 'active',
        };
        return NextResponse.json(freeStatus);
      }

      // Get subscription details
      const { data: subscription, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();

      if (error || !subscription) {
        // No subscription found, return FREE
        const freeStatus: SubscriptionStatus = {
          tier: 'FREE',
          status: 'active',
        };
        return NextResponse.json(freeStatus);
      }

      // Return PRO subscription status
      const subscriptionStatus: SubscriptionStatus = {
        tier: 'PRO',
        interval: subscription.interval,
        currentPeriodEnd: subscription.current_period_end,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        status: subscription.status,
      };

      return NextResponse.json(subscriptionStatus);
      
    } catch (error: any) {
      console.error('Error fetching subscription:', error);
      return NextResponse.json(
        { error: 'Failed to fetch subscription information' },
        { status: 500 }
      );
    }
  });
}