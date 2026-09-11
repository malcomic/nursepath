import { categoryRepository } from '@/lib/repositories/categoryRepository';
import { ApiError } from '@/lib/errors/api-error';
import { ensureUniqueCategorySlug } from '@/lib/categories/ensure-unique-slug';
import { slugify } from '@/lib/slugify';

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

  /** Resolve by slug first, then by cuid id. */
  async getCategoryByParam(param: string) {
    const bySlug = await categoryRepository.findBySlug(param);
    if (bySlug) return bySlug;

    const byId = await categoryRepository.findById(param);
    if (byId) return byId;

    throw new ApiError(404, 'Category not found');
  }

  async createCategory(data: {
    name: string;
    slug?: string;
    description?: string;
    icon?: string;
  }) {
    const existing = await categoryRepository.findAll();
    if (existing.some((c) => c.name === data.name)) {
      throw new ApiError(400, 'Category already exists');
    }
    const slug = await ensureUniqueCategorySlug(
      data.slug?.trim() || slugify(data.name) || data.name
    );
    return categoryRepository.create({
      name: data.name,
      slug,
      description: data.description,
      icon: data.icon,
    });
  }

  async updateCategory(
    id: string,
    data: {
      name?: string;
      slug?: string;
      description?: string;
      icon?: string;
    }
  ) {
    const existing = await this.getCategory(id);

    let slug: string | undefined;
    if (data.slug !== undefined && data.slug.trim() !== '') {
      slug = await ensureUniqueCategorySlug(data.slug.trim(), id);
    } else if (data.name !== undefined && data.name !== existing.name) {
      slug = await ensureUniqueCategorySlug(slugify(data.name) || data.name, id);
    }

    return categoryRepository.update(id, {
      ...data,
      ...(slug !== undefined ? { slug } : {}),
    });
  }

  async deleteCategory(id: string) {
    await this.getCategory(id);
    return categoryRepository.delete(id);
  }
}

export const categoryService = new CategoryService();
