import { Request, Response } from 'express';
import type Stripe from 'stripe';
import { z } from 'zod';
import crypto from 'crypto';
import { stripe } from '../lib/stripe';
import { guideRepository } from '../repositories/guideRepository';
import { orderRepository } from '../repositories/orderRepository';
import { settingsService } from '../services/settingsService';
import { asyncHandler, ApiError } from '../middleware/errorHandler';
import { PaymentStatus } from '../generated/prisma/enums';
import { config } from '../config/env';

const createCheckoutSessionSchema = z.object({
  guideId: z.string().min(1),
  buyerName: z.string().trim().min(1).max(255),
  buyerEmail: z.string().trim().email(),
});

function buildAbsoluteUrl(base: string, pathAndQuery: string) {
  const url = new URL(base);
  const normalized = pathAndQuery.startsWith('/') ? pathAndQuery : `/${pathAndQuery}`;
  return new URL(normalized, url).toString();
}

export class StripeController {
  createCheckoutSession = asyncHandler(async (req: Request, res: Response) => {
    const input = createCheckoutSessionSchema.parse(req.body);

    const guide = await guideRepository.findById(input.guideId);
    if (!guide) {
      throw new ApiError(404, 'Guide not found');
    }
    if (!guide.stripePriceId) {
      throw new ApiError(400, 'This guide is not configured for Stripe checkout yet');
    }

    const settings = await settingsService.getSettings();
    const now = new Date();
    const downloadExpiresAt = new Date(
      now.getTime() + settings.downloadExpiryHours * 60 * 60 * 1000
    );
    const downloadToken = crypto.randomUUID();

    const order = await orderRepository.create({
      customerName: input.buyerName,
      customerEmail: input.buyerEmail,
      guideId: guide.id,
      price: guide.price,
      paymentStatus: PaymentStatus.PENDING,
      downloadToken,
      downloadExpiresAt,
      maxDownloads: settings.maxDownloads,
      paymentProvider: 'stripe',
      ipAddress: req.ip,
    });

    const successUrl = buildAbsoluteUrl(
      config.publicAppUrl!,
      `/payment-success?order_id=${encodeURIComponent(order.id)}`
    );
    const cancelUrl = buildAbsoluteUrl(config.publicAppUrl!, `/guides/${guide.id}`);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: guide.stripePriceId,
          quantity: 1,
        },
      ],
      customer_email: input.buyerEmail,
      client_reference_id: order.id,
      metadata: {
        orderId: order.id,
        guideId: guide.id,
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    await orderRepository.update(order.id, {
      paymentReference: session.id,
    });

    if (!session.url) {
      throw new ApiError(500, 'Stripe did not return a checkout URL');
    }

    res.json({
      success: true,
      data: { url: session.url, orderId: order.id },
    });
  });

  webhook = asyncHandler(async (req: Request, res: Response) => {
    const signature = req.headers['stripe-signature'];
    if (!signature || typeof signature !== 'string') {
      throw new ApiError(400, 'Missing Stripe signature');
    }

    const rawBody = req.body as Buffer;
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
      }
    }

    // Always acknowledge receipt so Stripe doesn't keep retrying.
    res.json({ received: true });
  });
}

export const stripeController = new StripeController();

