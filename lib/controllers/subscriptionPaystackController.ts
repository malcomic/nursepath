import crypto from 'crypto';
import { z } from 'zod';
import { initializeTransaction } from '@/lib/paystack';
import { settingsService } from '@/lib/services/settingsService';
import { subscriptionService } from '@/lib/services/subscriptionService';
import { planService } from '@/lib/services/planService';
import { ApiError } from '@/lib/errors/api-error';
import { config } from '@/lib/config/env';

const initializeSubscriptionSchema = z.object({
  planCode: z.string().trim().min(1),
  method: z.enum(['card', 'mpesa']),
});

function buildAbsoluteUrl(base: string, pathAndQuery: string) {
  const url = new URL(base);
  const normalized = pathAndQuery.startsWith('/') ? pathAndQuery : `/${pathAndQuery}`;
  return new URL(normalized, url).toString();
}

export async function initializeLibrarySubscription(
  body: unknown,
  user: { id: string; email: string; name?: string | null }
) {
  const input = initializeSubscriptionSchema.parse(body);
  const plan = await planService.getByCode(input.planCode);

  if (plan.priceUsd <= 0) {
    throw new ApiError(400, 'Plan price must be greater than zero');
  }

  const subscription = await subscriptionService.createPending({
    userId: user.id,
    planCode: plan.code,
    paymentProvider: 'paystack',
  });

  const settings = await settingsService.getSettings();
  const reference = `np_sub_${subscription.id}_${crypto.randomBytes(4).toString('hex')}`;
  const usdTotal = plan.priceUsd;

  const callbackUrl = buildAbsoluteUrl(
    config.publicAppUrl!,
    `/library-success?subscription_id=${encodeURIComponent(subscription.id)}`
  );

  let currency: 'USD' | 'KES';
  let amount: number;
  let channels: Array<'card' | 'mobile_money'>;
  let kesTotal: number | undefined;

  if (input.method === 'card') {
    currency = 'USD';
    amount = Math.round(usdTotal * 100);
    channels = ['card'];
  } else {
    kesTotal = Math.round(usdTotal * Number(settings.usdToKesRate));
    currency = 'KES';
    amount = kesTotal * 100;
    channels = ['mobile_money'];
  }

  if (amount < 1) {
    throw new ApiError(400, 'Payment amount must be greater than zero');
  }

  const session = await initializeTransaction({
    email: user.email,
    amount,
    currency,
    reference,
    callback_url: callbackUrl,
    channels,
    metadata: {
      type: 'library_subscription',
      userId: user.id,
      planId: plan.id,
      planCode: plan.code,
      subscriptionId: subscription.id,
      method: input.method,
      usdTotal,
      ...(kesTotal !== undefined ? { kesTotal } : {}),
    },
  });

  await subscriptionService.setPaymentReference(subscription.id, reference);

  if (!session.authorization_url) {
    throw new ApiError(500, 'Paystack did not return a checkout URL');
  }

  return {
    success: true as const,
    data: {
      url: session.authorization_url,
      subscriptionId: subscription.id,
      reference,
    },
  };
}
