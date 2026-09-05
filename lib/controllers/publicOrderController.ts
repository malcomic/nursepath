import { prisma } from '@/lib/prisma';
import { orderRepository } from '@/lib/repositories/orderRepository';
import { orderService } from '@/lib/services/orderService';
import { ApiError } from '@/lib/errors/api-error';
import { PaymentStatus } from '@/lib/generated/prisma/enums';

export async function listOrdersByEmail(email: string | null) {
  if (!email || typeof email !== 'string') {
    throw new ApiError(400, 'Email is required');
  }

  const orders = await prisma.order.findMany({
    where: {
      customerEmail: email.trim(),
      paymentStatus: PaymentStatus.PAID,
    },
    include: { guide: true },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  return {
    success: true as const,
    data: orders.map((order) => {
      const canDownload = orderService.canDownload(order);
      const downloadStatus = orderService.getDownloadStatus(order);

      return {
        id: order.id,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt,
        canDownload,
        downloadStatus,
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
    }),
  };
}

export async function getOrderStatus(id: string) {
  if (!id) {
    throw new ApiError(400, 'Order id is required');
  }

  const order = await orderRepository.findById(id);
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  const siblings =
    order.paymentReference != null
      ? await orderRepository.findByPaymentReference(order.paymentReference)
      : [order];

  const items = siblings.map((o) => {
    const eligible = orderService.canDownload(o);
    return {
      id: o.id,
      paymentStatus: o.paymentStatus,
      guide: {
        id: o.guide.id,
        title: o.guide.title,
        price: Number(o.guide.price),
      },
      downloadUrl: eligible ? `/api/download/${encodeURIComponent(o.downloadToken)}` : null,
    };
  });

  const eligible = orderService.canDownload(order);
  const downloadUrl = eligible
    ? `/api/download/${encodeURIComponent(order.downloadToken)}`
    : null;

  return {
    success: true as const,
    data: {
      id: order.id,
      paymentStatus: order.paymentStatus,
      guide: {
        id: order.guide.id,
        title: order.guide.title,
        price: Number(order.guide.price),
      },
      downloadUrl,
      items,
    },
  };
}
