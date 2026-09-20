import { prisma } from '@/lib/prisma';
import { SubscriptionStatus } from '@/lib/generated/prisma/enums';

export type AdminUserListParams = {
  search?: string;
  page?: number;
  limit?: number;
};

export class UserRepository {
  async listForAdmin(params: AdminUserListParams = {}) {
    const page = Math.max(1, params.page ?? 1);
    const limit = Math.min(100, Math.max(1, params.limit ?? 20));
    const skip = (page - 1) * limit;
    const now = new Date();

    const search = params.search?.trim();
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : undefined;

    const [rows, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          _count: {
            select: { subscriptions: true, orders: true },
          },
          subscriptions: {
            where: {
              status: SubscriptionStatus.ACTIVE,
              endsAt: { gt: now },
            },
            orderBy: { endsAt: 'desc' },
            take: 1,
            select: {
              endsAt: true,
              plan: { select: { name: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return {
      items: rows.map((row) => {
        const active = row.subscriptions[0];
        return {
          id: row.id,
          name: row.name,
          email: row.email,
          createdAt: row.createdAt,
          counts: {
            subscriptions: row._count.subscriptions,
            orders: row._count.orders,
          },
          activeSubscription: active?.endsAt
            ? { planName: active.plan.name, endsAt: active.endsAt }
            : null,
        };
      }),
      total,
      page,
      limit,
    };
  }

  async findByIdForAdmin(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        createdAt: true,
        subscriptions: {
          orderBy: { createdAt: 'desc' },
          take: 100,
          select: {
            id: true,
            status: true,
            startsAt: true,
            endsAt: true,
            amountUsd: true,
            paymentReference: true,
            createdAt: true,
            plan: { select: { name: true, code: true } },
            downloads: {
              orderBy: { downloadedAt: 'desc' },
              select: {
                downloadedAt: true,
                contentDocument: { select: { title: true, type: true } },
              },
            },
          },
        },
        orders: {
          orderBy: { createdAt: 'desc' },
          take: 100,
          select: {
            id: true,
            price: true,
            paymentStatus: true,
            createdAt: true,
            downloadCount: true,
            maxDownloads: true,
            downloadExpiresAt: true,
            guide: { select: { title: true } },
          },
        },
      },
    });
  }
}

export const userRepository = new UserRepository();
