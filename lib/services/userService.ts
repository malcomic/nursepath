import { ApiError } from '@/lib/errors/api-error';
import {
  userRepository,
  type AdminUserListParams,
} from '@/lib/repositories/userRepository';

export class UserService {
  async listForAdmin(params: AdminUserListParams = {}) {
    return userRepository.listForAdmin(params);
  }

  async getByIdForAdmin(id: string) {
    const row = await userRepository.findByIdForAdmin(id);
    if (!row) {
      throw new ApiError(404, 'User not found');
    }

    return {
      user: {
        id: row.id,
        name: row.name,
        email: row.email,
        emailVerified: row.emailVerified,
        createdAt: row.createdAt,
      },
      subscriptions: row.subscriptions.map((s) => ({
        id: s.id,
        status: s.status,
        startsAt: s.startsAt,
        endsAt: s.endsAt,
        amountUsd: Number(s.amountUsd),
        paymentReference: s.paymentReference,
        createdAt: s.createdAt,
        plan: s.plan,
        downloads: s.downloads,
      })),
      orders: row.orders.map((o) => ({
        id: o.id,
        price: Number(o.price),
        paymentStatus: o.paymentStatus,
        createdAt: o.createdAt,
        downloadCount: o.downloadCount,
        maxDownloads: o.maxDownloads,
        downloadExpiresAt: o.downloadExpiresAt,
        guide: o.guide,
      })),
    };
  }
}

export const userService = new UserService();
