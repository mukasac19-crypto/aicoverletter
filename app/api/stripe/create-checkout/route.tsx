// app/api/stripe/create-checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { SubscriptionTier } from '@/types/subscription';
import { stripe } from '@/lib/stripe';

const STRIPE_PRO_MONTHLY_PRICE_ID =
  process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID;
const STRIPE_PRO_ANNUAL_ONETIME_PRICE_ID =
  process.env.NEXT_PUBLIC_STRIPE_PRO_ANNUAL_ONETIME_PRICE_ID;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const tier = (searchParams.get('tier') as SubscriptionTier) || 'PRO';
    const interval = (searchParams.get('interval') as 'monthly' | 'annually') || 'monthly';
    const redirect = searchParams.get('redirect') || '/dashboard/billing';

    if (!['PRO', 'BUSINESS'].includes(tier)) {
      return NextResponse.json({ error: 'Invalid subscription tier.' }, { status: 400 });
    }
    if (!['monthly', 'annually'].includes(interval)) {
      return NextResponse.json({ error: 'Invalid billing interval.' }, { status: 400 });
    }

    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      return NextResponse.json({ error: 'Failed to get session' }, { status: 500 });
    }
    if (!session) {
      const loginUrl = `/auth/login?redirect=${encodeURIComponent(request.nextUrl.pathname + request.nextUrl.search)}`;
      return NextResponse.redirect(new URL(loginUrl, request.url));
    }

    // pick price + mode per product
    let priceId: string | undefined;
    let mode: 'payment' | 'subscription' = 'payment';

    if (tier === 'PRO') {
      if (interval === 'monthly') {
        priceId = STRIPE_PRO_MONTHLY_PRICE_ID || '';
        mode = 'subscription';                 // Monthly auto-renew
      } else {
        priceId = STRIPE_PRO_ANNUAL_ONETIME_PRICE_ID || ''; // Annual pay-once
        mode = 'payment';
      }
    }

    if (!priceId) {
      const errorUrl = `/error?message=${encodeURIComponent(`Configuration error: Price ID missing for ${tier}/${interval}`)}`;
      return NextResponse.redirect(new URL(errorUrl, request.url));
    }

    // ensure Stripe customer
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_customer_id, email, full_name')
      .eq('id', session.user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    let customerId = profile.stripe_customer_id || undefined;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: profile.email || session.user.email || undefined,
        name: profile.full_name || undefined,
        metadata: { userId: session.user.id },
      });
      customerId = customer.id;
      await supabase.from('profiles').update({ stripe_customer_id: customerId }).eq('id', session.user.id);
    }

    const origin = request.headers.get('origin') || request.nextUrl.origin;
    const successUrl = `${origin}/dashboard/billing/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}${redirect}`;

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      mode,
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
      metadata: {
        userId: session.user.id,
        tier,
        interval,            // 'monthly' | 'annually'
        purchaseType: mode === 'payment' ? 'one_time' : 'subscription',
      },
    });

    if (!checkoutSession.url) {
      throw new Error('Failed to create Checkout session URL.');
    }
    return NextResponse.redirect(checkoutSession.url);
  } catch (error: any) {
    const msg = error?.raw?.message || error?.message || 'Unexpected error';
    const errorUrl = `/error?message=${encodeURIComponent(msg)}`;
    return NextResponse.redirect(new URL(errorUrl, request.url));
  }
}
