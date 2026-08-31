import { z } from 'zod';
import { reviewService } from '@/lib/services/reviewService';
import { ApiError } from '@/lib/errors/api-error';

const createReviewSchema = z.object({
  name: z.string().trim().min(1).max(255),
  school: z.string().trim().nullable().optional(),
  exam_type: z.string().default('Other'),
  rating: z.number().int().min(1).max(5),
  message: z.string().trim().min(1).max(500),
  verification_type: z.string().nullable().optional(),
});

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

function checkRateLimit(ip: string) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    throw new ApiError(429, 'Too many requests. Please try again later.');
  }

  entry.count += 1;
}

export async function getApprovedReviews() {
  const reviews = await reviewService.getApprovedReviews();
  return { success: true as const, data: reviews };
}

export async function createReview(body: unknown, ipAddress?: string) {
  if (ipAddress) {
    checkRateLimit(ipAddress);
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
