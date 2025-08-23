// /app/api/webhook/route.js
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/utils/server-side-client';
import Stripe from 'stripe';

// This is your Stripe webhook secret
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');
  
  let event;
  
  try {
    if (!webhookSecret) {
      throw new Error('Stripe webhook secret is not set');
    }
    
    // Verify the webhook signature
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
  
  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;
        
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
        
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
        
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object);
        break;
        
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object);
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(`Error handling webhook: ${error.message}`);
    return NextResponse.json(
      { error: 'Failed to process webhook' }, 
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(session) {
  const supabase = await createClient();
  
  if (!session.subscription || !session.customer) {
    console.log('No subscription or customer in session');
    return;
  }
  
  const { userId, tier, interval } = session.metadata || {};
  
  if (!userId) {
    console.log('Missing userId in session metadata');
    return;
  }
  
  const subscription = await stripe.subscriptions.retrieve(session.subscription);
  
  await storeSubscription(
    subscription,
    userId,
    tier,
    interval
  );
  
  console.log(`Subscription created for user ${userId}`);
}

async function handleSubscriptionUpdated(subscription) {
  const supabase = await createClient();
  const customerId = subscription.customer;
  
  const { data: users, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', customerId);
  
  if (error || !users || users.length === 0) {
    console.error('User not found for customer:', customerId, error);
    return;
  }
  
  const userId = users[0].id;
  
  await updateSubscription(subscription, userId);
  
  console.log(`Subscription updated for user ${userId}, status: ${subscription.status}`);
}

async function handleSubscriptionDeleted(subscription) {
  const supabase = await createClient();
  const customerId = subscription.customer;
  
  const { data: users, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', customerId);
  
  if (error || !users || users.length === 0) {
    console.error('User not found for customer:', customerId, error);
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
  
  console.log(`Handling post-cancellation for user ${userId}`);
}

async function handleInvoicePaymentSucceeded(invoice) {
  const supabase = await createClient();
  const subscriptionId = invoice.subscription;
  
  if (!subscriptionId || !invoice.customer) {
    console.log('No subscription or customer in invoice');
    return;
  }
  
  const customerId = invoice.customer;
  
  const { data: users, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', customerId);
  
  if (error || !users || users.length === 0) {
    console.error('User not found for customer:', customerId, error);
    return;
  }
  
  const userId = users[0].id;
  
  // Fix: Ensure all timestamps are valid
  const createdAt = invoice.created 
    ? new Date(invoice.created * 1000).toISOString() 
    : new Date().toISOString();
    
  const periodStart = invoice.period_start 
    ? new Date(invoice.period_start * 1000).toISOString() 
    : new Date().toISOString();
    
  const periodEnd = invoice.period_end 
    ? new Date(invoice.period_end * 1000).toISOString() 
    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  
  await supabase
    .from('invoices')
    .insert({
      user_id: userId,
      stripe_invoice_id: invoice.id,
      stripe_subscription_id: subscriptionId,
      amount: invoice.amount_paid,
      currency: invoice.currency,
      status: invoice.status,
      created_at: createdAt,
      period_start: periodStart,
      period_end: periodEnd,
      invoice_pdf: invoice.invoice_pdf,
      description: invoice.description,
    });
  
  console.log(`Invoice recorded for user ${userId} for invoice ${invoice.id}`);
}

async function handleInvoicePaymentFailed(invoice) {
  const supabase = await createClient();
  const subscriptionId = invoice.subscription;
  
  if (!subscriptionId || !invoice.customer) {
    console.log('No subscription or customer in invoice');
    return;
  }
  
  const customerId = invoice.customer;
  
  const { data: users, error } = await supabase
    .from('profiles')
    .select('id, email')
    .eq('stripe_customer_id', customerId);
  
  if (error || !users || users.length === 0) {
    console.error('User not found for customer:', customerId, error);
    return;
  }
  
  const userId = users[0].id;
  const userEmail = users[0].email;
  
  await supabase
    .from('subscriptions')
    .update({
      status: 'past_due',
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .eq('stripe_subscription_id', subscriptionId);
  
  console.log(`Payment failure recorded for ${userEmail} for invoice ${invoice.id}`);
}

async function storeSubscription(subscription, userId, tier, interval) {
  const supabase = await createClient();
  const item = subscription.items.data[0];
  
  // CRITICAL FIX: Store the actual Stripe price ID, not a tier name
  const priceId = item.price.id;
  
  const subscriptionInterval = interval || getIntervalFromStripeInterval(item.plan.interval);
  
  try {
    const { data: existingSubscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('stripe_subscription_id', subscription.id)
      .single();
    
    // Fix: Properly handle timestamps
    const currentPeriodStart = subscription.current_period_start 
      ? new Date(subscription.current_period_start * 1000).toISOString()
      : new Date().toISOString();
    
    const currentPeriodEnd = subscription.current_period_end 
      ? new Date(subscription.current_period_end * 1000).toISOString()
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    
    const subscriptionData = {
      plan_id: priceId, // CRITICAL: Store the actual Stripe price ID
      status: subscription.status,
      current_period_start: currentPeriodStart,
      current_period_end: currentPeriodEnd,
      cancel_at_period_end: subscription.cancel_at_period_end,
      interval: subscriptionInterval,
      updated_at: new Date().toISOString(),
    };
    
    if (existingSubscription) {
      console.log(`Updating existing subscription for user ${userId} with price_id: ${priceId}`);
      await supabase
        .from('subscriptions')
        .update(subscriptionData)
        .eq('id', existingSubscription.id);
    } else {
      console.log(`Creating new subscription for user ${userId} with price_id: ${priceId}`);
      await supabase
        .from('subscriptions')
        .insert({
          user_id: userId,
          stripe_customer_id: subscription.customer,
          stripe_subscription_id: subscription.id,
          created_at: new Date().toISOString(),
          ...subscriptionData
        });
    }
    
    console.log(`Subscription stored/updated - User: ${userId}, Price ID: ${priceId}, Status: ${subscription.status}`);
  } catch (error) {
    console.error('Error storing subscription:', error);
    throw error;
  }
}

async function updateSubscription(subscription, userId) {
  const supabase = await createClient();
  
  try {
    // Fix: Properly handle timestamps
    const currentPeriodStart = subscription.current_period_start 
      ? new Date(subscription.current_period_start * 1000).toISOString()
      : new Date().toISOString();
    
    const currentPeriodEnd = subscription.current_period_end 
      ? new Date(subscription.current_period_end * 1000).toISOString()
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    
    // Get the price ID from the subscription
    const priceId = subscription.items.data[0]?.price?.id;
    
    await supabase
      .from('subscriptions')
      .update({
        plan_id: priceId, // Store the actual Stripe price ID
        status: subscription.status,
        current_period_start: currentPeriodStart,
        current_period_end: currentPeriodEnd,
        cancel_at_period_end: subscription.cancel_at_period_end,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('stripe_subscription_id', subscription.id);
      
    console.log(`Subscription updated for user ${userId} with price_id: ${priceId}`);
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }
}

function getIntervalFromStripeInterval(stripeInterval) {
  switch (stripeInterval) {
    case 'month':
      return 'monthly';
    case 'year':
      return 'annually';
    default:
      return 'monthly';
  }
}