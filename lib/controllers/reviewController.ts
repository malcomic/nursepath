import { z } from 'zod';
import { reviewService } from '@/lib/services/reviewService';
import { checkIpRateLimit } from '@/lib/api/ip-rate-limit';

const createReviewSchema = z.object({
  name: z.string().trim().min(1).max(255),
  school: z.string().trim().nullable().optional(),
  exam_type: z.string().default('Other'),
  rating: z.number().int().min(1).max(5),
  message: z.string().trim().min(1).max(500),
  verification_type: z.string().nullable().optional(),
  screenshot_url: z.string().url().nullable().optional(),
});

export async function getApprovedReviews() {
  const reviews = await reviewService.getApprovedReviews();
  return { success: true as const, data: reviews };
}

export async function createReview(body: unknown, ipAddress?: string) {
  if (ipAddress) {
    checkIpRateLimit(ipAddress);
  }

  const data = createReviewSchema.parse(body);
  const review = await reviewService.createReview(data);
  return { success: true as const, data: review };
}

export async function getAllReviewsAdmin() {
  const reviews = await reviewService.getAllReviews();
  return { success: true as const, data: reviews };
}

export async function approveReview(id: string) {
  const review = await reviewService.approveReview(id);
  return { success: true as const, data: review };
}

export async function rejectReview(id: string) {
  const review = await reviewService.rejectReview(id);
  return { success: true as const, data: review };
}

export async function deleteReview(id: string) {
  await reviewService.deleteReview(id);
  return { success: true as const };
}
