import { Request, Response } from 'express';
import { asyncHandler, ApiError } from '../middleware/errorHandler';
import { orderRepository } from '../repositories/orderRepository';
import { orderService } from '../services/orderService';
import { prisma } from '../lib/prisma';
import { PaymentStatus } from '../generated/prisma/enums';

export class PublicOrderController {
  listByEmail = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.query;
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

    res.json({
      success: true,
      data: orders.map((order) => ({
        id: order.id,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt,
        guide: {
          id: order.guide.id,
          title: order.guide.title,
          description: order.guide.description,
          price: Number(order.guide.price),
          thumbnailUrl: order.guide.thumbnailUrl,
        },
      })),
    });
  });

  getStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      throw new ApiError(400, 'Order id is required');
    }

    const order = await orderRepository.findById(id);
    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    const eligible = orderService.canDownload(order);
    const downloadUrl = eligible ? `/api/download/${encodeURIComponent(order.downloadToken)}` : null;

    res.json({
      success: true,
      data: {
        id: order.id,
        paymentStatus: order.paymentStatus,
        guide: {
          id: order.guide.id,
          title: order.guide.title,
          price: Number(order.guide.price),
        },
        downloadUrl,
      },
    });
  });
}

export const publicOrderController = new PublicOrderController();

