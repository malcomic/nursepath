import { Response } from 'express';
import { z } from 'zod';
import { AdminRequest } from '../types/express';
import { adminService } from '../services/adminService';
import { asyncHandler, ApiError } from '../middleware/errorHandler';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export class AdminController {
  login = asyncHandler(async (req: AdminRequest, res: Response) => {
    const { email, password } = loginSchema.parse(req.body);

    const result = await adminService.login(email, password);

    res.json({
      success: true,
      data: result,
    });
  });

  getMe = asyncHandler(async (req: AdminRequest, res: Response) => {
    if (!req.admin) {
      throw new ApiError(401, 'Not authenticated');
    }

    const admin = await adminService.getAdmin(req.admin.id);

    res.json({
      success: true,
      data: admin,
    });
  });
}

export const adminController = new AdminController();
