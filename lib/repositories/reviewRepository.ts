import { prisma } from '@/lib/prisma';
import { ReviewStatus } from '@/lib/generated/prisma/enums';

export class ReviewRepository {
  async findAll() {
    return prisma.review.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findApproved() {
    return prisma.review.findMany({
      where: { status: ReviewStatus.approved },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return prisma.review.findUnique({ where: { id } });
  }

  async create(data: {
    name: string;
    school?: string | null;
    exam_type: string;
    rating: number;
    message: string;
    verification_type?: string | null;
  }) {
    return prisma.review.create({
      data: {
        name: data.name,
        school: data.school ?? null,
        exam_type: data.exam_type,
        rating: data.rating,
        message: data.message,
        verification_type: data.verification_type ?? null,
        status: ReviewStatus.pending,
      },
    });
  }

  async updateStatus(id: string, status: ReviewStatus) {
    return prisma.review.update({ where: { id }, data: { status } });
  }

  async delete(id: string) {
    return prisma.review.delete({ where: { id } });
  }
}

export const reviewRepository = new ReviewRepository();
