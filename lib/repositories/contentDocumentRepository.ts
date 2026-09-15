import { prisma } from '@/lib/prisma';
import type { Category, ContentDocument, ContentType } from '@/lib/types';
import type { ContentType as PrismaContentType } from '@/lib/generated/prisma/enums';

export type ContentDocumentWithCategory = ContentDocument & { category: Category | null };

function mapDoc(doc: {
  id: string;
  type: PrismaContentType;
  title: string;
  slug: string;
  description: string | null;
  categoryId: string;
  fileUrl: string;
  previewPdfUrl: string | null;
  thumbnailUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  category?: Category | null;
}): ContentDocumentWithCategory {
  return {
    id: doc.id,
    type: doc.type as ContentType,
    title: doc.title,
    slug: doc.slug,
    description: doc.description,
    categoryId: doc.categoryId,
    fileUrl: doc.fileUrl,
    previewPdfUrl: doc.previewPdfUrl,
    thumbnailUrl: doc.thumbnailUrl,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    category: doc.category ?? null,
  };
}

export class ContentDocumentRepository {
  async findAll(filters?: {
    type?: ContentType;
    categoryId?: string;
  }): Promise<ContentDocumentWithCategory[]> {
    const docs = await prisma.contentDocument.findMany({
      where: {
        ...(filters?.type ? { type: filters.type } : {}),
        ...(filters?.categoryId ? { categoryId: filters.categoryId } : {}),
      },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
    return docs.map(mapDoc);
  }

  async findById(id: string): Promise<ContentDocumentWithCategory | null> {
    const doc = await prisma.contentDocument.findUnique({
      where: { id },
      include: { category: true },
    });
    return doc ? mapDoc(doc) : null;
  }

  async findBySlug(slug: string): Promise<ContentDocumentWithCategory | null> {
    const doc = await prisma.contentDocument.findUnique({
      where: { slug },
      include: { category: true },
    });
    return doc ? mapDoc(doc) : null;
  }

  async create(
    data: Omit<ContentDocument, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<ContentDocument> {
    const doc = await prisma.contentDocument.create({
      data: {
        type: data.type,
        title: data.title,
        slug: data.slug,
        description: data.description,
        categoryId: data.categoryId,
        fileUrl: data.fileUrl,
        previewPdfUrl: data.previewPdfUrl,
        thumbnailUrl: data.thumbnailUrl,
      },
    });
    return mapDoc(doc);
  }

  async update(
    id: string,
    data: Partial<Omit<ContentDocument, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<ContentDocument> {
    const doc = await prisma.contentDocument.update({
      where: { id },
      data: {
        type: data.type,
        title: data.title,
        slug: data.slug,
        description: data.description,
        categoryId: data.categoryId,
        fileUrl: data.fileUrl,
        previewPdfUrl: data.previewPdfUrl,
        thumbnailUrl: data.thumbnailUrl,
      },
    });
    return mapDoc(doc);
  }

  async delete(id: string): Promise<ContentDocument> {
    const doc = await prisma.contentDocument.delete({ where: { id } });
    return mapDoc(doc);
  }
}

export const contentDocumentRepository = new ContentDocumentRepository();
