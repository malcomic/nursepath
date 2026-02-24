import { Response } from 'express';
import { z } from 'zod';
import { AdminRequest } from '../types/express';
import { guideService } from '../services/guideService';
import { asyncHandler, ApiError } from '../middleware/errorHandler';

const createGuideSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  price: z.number().positive(),
  categoryId: z.string().min(1),
  pdfUrl: z.string().url(),
  thumbnailUrl: z.string().url().optional(),
});

const updateGuideSchema = createGuideSchema.partial();

export class GuideController {
  getAll = asyncHandler(async (req: AdminRequest, res: Response) => {
    const guides = await guideService.getAllGuides();

    res.json({
      success: true,
      data: guides,
    });
  });

  getById = asyncHandler(async (req: AdminRequest, res: Response) => {
    const { id } = req.params;
    const guide = await guideService.getGuide(id);

    res.json({
      success: true,
      data: guide,
    });
  });

  getByCategory = asyncHandler(async (req: AdminRequest, res: Response) => {
    const { categoryId } = req.params;
    const guides = await guideService.getGuidesByCategory(categoryId);

    res.json({
      success: true,
      data: guides,
    });
  });

  search = asyncHandler(async (req: AdminRequest, res: Response) => {
    const { q } = req.query;

    if (!q || typeof q !== 'string') {
      throw new ApiError(400, 'Search query required');
    }

    const results = await guideService.searchGuides(q);

    res.json({
      success: true,
      data: results,
    });
  });

  create = asyncHandler(async (req: AdminRequest, res: Response) => {
    if (!req.admin) {
      throw new ApiError(401, 'Not authenticated');
    }

    const data = createGuideSchema.parse(req.body);
    const guide = await guideService.createGuide(data);

    res.status(201).json({
      success: true,
      data: guide,
    });
  });

  update = asyncHandler(async (req: AdminRequest, res: Response) => {
    if (!req.admin) {
      throw new ApiError(401, 'Not authenticated');
    }

    const { id } = req.params;
    const data = updateGuideSchema.parse(req.body);
    const guide = await guideService.updateGuide(id, data);

    res.json({
      success: true,
      data: guide,
    });
  });

  delete = asyncHandler(async (req: AdminRequest, res: Response) => {
    if (!req.admin) {
      throw new ApiError(401, 'Not authenticated');
    }

    const { id } = req.params;
    await guideService.deleteGuide(id);

    res.json({
      success: true,
      message: 'Guide deleted',
    });
  });
}

export const guideController = new GuideController();
