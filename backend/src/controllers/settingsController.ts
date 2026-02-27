import { Response } from 'express';
import { z } from 'zod';
import { AdminRequest } from '../types/express';
import { asyncHandler, ApiError } from '../middleware/errorHandler';
import { settingsService } from '../services/settingsService';

const updateSettingsSchema = z.object({
  downloadExpiryHours: z.number().int().min(1).max(168).optional(),
  maxDownloads: z.number().int().min(1).max(10).optional(),
  supportEmail: z.string().email().optional(),
  currency: z.string().min(1).max(10).optional(),
  paymentProvider: z.string().optional().nullable(),
  paymentApiKey: z.string().optional().nullable(),
});

export class SettingsController {
  get = asyncHandler(async (req: AdminRequest, res: Response) => {
    if (!req.admin) {
      throw new ApiError(401, 'Not authenticated');
    }

    const settings = await settingsService.getSettings();

    res.json({
      success: true,
      data: {
        ...settings,
        // Mask API key when sending to client
        paymentApiKey: settings.paymentApiKey ? '****' : null,
      },
    });
  });

  update = asyncHandler(async (req: AdminRequest, res: Response) => {
    if (!req.admin) {
      throw new ApiError(401, 'Not authenticated');
    }

    const parsed = updateSettingsSchema.parse(req.body);
    const updated = await settingsService.updateSettings(parsed);

    res.json({
      success: true,
      data: {
        ...updated,
        paymentApiKey: updated.paymentApiKey ? '****' : null,
      },
    });
  });
}

export const settingsController = new SettingsController();

