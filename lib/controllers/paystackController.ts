import crypto from 'crypto';
import { z } from 'zod';
import {
  initializeTransaction,
  verifyPaystackSignature,
  verifyTransaction,
} from '@/lib/paystack';
import { guideRepository } from '@/lib/repositories/guideRepository';
import { orderRepository } from '@/lib/repositories/orderRepository';
import { settingsService } from '@/lib/services/settingsService';
import { ApiError } from '@/lib/errors/api-error';
import { PaymentStatus } from '@/lib/generated/prisma/enums';
import { config } from '@/lib/config/env';
import { orderService } from '@/lib/services/orderService';
import { subscriptionService } from '@/lib/services/subscriptionService';
import { subscriptionRepository } from '@/lib/repositories/subscriptionRepository';
import { getUserSession } from '@/lib/auth/verify-user';

const initializePaymentSchema = z
  .object({
    guideId: z.string().min(1).optional(),
    guideIds: z.array(z.string().min(1)).min(1).optional(),
    buyerName: z.string().trim().min(1).max(255),
    buyerEmail: z.string().trim().email(),
    method: z.enum(['card', 'mpesa']),
  })
  .refine((data) => Boolean(data.guideId || (data.guideIds && data.guideIds.length > 0)), {
    message: 'guideId or guideIds is required',
  });

function buildAbsoluteUrl(base: string, pathAndQuery: string) {
  const url = new URL(base);
  const normalized = pathAndQuery.startsWith('/') ? pathAndQuery : `/${pathAndQuery}`;
  return new URL(normalized, url).toString();
}

function resolveGuideIds(input: z.infer<typeof initializePaymentSchema>): string[] {
  if (input.guideIds?.length) {
    return [...new Set(input.guideIds)];
  }
  return input.guideId ? [input.guideId] : [];
}

export async function initializePayment(body: unknown, ipAddress?: string) {
  const input = initializePaymentSchema.parse(body);
  const guideIds = resolveGuideIds(input);

  const guides = await Promise.all(guideIds.map((id) => guideRepository.findById(id)));
  if (guides.some((g) => !g)) {
    throw new ApiError(404, 'One or more guides were not found');
  }

  const validGuides = guides.filter((g): g is NonNullable<typeof g> => Boolean(g));
  const paidGuides = validGuides.filter((g) => Number(g.price) > 0);
  const freeGuides = validGuides.filter((g) => Number(g.price) === 0);

  if (paidGuides.length === 0) {
    throw new ApiError(400, 'Use free checkout for carts with only free guides');
  }

  const settings = await settingsService.getSettings();
  const now = new Date();
  const downloadExpiresAt = new Date(
    now.getTime() + settings.downloadExpiryHours * 60 * 60 * 1000
  );

  const allGuidesForOrders = [...paidGuides, ...freeGuides];
  const sessionUser = await getUserSession();
  const orders = [];
  for (const guide of allGuidesForOrders) {
    const order = await orderRepository.create({
      customerName: input.buyerName,
      customerEmail: input.buyerEmail,
      guideId: guide.id,
      price: guide.price,
      paymentStatus: PaymentStatus.PENDING,
      downloadToken: crypto.randomUUID(),
      downloadExpiresAt,
      maxDownloads: settings.maxDownloads,
      paymentProvider: Number(guide.price) === 0 ? 'free' : 'paystack',
      ipAddress,
      ...(sessionUser?.id ? { userId: sessionUser.id } : {}),
    });
    orders.push(order);
  }

  const primaryOrderId = orders[0].id;
  const reference = `np_${primaryOrderId}_${crypto.randomBytes(4).toString('hex')}`;
  const usdTotal = paidGuides.reduce((sum, g) => sum + Number(g.price), 0);

  const callbackUrl = buildAbsoluteUrl(
    config.publicAppUrl!,
    `/payment-success?order_id=${encodeURIComponent(primaryOrderId)}`
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
    email: input.buyerEmail,
    amount,
    currency,
    reference,
    callback_url: callbackUrl,
    channels,
    metadata: {
      orderId: primaryOrderId,
      orderIds: orders.map((o) => o.id).join(','),
      method: input.method,
      usdTotal,
      ...(kesTotal !== undefined ? { kesTotal } : {}),
    },
  });

  await Promise.all(
    orders.map((order) => orderRepository.update(order.id, { paymentReference: reference }))
  );

  if (!session.authorization_url) {
    throw new ApiError(500, 'Paystack did not return a checkout URL');
  }

  return {
    success: true as const,
    data: {
      url: session.authorization_url,
      orderId: primaryOrderId,
      orderIds: orders.map((o) => o.id),
      reference,
    },
  };
}

export async function handlePaystackWebhook(rawBody: string, signature: string | null) {
  if (!signature) {
    throw new ApiError(400, 'Missing Paystack signature');
  }

  if (!verifyPaystackSignature(rawBody, signature)) {
    throw new ApiError(400, 'Invalid Paystack signature');
  }

  let event: { event?: string; data?: { reference?: string; status?: string } };
  try {
    event = JSON.parse(rawBody) as {
      event?: string;
      data?: { reference?: string; status?: string };
    };
  } catch {
    throw new ApiError(400, 'Invalid webhook payload');
  }

  if (event.event === 'charge.success') {
    const reference = event.data?.reference;
    if (!reference) {
      throw new ApiError(400, 'Missing transaction reference');
    }

    const verified = await verifyTransaction(reference);
    if (verified.status !== 'success') {
      return { received: true };
    }

    const meta = verified.metadata as
      | { type?: string; orderId?: string; subscriptionId?: string }
      | undefined;

    const isLibrarySub =
      meta?.type === 'library_subscription' || reference.startsWith('np_sub_');

    if (isLibrarySub) {
      let sub = await subscriptionRepository.findByPaymentReference(reference);
      if (!sub && meta?.subscriptionId) {
        sub = await subscriptionRepository.findById(meta.subscriptionId);
        if (sub && !sub.paymentReference) {
          await subscriptionService.setPaymentReference(sub.id, reference);
        }
      }
      if (sub) {
        await subscriptionService.activateFromPayment(reference).catch((err) => {
          console.error('Failed to activate library subscription:', err);
        });
      }
      return { received: true };
    }

    const baseUrl = config.publicAppUrl || 'http://localhost:3000';
    const byRef = await orderRepository.findByPaymentReference(reference);

    if (byRef.length > 0) {
      const pending = byRef.filter((o) => o.paymentStatus !== PaymentStatus.PAID);
      await Promise.all(
        pending.map((order) =>
          orderRepository.update(order.id, {
            paymentStatus: PaymentStatus.PAID,
            paymentReference: reference,
            paymentProvider: order.paymentProvider === 'free' ? 'free' : 'paystack',
          })
        )
      );

      if (pending.length > 0) {
        await orderService.fulfillOrdersByPaymentReference(reference, baseUrl).catch((err) => {
          console.error('Failed to send fulfillment email:', err);
        });
      }
      return { received: true };
    }

    // Legacy metadata fallback (single order)
    const orderId = meta?.orderId;
    if (!orderId) {
      throw new ApiError(400, 'Missing orderId for payment reference');
    }

    const existing = await orderRepository.findById(orderId);
    if (existing && existing.paymentStatus !== PaymentStatus.PAID) {
      await orderRepository.update(orderId, {
        paymentStatus: PaymentStatus.PAID,
        paymentReference: reference,
        paymentProvider: 'paystack',
      });

      await orderService.fulfillPaidOrder(orderId, baseUrl).catch((err) => {
        console.error('Failed to send fulfillment email:', err);
      });
    }
  }

  return { received: true };
}
