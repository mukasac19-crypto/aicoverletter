
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';
import { stripe } from '@/lib/stripe';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: adminData, error: adminError } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', session.user.id)
      .single();

    if (adminError || !adminData?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch data from Stripe
    const balance = await stripe.balance.retrieve();
    const totalRevenue = balance.pending.reduce((acc, curr) => acc + curr.amount, 0);

    // Fetch data from Supabase
    const { count: userCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact' });

    const { count: subscriptionCount } = await supabase
        .from('subscriptions')
        .select('*', { count: 'exact' });

    return NextResponse.json({
      totalRevenue: totalRevenue / 100, // Convert from cents to dollars
      userCount,
      subscriptionCount,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

