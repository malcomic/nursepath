import { z } from 'zod';
import { guideService } from '@/lib/services/guideService';
import { ApiError } from '@/lib/errors/api-error';

const createFileUrlSchema = (prefix: string, errorMessage: string) =>
  z.string().refine((value) => {
    if (value.startsWith(prefix)) return true;
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }, errorMessage);

const thumbnailUrlSchema = createFileUrlSchema('/api/guides/thumbnail/', 'Invalid thumbnail URL');
const pdfUrlSchema = createFileUrlSchema('/api/guides/pdf/', 'Invalid PDF URL');

const createGuideSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  price: z.number().positive(),
  stripePriceId: z
    .string()
    .trim()
    .min(1)
    .max(255)
    .optional()
    .or(z.literal('').transform(() => undefined)),
  categoryId: z.string().min(1),
  pdfUrl: pdfUrlSchema,
  thumbnailUrl: thumbnailUrlSchema.optional(),
});

const updateGuideSchema = createGuideSchema.partial();

export async function getAllGuides() {
  const guides = await guideService.getAllGuides();
  return { success: true as const, data: guides };
}

export async function getGuideById(id: string) {
  const guide = await guideService.getGuide(id);
  return { success: true as const, data: guide };
}

export async function getGuidesByCategory(categoryId: string) {
  const guides = await guideService.getGuidesByCategory(categoryId);
  return { success: true as const, data: guides };
}

export async function searchGuides(q: string | null) {
  if (!q || typeof q !== 'string') {
    throw new ApiError(400, 'Search query required');
  }
  const results = await guideService.searchGuides(q);
  return { success: true as const, data: results };
}

export async function createGuide(body: unknown) {
  const data = createGuideSchema.parse(body);
  const guide = await guideService.createGuide(data);
  return { success: true as const, data: guide };
}

export async function updateGuide(id: string, body: unknown) {
  const data = updateGuideSchema.parse(body);
  const guide = await guideService.updateGuide(id, data);
  return { success: true as const, data: guide };
}

export async function deleteGuide(id: string) {
  await guideService.deleteGuide(id);
  return { success: true as const, message: 'Guide deleted' };
}
