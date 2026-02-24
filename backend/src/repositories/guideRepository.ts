import { prisma } from '../lib/prisma';
import { Guide } from '../types';

export class GuideRepository {
  async findAll(): Promise<(Guide & { category: any })[]> {
    const guides = await prisma.guide.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
    return guides.map(g => ({ ...g, price: Number(g.price) })) as any;
  }

  async findById(id: string): Promise<(Guide & { category: any }) | null> {
    const guide = await prisma.guide.findUnique({
      where: { id },
      include: { category: true },
    });
    return guide ? { ...guide, price: Number(guide.price) } as any : null;
  }

  async findByCategory(categoryId: string): Promise<(Guide & { category: any })[]> {
    const guides = await prisma.guide.findMany({
      where: { categoryId },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
    return guides.map(g => ({ ...g, price: Number(g.price) })) as any;
  }

  async create(data: Omit<Guide, 'id' | 'createdAt' | 'updatedAt'>): Promise<Guide> {
    const guide = await prisma.guide.create({
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        categoryId: data.categoryId,
        pdfUrl: data.pdfUrl,
        thumbnailUrl: data.thumbnailUrl,
      },
    });
    return { ...guide, price: Number(guide.price) } as any;
  }

  async update(id: string, data: Partial<Guide>): Promise<Guide> {
    const guide = await prisma.guide.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        price: data.price ? Number(data.price) : undefined,
        categoryId: data.categoryId,
        pdfUrl: data.pdfUrl,
        thumbnailUrl: data.thumbnailUrl,
      },
    });
    return { ...guide, price: Number(guide.price) } as any;
  }

  async delete(id: string): Promise<Guide> {
    const guide = await prisma.guide.delete({
      where: { id },
    });
    return { ...guide, price: Number(guide.price) } as any;
  }

  async search(query: string): Promise<(Guide & { category: any })[]> {
    const guides = await prisma.guide.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: { category: true },
    });
    return guides.map(g => ({ ...g, price: Number(g.price) })) as any;
  }
}

export const guideRepository = new GuideRepository();
