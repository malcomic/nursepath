import { prisma } from '@/lib/prisma';
import { PaymentStatus } from '@/lib/generated/prisma/enums';

export interface OrderFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: PaymentStatus;
  dateFrom?: Date;
  dateTo?: Date;
  sort?: 'newest' | 'oldest' | 'highest_price' | 'lowest_price';
}

export class OrderRepository {
  async findById(id: string) {
    return prisma.order.findUnique({
      where: { id },
      include: { guide: true },
    });
  }

  async findManyWithFilters(filters: OrderFilters) {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      dateFrom,
      dateTo,
      sort = 'newest',
    } = filters;

    const where: Record<string, unknown> = {};

    if (status) {
      where.paymentStatus = status;
    }

    if (search) {
      const searchTerm = search.trim();
      where.OR = [
        { id: { contains: searchTerm, mode: 'insensitive' } },
        { customerEmail: { contains: searchTerm, mode: 'insensitive' } },
        { customerName: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }

    if (dateFrom || dateTo) {
      where.createdAt = {} as Record<string, Date>;
      if (dateFrom) {
        (where.createdAt as Record<string, Date>).gte = dateFrom;
      }
      if (dateTo) {
        (where.createdAt as Record<string, Date>).lte = dateTo;
      }
    }

    let orderBy: Record<string, string> = { createdAt: 'desc' };
    if (sort === 'oldest') orderBy = { createdAt: 'asc' };
    else if (sort === 'highest_price') orderBy = { price: 'desc' };
    else if (sort === 'lowest_price') orderBy = { price: 'asc' };

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: { guide: true },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    return { items, total, page, limit };
  }

  async create(data: Parameters<typeof prisma.order.create>[0]['data']) {
    return prisma.order.create({ data });
  }

  async update(id: string, data: Parameters<typeof prisma.order.update>[0]['data']) {
    return prisma.order.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.order.delete({ where: { id } });
  }
}

export const orderRepository = new OrderRepository();
