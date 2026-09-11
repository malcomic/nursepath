import { z } from 'zod';
import { categoryService } from '@/lib/services/categoryService';

const optionalSlug = z
  .string()
  .trim()
  .min(1)
  .max(255)
  .optional()
  .or(z.literal('').transform(() => undefined));

const createCategorySchema = z.object({
  name: z.string().min(1).max(255),
  slug: optionalSlug,
  description: z.string().optional(),
  icon: z.string().optional(),
});

const updateCategorySchema = createCategorySchema.partial();

export async function getAllCategories() {
  const categories = await categoryService.getAllCategories();
  return { success: true as const, data: categories };
}

export async function getCategoryById(id: string) {
  const category = await categoryService.getCategory(id);
  return { success: true as const, data: category };
}

export async function createCategory(body: unknown) {
  const data = createCategorySchema.parse(body);
  const category = await categoryService.createCategory(data);
  return { success: true as const, data: category };
}

export async function updateCategory(id: string, body: unknown) {
  const data = updateCategorySchema.parse(body);
  const category = await categoryService.updateCategory(id, data);
  return { success: true as const, data: category };
}

export async function deleteCategory(id: string) {
  await categoryService.deleteCategory(id);
  return { success: true as const, message: 'Category deleted' };
}
