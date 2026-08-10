import Stripe from 'stripe';
import { env } from './env';


// Stripe used for the payment integration
if (!env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables.');
}

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2026-07-29.dahlia',
  typescript: true,
});

export default stripe;