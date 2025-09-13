// app/api/stripe/webhooks/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature') as string;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Error handling webhook:', error.message);
    return NextResponse.json({ error: 'Failed to process webhook' }, { status: 500 });
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  if (!session.customer) {
    console.log('No customer on session');
    return;
  }

  const { userId, tier, interval, purchaseType } = session.metadata || {};
  if (!userId || !tier) {
    console.log('Missing metadata userId/tier');
    return;
  }

  // ONE-TIME ANNUAL (mode=payment) — no subscription object
  if (!session.subscription || purchaseType === 'one_time') {
    const now = new Date();
    const ends = new Date(now);
    ends.setFullYear(now.getFullYear() + 1); // 12 months access

    await supabase.from('subscriptions').insert({
      user_id: userId,
      stripe_customer_id: session.customer as string,
      stripe_subscription_id: null,                 // schema now allows null
      plan_id: tier,                                // e.g. 'PRO'
      status: 'active',
      interval: 'annually',
      cancel_at_period_end: false,
      current_period_start: now.toISOString(),
      current_period_end: ends.toISOString(),
      purchase_type: 'one_time',
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    });

    console.log(`Granted one-time annual to ${userId} until ${ends.toISOString()}`);
    return;
  }

  // SUBSCRIPTION path (Monthly)
  const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
  await storeSubscription(subscription, userId, tier as string, (interval as string) || 'monthly');
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  const { data: users } = await supabase
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', customerId);

  if (!users || users.length === 0) {
    console.error('User not found for customer:', customerId);
    return;
  }

  const userId = users[0].id;
  await updateSubscription(subscription, userId);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  const { data: users } = await supabase
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', customerId);

  if (!users || users.length === 0) {
    console.error('User not found for customer:', customerId);
    return;
  }

  const userId = users[0].id;

  await supabase
    .from('subscriptions')
    .update({
      status: 'canceled',
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .eq('stripe_subscription_id', subscription.id);
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const inv: any = invoice;
  const subscriptionId = typeof inv.subscription === 'string' ? inv.subscription : null;
  if (!subscriptionId || !invoice.customer) return;

  const { data: users } = await supabase
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', invoice.customer as string);

  if (!users || users.length === 0) return;
  const userId = users[0].id;

  await supabase.from('invoices').insert({
    user_id: userId,
    stripe_invoice_id: invoice.id,
    stripe_subscription_id: subscriptionId,
    amount: invoice.amount_paid!,
    currency: invoice.currency!,
    status: invoice.status!,
    created_at: new Date(invoice.created! * 1000).toISOString(),
    period_start: invoice.period_start ? new Date(invoice.period_start * 1000).toISOString() : null,
    period_end: invoice.period_end ? new Date(invoice.period_end * 1000).toISOString() : null,
    invoice_pdf: invoice.invoice_pdf || null,
    description: invoice.description || null,
    metadata: invoice.metadata || null,
  });
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const inv: any = invoice;
  const subscriptionId = typeof inv.subscription === 'string' ? inv.subscription : null;
  if (!subscriptionId || !invoice.customer) return;

  const { data: users } = await supabase
    .from('profiles')
    .select('id, email')
    .eq('stripe_customer_id', invoice.customer as string);

  if (!users || users.length === 0) return;
  const userId = users[0].id;

  await supabase
    .from('subscriptions')
    .update({
      status: 'past_due',
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .eq('stripe_subscription_id', subscriptionId);
}

async function storeSubscription(
  subscription: Stripe.Subscription,
  userId: string,
  tier: string,
  interval?: string
) {
  const sub: any = subscription;
  const nowIso = new Date().toISOString();

  const data = {
    plan_id: tier,
    status: sub.status,
    current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
    current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
    cancel_at_period_end: sub.cancel_at_period_end,
    interval: interval || 'monthly',
    updated_at: nowIso,
    purchase_type: 'subscription' as const,
  };

  const { data: existing } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('stripe_subscription_id', sub.id)
    .single();

  if (existing) {
    await supabase.from('subscriptions').update(data).eq('id', existing.id);
  } else {
    await supabase.from('subscriptions').insert({
      user_id: userId,
      stripe_customer_id: sub.customer as string,
      stripe_subscription_id: sub.id,
      created_at: nowIso,
      ...data,
    });
  }
}

async function updateSubscription(subscription: Stripe.Subscription, userId: string) {
  const sub: any = subscription;

  await supabase
    .from('subscriptions')
    .update({
      status: sub.status,
      current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
      current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
      cancel_at_period_end: sub.cancel_at_period_end,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .eq('stripe_subscription_id', sub.id);
}
