import { prisma } from '@/lib/prisma';
import { PaymentStatus } from '@/lib/generated/prisma/enums';
import { orderService } from '@/lib/services/orderService';

/**
 * Order listing for signed-in users (matched by userId and/or checkout email).
 */
export class BuyerAuthService {
  async listSessionOrders(email: string, userId?: string) {
    const normalized = email.trim().toLowerCase();
    const orders = await prisma.order.findMany({
      where: {
        paymentStatus: PaymentStatus.PAID,
        OR: [
          ...(userId ? [{ userId }] : []),
          { customerEmail: { equals: normalized, mode: 'insensitive' as const } },
        ],
      },
      include: { guide: true },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return orders.map((order) => {
      const canDownload = orderService.canDownload(order);
      return {
        id: order.id,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt,
        canDownload,
        downloadStatus: orderService.getDownloadStatus(order),
        downloadUrl: canDownload
          ? `/api/download/${encodeURIComponent(order.downloadToken)}`
          : null,
        guide: {
          id: order.guide.id,
          title: order.guide.title,
          description: order.guide.description,
          price: Number(order.guide.price),
          thumbnailUrl: order.guide.thumbnailUrl,
        },
      };
    });
  }
}

export const buyerAuthService = new BuyerAuthService();
