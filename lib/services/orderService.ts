import crypto from 'crypto';
import { orderRepository, OrderFilters } from '@/lib/repositories/orderRepository';
import { guideRepository } from '@/lib/repositories/guideRepository';
import { ApiError } from '@/lib/errors/api-error';
import { PaymentStatus } from '@/lib/generated/prisma/enums';
import { emailService } from '@/lib/services/emailService';

export class OrderService {
  async listOrders(query: {
    page?: number;
    search?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    sort?: string;
  }) {
    const filters: OrderFilters = {
      page: query.page,
      search: query.search,
      sort: (query.sort as OrderFilters['sort']) || 'newest',
    };

    if (query.status && Object.values(PaymentStatus).includes(query.status as PaymentStatus)) {
      filters.status = query.status as PaymentStatus;
    }

    if (query.dateFrom) {
      const d = new Date(query.dateFrom);
      if (!isNaN(d.getTime())) filters.dateFrom = d;
    }
    if (query.dateTo) {
      const d = new Date(query.dateTo);
      if (!isNaN(d.getTime())) filters.dateTo = d;
    }

    return orderRepository.findManyWithFilters(filters);
  }

  async getOrderById(id: string) {
    const order = await orderRepository.findById(id);
    if (!order) {
      throw new ApiError(404, 'Order not found');
    }
    return order;
  }

  async createOrderFromPurchase(payload: {
    guideId: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    price: number;
    paymentStatus: PaymentStatus;
    paymentReference?: string;
    paymentProvider?: string;
    ipAddress?: string;
    downloadToken: string;
    downloadExpiresAt: Date;
    maxDownloads: number;
  }) {
    const guide = await guideRepository.findById(payload.guideId);
    if (!guide) {
      throw new ApiError(404, 'Guide not found');
    }

    return orderRepository.create({
      customerName: payload.customerName,
      customerEmail: payload.customerEmail,
      customerPhone: payload.customerPhone,
      guideId: payload.guideId,
      price: payload.price,
      paymentStatus: payload.paymentStatus,
      paymentReference: payload.paymentReference,
      paymentProvider: payload.paymentProvider,
      ipAddress: payload.ipAddress,
      downloadToken: payload.downloadToken,
      downloadExpiresAt: payload.downloadExpiresAt,
      maxDownloads: payload.maxDownloads,
    });
  }

  getDownloadStatus(order: {
    downloadExpiresAt: Date;
    downloadCount: number;
    maxDownloads: number;
  }) {
    const now = new Date();
    if (order.downloadExpiresAt <= now || order.downloadCount >= order.maxDownloads) {
      return 'EXPIRED';
    }
    if (order.downloadCount === 0) return 'NOT_DOWNLOADED';
    return 'DOWNLOADED';
  }

  canDownload(order: {
    paymentStatus: PaymentStatus;
    downloadExpiresAt: Date;
    downloadCount: number;
    maxDownloads: number;
  }) {
    const status = this.getDownloadStatus(order);
    const isPaid = order.paymentStatus === PaymentStatus.PAID;
    const notRefunded = order.paymentStatus !== PaymentStatus.REFUNDED;
    return status !== 'EXPIRED' && isPaid && notRefunded;
  }

  async markAsRefunded(id: string) {
    const order = await this.getOrderById(id);
    if (order.paymentStatus === PaymentStatus.REFUNDED) {
      return order;
    }
    return orderRepository.update(id, { paymentStatus: PaymentStatus.REFUNDED });
  }

  async deleteOrder(id: string) {
    await this.getOrderById(id);
    await orderRepository.delete(id);
  }

  async fulfillPaidOrder(id: string, baseUrl: string) {
    const order = await this.getOrderById(id);
    if (!this.canDownload(order)) {
      return;
    }

    const downloadUrl = `${baseUrl}/api/download/${order.downloadToken}`;
    await emailService.sendDownloadEmail({
      to: order.customerEmail,
      name: order.customerName,
      downloadUrl,
      guideTitle: order.guide.title,
    });
  }

  async resendDownloadLink(id: string, baseUrl: string) {
    const order = await this.getOrderById(id);
    if (!this.canDownload(order)) {
      throw new ApiError(400, 'Order is not eligible for download');
    }

    const downloadUrl = `${baseUrl}/api/download/${order.downloadToken}`;
    await emailService.sendDownloadEmail({
      to: order.customerEmail,
      name: order.customerName,
      downloadUrl,
      guideTitle: order.guide.title,
    });

    return { downloadUrl };
  }

  async regenerateDownloadLink(
    id: string,
    baseUrl: string,
    options?: { maxDownloads?: number; expiryHours?: number }
  ) {
    const order = await this.getOrderById(id);
    const now = new Date();
    const expiryHours = options?.expiryHours ?? 48;
    const maxDownloads = options?.maxDownloads ?? order.maxDownloads;
    const downloadExpiresAt = new Date(now.getTime() + expiryHours * 60 * 60 * 1000);
    const downloadToken = crypto.randomUUID();

    const updated = await orderRepository.update(order.id, {
      downloadToken,
      downloadExpiresAt,
      downloadCount: 0,
      maxDownloads,
    });

    const downloadUrl = `${baseUrl}/api/download/${updated.downloadToken}`;
    await emailService.sendDownloadEmail({
      to: updated.customerEmail,
      name: updated.customerName,
      downloadUrl,
      guideTitle: order.guide.title,
    });

    return { order: updated, downloadUrl };
  }
}

export const orderService = new OrderService();
