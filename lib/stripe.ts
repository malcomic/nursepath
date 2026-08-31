import Stripe from 'stripe';
import { config } from '@/lib/config/env';

export const stripe = new Stripe(config.stripeSecretKey!, {});
