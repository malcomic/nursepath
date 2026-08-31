import { z } from 'zod';
import { purchaseService } from '@/lib/services/purchaseService';
import { ApiError } from '@/lib/errors/api-error';

const createPurchaseSchema = z.object({
  guideId: z.string().min(1),
  buyerName: z.string().min(1).max(255),
  buyerEmail: z.string().email(),
});

export async function getAllPurchases() {
  const purchases = await purchaseService.getAllPurchases();
  return { success: true as const, data: purchases };
}

export async function getPurchasesByGuide(guideId: string) {
  const purchases = await purchaseService.getPurchasesByGuide(guideId);
  return { success: true as const, data: purchases };
}

export async function getPurchasesByEmail(email: string | null) {
  if (!email || typeof email !== 'string') {
    throw new ApiError(400, 'Email required');
  }
  const purchases = await purchaseService.getPurchasesByEmail(email);
  return { success: true as const, data: purchases };
}

export async function createPurchase(body: unknown) {
  const data = createPurchaseSchema.parse(body);
  const result = await purchaseService.createPurchase(
    data.guideId,
    data.buyerName,
    data.buyerEmail
  );
  return { success: true as const, data: result };
}
