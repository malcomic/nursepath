import { Response } from 'express';
import { z } from 'zod';
import { AdminRequest } from '../types/express';
import { categoryService } from '../services/categoryService';
import { asyncHandler, ApiError } from '../middleware/errorHandler';

const createCategorySchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  icon: z.string().optional(),
});

const updateCategorySchema = createCategorySchema.partial();

export class CategoryController {
  getAll = asyncHandler(async (req: AdminRequest, res: Response) => {
    const categories = await categoryService.getAllCategories();

    res.json({
      success: true,
      data: categories,
    });
  });

  getById = asyncHandler(async (req: AdminRequest, res: Response) => {
    const { id } = req.params;
    const category = await categoryService.getCategory(id);

    res.json({
      success: true,
      data: category,
    });
  });

  create = asyncHandler(async (req: AdminRequest, res: Response) => {
    if (!req.admin) {
      throw new ApiError(401, 'Not authenticated');
    }

    const data = createCategorySchema.parse(req.body);
    const category = await categoryService.createCategory(data.name, data.description, data.icon);

    res.status(201).json({
      success: true,
      data: category,
    });
  });

  update = asyncHandler(async (req: AdminRequest, res: Response) => {
    if (!req.admin) {
      throw new ApiError(401, 'Not authenticated');
    }

    const { id } = req.params;
    const data = updateCategorySchema.parse(req.body);
    const category = await categoryService.updateCategory(
      id,
      data.name || '',
      data.description,
      data.icon
    );

    res.json({
      success: true,
      data: category,
    });
  });

  delete = asyncHandler(async (req: AdminRequest, res: Response) => {
    if (!req.admin) {
      throw new ApiError(401, 'Not authenticated');
    }

    const { id } = req.params;
    await categoryService.deleteCategory(id);

    res.json({
      success: true,
      message: 'Category deleted',
    });
  });
}

export const categoryController = new CategoryController();
