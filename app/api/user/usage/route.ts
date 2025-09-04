// app/api/user/usage/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/api-helpers';
import { getUsageStats } from '@/lib/usage-tracking';

export async function GET(request: NextRequest) {
  return withAuth(request, async ({ userId, isPro, supabase }) => {
    try {
      // PRO users have unlimited usage
      if (isPro) {
        return NextResponse.json({
          isPro: true,
          usage: {},
          message: 'PRO users have unlimited access to all features'
        });
      }

      // Get usage stats for FREE users
      const stats = await getUsageStats(userId, true);
      
      // Get specific feature from query params if requested
      const { searchParams } = new URL(request.url);
      const feature = searchParams.get('feature');
      
      if (feature && stats[feature]) {
        return NextResponse.json({
          ...stats[feature]
        });
      }
      
      // Return all usage stats
      return NextResponse.json({
        isPro: false,
        usage: stats,
        currentPeriod: {
          start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
          end: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59, 999).toISOString()
        }
      });
      
    } catch (error: any) {
      console.error('Error fetching usage:', error);
      return NextResponse.json(
        { error: 'Failed to fetch usage information' },
        { status: 500 }
      );
    }
  });
}