import { Response } from 'express';
import { AdminRequest } from '../types/express';
import { asyncHandler, ApiError } from '../middleware/errorHandler';
import { prisma } from '../lib/prisma';

export class ReviewController {
  getAllForAdmin = asyncHandler(async (req: AdminRequest, res: Response) => {
    if (!req.admin) {
      throw new ApiError(401, 'Not authenticated');
    }

    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const data = reviews.map((r) => ({
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
    }));

    res.json({
      success: true,
      data,
    });
  });
}

export const reviewController = new ReviewController();
