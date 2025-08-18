// /app/api/webhook/route.js
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

import Stripe from 'stripe';
import { createClient } from 'redis';

 const supabase = await createClient();

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
  if (!session.subscription || !session.customer) {
    console.log('No subscription or customer in session');
    return;
  }
  
  const { userId, tier, interval } = session.metadata || {};
  
  if (!userId || !tier) {
    console.log('Missing userId or tier in session metadata');
    return;
  }
  
  const subscription = await stripe.subscriptions.retrieve(session.subscription);
  
  await storeSubscription(
    subscription,
    userId,
    tier,
    interval
  );
  
  console.log(`Subscription created for user ${userId}, tier: ${tier}, interval: ${interval}`);
}

async function handleSubscriptionUpdated(subscription) {
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
  const item = subscription.items.data[0];
  
  // The tier from metadata should already be 'PRO' or 'BUSINESS'
  // But let's add validation to be safe
  let planId = tier ? tier.toLowerCase() : 'free';
  
  // Additional validation - if somehow a price ID got passed as tier
  const priceIdToPlan = {
    'price_1RtXicBh2Msdef2rHNoQe5X1': 'pro', // Monthly Pro
    'price_1RtWyHBh2Msdef2rWGr9VmwJ': 'pro', // Annual Pro
    // Add other price IDs here as needed
  };
  
  // If the tier is a price ID, convert it to plan name
  if (priceIdToPlan[tier]) {
    planId = priceIdToPlan[tier];
  } else if (tier && tier.startsWith('price_')) {
    // If it's a price ID we don't recognize, default to 'pro'
    console.warn(`Unknown price ID passed as tier: ${tier}, defaulting to 'pro'`);
    planId = 'pro';
  }
  
  // Ensure planId is lowercase to match your mapPlanIdToTier function
  planId = planId.toLowerCase();
  
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
      plan_id: planId,
      status: subscription.status,
      current_period_start: currentPeriodStart,
      current_period_end: currentPeriodEnd,
      cancel_at_period_end: subscription.cancel_at_period_end,
      interval: subscriptionInterval,
      updated_at: new Date().toISOString(),
    };
    
    if (existingSubscription) {
      console.log(`Updating existing subscription for user ${userId} with plan_id: ${planId}`);
      await supabase
        .from('subscriptions')
        .update(subscriptionData)
        .eq('id', existingSubscription.id);
    } else {
      console.log(`Creating new subscription for user ${userId} with plan_id: ${planId}`);
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
    
    console.log(`Subscription stored/updated - User: ${userId}, Plan: ${planId}, Status: ${subscription.status}`);
  } catch (error) {
    console.error('Error storing subscription:', error);
    throw error;
  }
}

async function updateSubscription(subscription, userId) {
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
    
    // Map price ID to plan_id
    const priceIdToPlan = {
      'price_1RtXicBh2Msdef2rHNoQe5X1': 'pro', // Monthly Pro
      'price_1RtWyHBh2Msdef2rWGr9VmwJ': 'pro', // Annual Pro
      // Add other price IDs here as needed
    };
    
    let planId = 'free'; // Default
    if (priceIdToPlan[priceId]) {
      planId = priceIdToPlan[priceId];
    }
    
    await supabase
      .from('subscriptions')
      .update({
        plan_id: planId,
        status: subscription.status,
        current_period_start: currentPeriodStart,
        current_period_end: currentPeriodEnd,
        cancel_at_period_end: subscription.cancel_at_period_end,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('stripe_subscription_id', subscription.id);
      
    console.log(`Subscription updated for user ${userId} with plan_id: ${planId}`);
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