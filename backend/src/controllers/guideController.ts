import { Response } from 'express';
import { z } from 'zod';
import { AdminRequest } from '../types/express';
import { guideService } from '../services/guideService';
import { asyncHandler, ApiError } from '../middleware/errorHandler';

const createFileUrlSchema = (prefix: string, errorMessage: string) =>
  z.string().refine((value) => {
    if (value.startsWith(prefix)) {
      return true;
    }

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

  uploadThumbnail = asyncHandler(async (req: AdminRequest, res: Response) => {
    if (!req.admin) {
      throw new ApiError(401, 'Not authenticated');
    }

    if (!req.file) {
      throw new ApiError(400, 'Thumbnail file is required');
    }

    const thumbnailUrl = `/api/guides/thumbnail/${encodeURIComponent(req.file.filename)}`;

    res.status(201).json({
      success: true,
      data: { thumbnailUrl },
    });
  });

  uploadPdf = asyncHandler(async (req: AdminRequest, res: Response) => {
    if (!req.admin) {
      throw new ApiError(401, 'Not authenticated');
    }

    if (!req.file) {
      throw new ApiError(400, 'PDF file is required');
    }

    const pdfUrl = `/api/guides/pdf/${encodeURIComponent(req.file.filename)}`;

    res.status(201).json({
      success: true,
      data: { pdfUrl },
    });
  });
}

export const guideController = new GuideController();
