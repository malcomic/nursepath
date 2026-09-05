import crypto from 'crypto';
import type Stripe from 'stripe';
import { z } from 'zod';
import { stripe } from '@/lib/stripe';
import { guideRepository } from '@/lib/repositories/guideRepository';
import { orderRepository } from '@/lib/repositories/orderRepository';
import { settingsService } from '@/lib/services/settingsService';
import { ApiError } from '@/lib/errors/api-error';
import { PaymentStatus } from '@/lib/generated/prisma/enums';
import { config } from '@/lib/config/env';
import { orderService } from '@/lib/services/orderService';

const createCheckoutSessionSchema = z
  .object({
    guideId: z.string().min(1).optional(),
    guideIds: z.array(z.string().min(1)).min(1).optional(),
    buyerName: z.string().trim().min(1).max(255),
    buyerEmail: z.string().trim().email(),
  })
  .refine((data) => Boolean(data.guideId || (data.guideIds && data.guideIds.length > 0)), {
    message: 'guideId or guideIds is required',
  });

function buildAbsoluteUrl(base: string, pathAndQuery: string) {
  const url = new URL(base);
  const normalized = pathAndQuery.startsWith('/') ? pathAndQuery : `/${pathAndQuery}`;
  return new URL(normalized, url).toString();
}

function resolveGuideIds(input: z.infer<typeof createCheckoutSessionSchema>): string[] {
  if (input.guideIds?.length) {
    return [...new Set(input.guideIds)];
  }
  return input.guideId ? [input.guideId] : [];
}

export async function createCheckoutSession(body: unknown, ipAddress?: string) {
  const input = createCheckoutSessionSchema.parse(body);
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

  for (const guide of paidGuides) {
    if (!guide.stripePriceId) {
      throw new ApiError(400, `"${guide.title}" is not configured for Stripe checkout yet`);
    }
  }

  // Mixed cart: free items stay PENDING until paid checkout succeeds (fulfilled in webhook)
  const settings = await settingsService.getSettings();
  const now = new Date();
  const downloadExpiresAt = new Date(
    now.getTime() + settings.downloadExpiryHours * 60 * 60 * 1000
  );

  const allGuidesForOrders = [...paidGuides, ...freeGuides];
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
      paymentProvider: Number(guide.price) === 0 ? 'free' : 'stripe',
      ipAddress,
    });
    orders.push(order);
  }

  const primaryOrderId = orders[0].id;
  const successUrl = buildAbsoluteUrl(
    config.publicAppUrl!,
    `/payment-success?order_id=${encodeURIComponent(primaryOrderId)}`
  );
  const cancelUrl = buildAbsoluteUrl(config.publicAppUrl!, '/cart');

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: paidGuides.map((guide) => ({
      price: guide.stripePriceId!,
      quantity: 1,
    })),
    customer_email: input.buyerEmail,
    client_reference_id: primaryOrderId,
    metadata: {
      orderId: primaryOrderId,
      orderIds: orders.map((o) => o.id).join(','),
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  await Promise.all(
    orders.map((order) => orderRepository.update(order.id, { paymentReference: session.id }))
  );

  if (!session.url) {
    throw new ApiError(500, 'Stripe did not return a checkout URL');
  }

  return {
    success: true as const,
    data: { url: session.url, orderId: primaryOrderId, orderIds: orders.map((o) => o.id) },
  };
}

export async function handleStripeWebhook(rawBody: string, signature: string | null) {
  if (!signature) {
    throw new ApiError(400, 'Missing Stripe signature');
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      config.stripeWebhookSecret!
    );
  } catch (err) {
    throw new ApiError(400, err instanceof Error ? err.message : 'Invalid signature');
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const baseUrl = config.publicAppUrl || 'http://localhost:3000';

    // Prefer fulfilling the whole cart by payment reference (session id)
    const byRef = await orderRepository.findByPaymentReference(session.id);
    if (byRef.length > 0) {
      const pending = byRef.filter((o) => o.paymentStatus !== PaymentStatus.PAID);
      await Promise.all(
        pending.map((order) =>
          orderRepository.update(order.id, {
            paymentStatus: PaymentStatus.PAID,
            paymentReference: session.id,
            paymentProvider: order.paymentProvider || 'stripe',
          })
        )
      );

      if (pending.length > 0) {
        await orderService.fulfillOrdersByPaymentReference(session.id, baseUrl).catch((err) => {
          console.error('Failed to send fulfillment email:', err);
        });
      }
      return { received: true };
    }

    // Legacy single-order metadata fallback
    const orderId = session.metadata?.orderId;
    if (!orderId) {
      throw new ApiError(400, 'Missing orderId in session metadata');
    }

    const existing = await orderRepository.findById(orderId);
    if (existing && existing.paymentStatus !== PaymentStatus.PAID) {
      await orderRepository.update(orderId, {
        paymentStatus: PaymentStatus.PAID,
        paymentReference: session.id,
        paymentProvider: 'stripe',
      });

      await orderService.fulfillPaidOrder(orderId, baseUrl).catch((err) => {
        console.error('Failed to send fulfillment email:', err);
      });
    }
  }

  return { received: true };
}
