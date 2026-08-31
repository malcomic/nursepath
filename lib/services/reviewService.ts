import { reviewRepository } from '@/lib/repositories/reviewRepository';
import { ApiError } from '@/lib/errors/api-error';
import { ReviewStatus } from '@/lib/generated/prisma/enums';

function mapReview(r: {
  id: string;
  name: string;
  school: string | null;
  exam_type: string;
  rating: number;
  message: string;
  verification_type: string | null;
  screenshot_url: string | null;
  status: ReviewStatus;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: r.id,
    name: r.name,
    school: r.school,
    exam_type: r.exam_type,
    rating: r.rating,
    message: r.message,
    verification_type: r.verification_type,
    screenshot_url: r.screenshot_url,
    status: r.status,
    created_at: r.createdAt.toISOString(),
    updated_at: r.updatedAt.toISOString(),
  };
}

export class ReviewService {
  async getApprovedReviews() {
    const reviews = await reviewRepository.findApproved();
    return reviews.map(mapReview);
  }

  async getAllReviews() {
    const reviews = await reviewRepository.findAll();
    return reviews.map(mapReview);
  }

  async createReview(data: {
    name: string;
    school?: string | null;
    exam_type: string;
    rating: number;
    message: string;
    verification_type?: string | null;
  }) {
    const review = await reviewRepository.create(data);
    return mapReview(review);
  }

  async approveReview(id: string) {
    const review = await reviewRepository.findById(id);
    if (!review) {
      throw new ApiError(404, 'Review not found');
    }
    const updated = await reviewRepository.updateStatus(id, ReviewStatus.approved);
    return mapReview(updated);
  }

  async rejectReview(id: string) {
    const review = await reviewRepository.findById(id);
    if (!review) {
      throw new ApiError(404, 'Review not found');
    }
    const updated = await reviewRepository.updateStatus(id, ReviewStatus.rejected);
    return mapReview(updated);
  }

  async deleteReview(id: string) {
    const review = await reviewRepository.findById(id);
    if (!review) {
      throw new ApiError(404, 'Review not found');
    }
    await reviewRepository.delete(id);
  }
}

export const reviewService = new ReviewService();
