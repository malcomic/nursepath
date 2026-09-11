import { prisma } from '@/lib/prisma';
import type { Category } from '@/lib/types';

export class CategoryRepository {
  async findAll(): Promise<Category[]> {
    return prisma.category.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findById(id: string): Promise<Category | null> {
    return prisma.category.findUnique({ where: { id } });
  }

  async findBySlug(slug: string): Promise<Category | null> {
    return prisma.category.findUnique({ where: { slug } });
  }

  async create(data: {
    name: string;
    slug: string;
    description?: string | null;
    icon?: string | null;
  }): Promise<Category> {
    return prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description ?? null,
        icon: data.icon ?? null,
      },
    });
  }

  async update(
    id: string,
    data: {
      name?: string;
      slug?: string;
      description?: string | null;
      icon?: string | null;
    }
  ): Promise<Category> {
    return prisma.category.update({
      where: { id },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.slug !== undefined ? { slug: data.slug } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.icon !== undefined ? { icon: data.icon } : {}),
      },
    });
  }

  async delete(id: string): Promise<Category> {
    return prisma.category.delete({ where: { id } });
  }
}

export const categoryRepository = new CategoryRepository();
