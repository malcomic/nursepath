import crypto from 'crypto';
import { z } from 'zod';
import { guideRepository } from '@/lib/repositories/guideRepository';
import { orderRepository } from '@/lib/repositories/orderRepository';
import { settingsService } from '@/lib/services/settingsService';
import { orderService } from '@/lib/services/orderService';
import { ApiError } from '@/lib/errors/api-error';
import { PaymentStatus } from '@/lib/generated/prisma/enums';
import { config } from '@/lib/config/env';

const freeCheckoutSchema = z.object({
  guideId: z.string().min(1),
  buyerName: z.string().trim().min(1).max(255),
  buyerEmail: z.string().trim().email(),
});

export async function createFreeCheckout(body: unknown, ipAddress?: string) {
  const input = freeCheckoutSchema.parse(body);

  const guide = await guideRepository.findById(input.guideId);
  if (!guide) {
    throw new ApiError(404, 'Guide not found');
  }
  if (Number(guide.price) !== 0) {
    throw new ApiError(400, 'This guide requires payment via Stripe checkout');
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
    paymentStatus: PaymentStatus.PAID,
    downloadToken,
    downloadExpiresAt,
    maxDownloads: settings.maxDownloads,
    paymentProvider: 'free',
    ipAddress,
  });

  const baseUrl = config.publicAppUrl || 'http://localhost:3000';
  await orderService.fulfillPaidOrder(order.id, baseUrl).catch((err) => {
    console.error('Failed to send fulfillment email:', err);
  });

  return { success: true as const, data: { orderId: order.id } };
}
