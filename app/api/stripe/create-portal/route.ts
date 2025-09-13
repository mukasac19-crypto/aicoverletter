// app/api/stripe/create-portal/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { stripe } from '@/lib/stripe'; // ✅ reuse shared instance (no apiVersion type clash)

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', session.user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }
    if (!profile.stripe_customer_id) {
      return NextResponse.json({ error: 'Stripe customer ID not found' }, { status: 400 });
    }

    const { returnUrl } = await request.json().catch(() => ({ returnUrl: null }));
    const defaultReturnUrl = `${request.nextUrl.origin}/dashboard/billing`;

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: returnUrl || defaultReturnUrl,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (err: any) {
    console.error('Error creating Stripe portal session:', err);
    return NextResponse.json({ error: err.message || 'Failed to create portal session' }, { status: 500 });
  }
}
