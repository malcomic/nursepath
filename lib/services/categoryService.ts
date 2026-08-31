import { categoryRepository } from '@/lib/repositories/categoryRepository';
import { ApiError } from '@/lib/errors/api-error';

export class CategoryService {
  async getAllCategories() {
    return categoryRepository.findAll();
  }

  async getCategory(id: string) {
    const category = await categoryRepository.findById(id);
    if (!category) {
      throw new ApiError(404, 'Category not found');
    }
    return category;
  }

  async createCategory(name: string, description?: string, icon?: string) {
    const existing = await categoryRepository.findAll();
    if (existing.some((c) => c.name === name)) {
      throw new ApiError(400, 'Category already exists');
    }
    return categoryRepository.create(name, description, icon);
  }

  async updateCategory(id: string, name: string, description?: string, icon?: string) {
    await this.getCategory(id);
    return categoryRepository.update(id, { name, description, icon });
  }

  async deleteCategory(id: string) {
    await this.getCategory(id);
    return categoryRepository.delete(id);
  }
}

export const categoryService = new CategoryService();
