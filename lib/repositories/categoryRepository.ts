import { prisma } from '@/lib/prisma';
import type { Category } from '@/lib/types';

export class CategoryRepository {
  async findAll(): Promise<Category[]> {
    return prisma.category.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findById(id: string): Promise<Category | null> {
    return prisma.category.findUnique({ where: { id } });
  }

  async create(name: string, description?: string, icon?: string): Promise<Category> {
    return prisma.category.create({ data: { name, description, icon } });
  }

  async update(id: string, data: Partial<Category>): Promise<Category> {
    return prisma.category.update({
      where: { id },
      data: { name: data.name, description: data.description, icon: data.icon },
    });
  }

  async delete(id: string): Promise<Category> {
    return prisma.category.delete({ where: { id } });
  }
}

export const categoryRepository = new CategoryRepository();
