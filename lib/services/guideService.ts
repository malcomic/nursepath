import { guideRepository } from '@/lib/repositories/guideRepository';
import { categoryRepository } from '@/lib/repositories/categoryRepository';
import { ApiError } from '@/lib/errors/api-error';
import { ensureUniqueGuideSlug } from '@/lib/guides/ensure-unique-slug';
import { slugify } from '@/lib/slugify';

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

  /** Resolve by slug first, then by cuid id. */
  async getGuideByParam(param: string) {
    const bySlug = await guideRepository.findBySlug(param);
    if (bySlug) return bySlug;

    const byId = await guideRepository.findById(param);
    if (byId) return byId;

    throw new ApiError(404, 'Guide not found');
  }

  async getGuidesByCategory(categoryId: string) {
    await categoryRepository.findById(categoryId);
    return guideRepository.findByCategory(categoryId);
  }

  async createGuide(data: {
    title: string;
    slug?: string;
    description?: string;
    price: number;
    stripePriceId?: string;
    categoryId: string;
    pdfUrl: string;
    thumbnailUrl?: string;
  }) {
    await categoryRepository.findById(data.categoryId);
    const slug = await ensureUniqueGuideSlug(data.slug?.trim() || slugify(data.title) || data.title);
    return guideRepository.create({
      title: data.title,
      slug,
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
      slug?: string;
      description?: string;
      price?: number;
      stripePriceId?: string;
      categoryId?: string;
      pdfUrl?: string;
      thumbnailUrl?: string;
    }
  ) {
    const existing = await this.getGuide(id);
    if (data.categoryId) {
      await categoryRepository.findById(data.categoryId);
    }

    let slug: string | undefined;
    if (data.slug !== undefined && data.slug.trim() !== '') {
      slug = await ensureUniqueGuideSlug(data.slug.trim(), id);
    } else if (data.title !== undefined && data.title !== existing.title) {
      slug = await ensureUniqueGuideSlug(slugify(data.title) || data.title, id);
    }

    return guideRepository.update(id, {
      ...data,
      ...(slug !== undefined ? { slug } : {}),
    });
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
