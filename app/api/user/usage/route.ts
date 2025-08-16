import { NextResponse } from 'next/server';
import { getUserSubscriptionTier } from '@/lib/subscription';
import { SUBSCRIPTION_PLANS } from '@/lib/subscription-client';
import { createClient } from '@/utils/create-client';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';



export async function GET(request: Request) {
  try {

    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    // Get userId from request header (sent by client)
    const userId = request.headers.get('x-user-id');
   const accessToken = request.headers.get('x-access-token');

    if (!userId || !accessToken) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized: Missing user ID' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 1. Get the user's subscription tier (e.g., 'FREE', 'PRO')
    const tier = await getUserSubscriptionTier(userId);

    // 2. Get the usage limits for that tier using the CORRECT property name
    const limit = SUBSCRIPTION_PLANS[tier]?.limits.coverLetters ?? 0;

    // 3. Get the user's current usage count from the correct database table.
    // const supabase = await createClient(accessToken); // Use service role for admin access
    const { count: usage, error: usageError } = await supabase
      .from('cover_letters')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (usageError) {
      throw usageError;
    }

    // 4. Return the user's current usage and their limit
    return NextResponse.json({
      usage: usage ?? 0,
      limit: limit,
    });

  } catch (error: any) {
    console.error('Error fetching user usage:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error', details: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}