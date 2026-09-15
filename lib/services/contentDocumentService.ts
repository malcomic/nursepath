import { contentDocumentRepository } from '@/lib/repositories/contentDocumentRepository';
import { categoryService } from '@/lib/services/categoryService';
import { ApiError } from '@/lib/errors/api-error';
import { ensureUniqueContentDocumentSlug } from '@/lib/content-documents/ensure-unique-slug';
import { slugify } from '@/lib/slugify';
import type { ContentType } from '@/lib/types';

export class ContentDocumentService {
  async getAll(filters?: { type?: ContentType; categoryId?: string }) {
    return contentDocumentRepository.findAll(filters);
  }

  async getById(id: string) {
    const doc = await contentDocumentRepository.findById(id);
    if (!doc) {
      throw new ApiError(404, 'Content document not found');
    }
    return doc;
  }

  /** Resolve by slug first, then by cuid id. */
  async getByParam(param: string) {
    const bySlug = await contentDocumentRepository.findBySlug(param);
    if (bySlug) return bySlug;

    const byId = await contentDocumentRepository.findById(param);
    if (byId) return byId;

    throw new ApiError(404, 'Content document not found');
  }

  async create(data: {
    type: ContentType;
    title: string;
    slug?: string;
    description?: string;
    categoryId: string;
    fileUrl: string;
    previewPdfUrl?: string | null;
    thumbnailUrl?: string;
  }) {
    await categoryService.getCategory(data.categoryId);
    const slug = await ensureUniqueContentDocumentSlug(
      data.slug?.trim() || slugify(data.title) || data.title
    );
    return contentDocumentRepository.create({
      type: data.type,
      title: data.title,
      slug,
      description: data.description ?? null,
      categoryId: data.categoryId,
      fileUrl: data.fileUrl,
      previewPdfUrl: data.previewPdfUrl ?? null,
      thumbnailUrl: data.thumbnailUrl ?? null,
    });
  }

  async update(
    id: string,
    data: {
      type?: ContentType;
      title?: string;
      slug?: string;
      description?: string;
      categoryId?: string;
      fileUrl?: string;
      previewPdfUrl?: string | null;
      thumbnailUrl?: string;
    }
  ) {
    const existing = await this.getById(id);
    if (data.categoryId) {
      await categoryService.getCategory(data.categoryId);
    }

    let slug: string | undefined;
    if (data.slug !== undefined && data.slug.trim() !== '') {
      slug = await ensureUniqueContentDocumentSlug(data.slug.trim(), id);
    } else if (data.title !== undefined && data.title !== existing.title) {
      slug = await ensureUniqueContentDocumentSlug(slugify(data.title) || data.title, id);
    }

    return contentDocumentRepository.update(id, {
      ...data,
      ...(slug !== undefined ? { slug } : {}),
    });
  }

  async delete(id: string) {
    await this.getById(id);
    return contentDocumentRepository.delete(id);
  }
}

export const contentDocumentService = new ContentDocumentService();
