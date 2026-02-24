import { Response } from 'express';
import { z } from 'zod';
import { AdminRequest } from '../types/express';
import { purchaseService } from '../services/purchaseService';
import { asyncHandler, ApiError } from '../middleware/errorHandler';

const createPurchaseSchema = z.object({
  guideId: z.string().min(1),
  buyerName: z.string().min(1).max(255),
  buyerEmail: z.string().email(),
});

export class PurchaseController {
  getAll = asyncHandler(async (req: AdminRequest, res: Response) => {
    if (!req.admin) {
      throw new ApiError(401, 'Not authenticated');
    }

    const purchases = await purchaseService.getAllPurchases();

    res.json({
      success: true,
      data: purchases,
    });
  });

  getByGuide = asyncHandler(async (req: AdminRequest, res: Response) => {
    if (!req.admin) {
      throw new ApiError(401, 'Not authenticated');
    }

    const { guideId } = req.params;
    const purchases = await purchaseService.getPurchasesByGuide(guideId);

    res.json({
      success: true,
      data: purchases,
    });
  });

  getByEmail = asyncHandler(async (req: AdminRequest, res: Response) => {
    const { email } = req.query;

    if (!email || typeof email !== 'string') {
      throw new ApiError(400, 'Email required');
    }

    const purchases = await purchaseService.getPurchasesByEmail(email);

    res.json({
      success: true,
      data: purchases,
    });
  });

  create = asyncHandler(async (req: AdminRequest, res: Response) => {
    const data = createPurchaseSchema.parse(req.body);
    const result = await purchaseService.createPurchase(
      data.guideId,
      data.buyerName,
      data.buyerEmail
    );

    res.status(201).json({
      success: true,
      data: result,
    });
  });
}

export const purchaseController = new PurchaseController();
