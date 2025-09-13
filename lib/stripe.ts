import { loadStripe } from '@stripe/stripe-js';
import type { Stripe as StripeJs } from '@stripe/stripe-js';
import Stripe from 'stripe';

let stripePromise: Promise<StripeJs | null>;

export const getStripe = () => {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!key) {
      console.error('Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY');
      return Promise.resolve(null);
    }
    stripePromise = loadStripe(key);
  }
  return stripePromise;
};

const createStripe = () => {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY is not defined');

  // ⬇️ Removed apiVersion to avoid TS literal mismatch
  return new Stripe(key, {
    appInfo: { name: 'AI Cover Letter Assistant', version: '1.0.0' },
  });
};

let stripe: Stripe;
try {
  stripe = createStripe();
} catch (e) {
  console.error('Failed to initialize Stripe:', e);
  stripe = new Proxy({} as Stripe, {
    get() {
      return () => {
        throw new Error('Stripe is not properly configured: STRIPE_SECRET_KEY is missing');
      };
    },
  });
}

export { stripe };
