import { guideRepository } from '@/lib/repositories/guideRepository';
import { categoryRepository } from '@/lib/repositories/categoryRepository';
import { ApiError } from '@/lib/errors/api-error';

export class GuideService {
  async getAllGuides() {
    return guideRepository.findAll();
  }

  async getGuide(id: string) {
    const guide = await guideRepository.findById(id);
    if (!guide) {
      throw new ApiError(404, 'Guide not found');
    }
    return guide;
  }

  async getGuidesByCategory(categoryId: string) {
    await categoryRepository.findById(categoryId);
    return guideRepository.findByCategory(categoryId);
  }

  async createGuide(data: {
    title: string;
    description?: string;
    price: number;
    stripePriceId?: string;
    categoryId: string;
    pdfUrl: string;
    thumbnailUrl?: string;
  }) {
    await categoryRepository.findById(data.categoryId);
    return guideRepository.create({
      title: data.title,
      description: data.description ?? null,
      price: data.price,
      stripePriceId: data.stripePriceId ?? null,
      categoryId: data.categoryId,
      pdfUrl: data.pdfUrl,
      thumbnailUrl: data.thumbnailUrl ?? null,
    });
  }

  async updateGuide(
    id: string,
    data: {
      title?: string;
      description?: string;
      price?: number;
      stripePriceId?: string;
      categoryId?: string;
      pdfUrl?: string;
      thumbnailUrl?: string;
    }
  ) {
    await this.getGuide(id);
    if (data.categoryId) {
      await categoryRepository.findById(data.categoryId);
    }
    return guideRepository.update(id, data);
  }

  async deleteGuide(id: string) {
    await this.getGuide(id);
    return guideRepository.delete(id);
  }

  async searchGuides(query: string) {
    if (query.length < 2) {
      throw new ApiError(400, 'Search query must be at least 2 characters');
    }
    return guideRepository.search(query);
  }
}

export const guideService = new GuideService();
