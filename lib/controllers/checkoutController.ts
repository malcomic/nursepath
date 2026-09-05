import crypto from 'crypto';
import { z } from 'zod';
import { guideRepository } from '@/lib/repositories/guideRepository';
import { orderRepository } from '@/lib/repositories/orderRepository';
import { settingsService } from '@/lib/services/settingsService';
import { orderService } from '@/lib/services/orderService';
import { ApiError } from '@/lib/errors/api-error';
import { PaymentStatus } from '@/lib/generated/prisma/enums';
import { config } from '@/lib/config/env';

const freeCheckoutSchema = z
  .object({
    guideId: z.string().min(1).optional(),
    guideIds: z.array(z.string().min(1)).min(1).optional(),
    buyerName: z.string().trim().min(1).max(255),
    buyerEmail: z.string().trim().email(),
  })
  .refine((data) => Boolean(data.guideId || (data.guideIds && data.guideIds.length > 0)), {
    message: 'guideId or guideIds is required',
  });

function resolveGuideIds(input: z.infer<typeof freeCheckoutSchema>): string[] {
  if (input.guideIds?.length) {
    return [...new Set(input.guideIds)];
  }
  return input.guideId ? [input.guideId] : [];
}

export async function createFreeCheckout(body: unknown, ipAddress?: string) {
  const input = freeCheckoutSchema.parse(body);
  const guideIds = resolveGuideIds(input);

  const guides = await Promise.all(guideIds.map((id) => guideRepository.findById(id)));
  if (guides.some((g) => !g)) {
    throw new ApiError(404, 'One or more guides were not found');
  }

  const validGuides = guides.filter((g): g is NonNullable<typeof g> => Boolean(g));
  if (validGuides.some((g) => Number(g.price) !== 0)) {
    throw new ApiError(400, 'One or more guides require payment via Stripe checkout');
  }

  const settings = await settingsService.getSettings();
  const now = new Date();
  const downloadExpiresAt = new Date(
    now.getTime() + settings.downloadExpiryHours * 60 * 60 * 1000
  );
  const paymentReference = `free_${crypto.randomUUID()}`;

  const orders = [];
  for (const guide of validGuides) {
    const order = await orderRepository.create({
      customerName: input.buyerName,
      customerEmail: input.buyerEmail,
      guideId: guide.id,
      price: guide.price,
      paymentStatus: PaymentStatus.PAID,
      downloadToken: crypto.randomUUID(),
      downloadExpiresAt,
      maxDownloads: settings.maxDownloads,
      paymentProvider: 'free',
      paymentReference,
      ipAddress,
    });
    orders.push(order);
  }

  const baseUrl = config.publicAppUrl || 'http://localhost:3000';
  await orderService.fulfillOrdersByPaymentReference(paymentReference, baseUrl).catch((err) => {
    console.error('Failed to send fulfillment email:', err);
  });

  return {
    success: true as const,
    data: { orderId: orders[0].id, orderIds: orders.map((o) => o.id) },
  };
}
