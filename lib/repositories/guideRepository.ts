import { prisma } from '@/lib/prisma';
import type { Category, Guide } from '@/lib/types';

export type GuideWithCategory = Guide & { category: Category | null };

export class GuideRepository {
  async findAll(): Promise<GuideWithCategory[]> {
    const guides = await prisma.guide.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
    return guides.map((g) => ({ ...g, price: Number(g.price) })) as GuideWithCategory[];
  }

  async findById(id: string): Promise<GuideWithCategory | null> {
    const guide = await prisma.guide.findUnique({
      where: { id },
      include: { category: true },
    });
    return guide ? ({ ...guide, price: Number(guide.price) } as GuideWithCategory) : null;
  }

  async findBySlug(slug: string): Promise<GuideWithCategory | null> {
    const guide = await prisma.guide.findUnique({
      where: { slug },
      include: { category: true },
    });
    return guide ? ({ ...guide, price: Number(guide.price) } as GuideWithCategory) : null;
  }

  async findByCategory(categoryId: string): Promise<GuideWithCategory[]> {
    const guides = await prisma.guide.findMany({
      where: { categoryId },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
    return guides.map((g) => ({ ...g, price: Number(g.price) })) as GuideWithCategory[];
  }

  async create(data: Omit<Guide, 'id' | 'createdAt' | 'updatedAt'>): Promise<Guide> {
    const guide = await prisma.guide.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        price: data.price,
        stripePriceId: data.stripePriceId ?? null,
        categoryId: data.categoryId,
        pdfUrl: data.pdfUrl,
        thumbnailUrl: data.thumbnailUrl,
      },
    });
    return { ...guide, price: Number(guide.price) } as Guide;
  }

  async update(id: string, data: Partial<Guide>): Promise<Guide> {
    const guide = await prisma.guide.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        price: data.price !== undefined ? Number(data.price) : undefined,
        stripePriceId: data.stripePriceId === undefined ? undefined : (data.stripePriceId ?? null),
        categoryId: data.categoryId,
        pdfUrl: data.pdfUrl,
        thumbnailUrl: data.thumbnailUrl,
      },
    });
    return { ...guide, price: Number(guide.price) } as Guide;
  }

  async delete(id: string): Promise<Guide> {
    const guide = await prisma.guide.delete({ where: { id } });
    return { ...guide, price: Number(guide.price) } as Guide;
  }

  async search(query: string): Promise<GuideWithCategory[]> {
    const guides = await prisma.guide.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: { category: true },
    });
    return guides.map((g) => ({ ...g, price: Number(g.price) })) as GuideWithCategory[];
  }
}

export const guideRepository = new GuideRepository();
