"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderService = exports.OrderService = void 0;
const orderRepository_1 = require("../repositories/orderRepository");
const guideRepository_1 = require("../repositories/guideRepository");
const errorHandler_1 = require("../middleware/errorHandler");
const enums_1 = require("../generated/prisma/enums");
const emailService_1 = require("./emailService");
class OrderService {
    async listOrders(query) {
        const filters = {
            page: query.page,
            search: query.search,
            sort: query.sort || 'newest',
        };
        if (query.status && Object.values(enums_1.PaymentStatus).includes(query.status)) {
            filters.status = query.status;
        }
        if (query.dateFrom) {
            const d = new Date(query.dateFrom);
            if (!isNaN(d.getTime())) {
                filters.dateFrom = d;
            }
        }
        if (query.dateTo) {
            const d = new Date(query.dateTo);
            if (!isNaN(d.getTime())) {
                filters.dateTo = d;
            }
        }
        return orderRepository_1.orderRepository.findManyWithFilters(filters);
    }
    async getOrderById(id) {
        const order = await orderRepository_1.orderRepository.findById(id);
        if (!order) {
            throw new errorHandler_1.ApiError(404, 'Order not found');
        }
        return order;
    }
    async createOrderFromPurchase(payload) {
        const guide = await guideRepository_1.guideRepository.findById(payload.guideId);
        if (!guide) {
            throw new errorHandler_1.ApiError(404, 'Guide not found');
        }
        return orderRepository_1.orderRepository.create({
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
    getDownloadStatus(order) {
        const now = new Date();
        if (order.downloadExpiresAt <= now || order.downloadCount >= order.maxDownloads) {
            return 'EXPIRED';
        }
        if (order.downloadCount === 0)
            return 'NOT_DOWNLOADED';
        return 'DOWNLOADED';
    }
    canDownload(order) {
        const status = this.getDownloadStatus(order);
        const isPaid = order.paymentStatus === enums_1.PaymentStatus.PAID;
        const notRefunded = order.paymentStatus !== enums_1.PaymentStatus.REFUNDED;
        return status !== 'EXPIRED' && isPaid && notRefunded;
    }
    async markAsRefunded(id) {
        const order = await this.getOrderById(id);
        if (order.paymentStatus === enums_1.PaymentStatus.REFUNDED) {
            return order;
        }
        return orderRepository_1.orderRepository.update(id, {
            paymentStatus: enums_1.PaymentStatus.REFUNDED,
        });
    }
    async deleteOrder(id) {
        await this.getOrderById(id);
        await orderRepository_1.orderRepository.delete(id);
    }
    async resendDownloadLink(id, baseUrl) {
        const order = await this.getOrderById(id);
        if (!this.canDownload(order)) {
            throw new errorHandler_1.ApiError(400, 'Order is not eligible for download');
        }
        const downloadUrl = `${baseUrl}/api/download/${order.downloadToken}`;
        await emailService_1.emailService.sendDownloadEmail({
            to: order.customerEmail,
            name: order.customerName,
            downloadUrl,
        });
        return { downloadUrl };
    }
    async regenerateDownloadLink(id, baseUrl, options) {
        const order = await this.getOrderById(id);
        const now = new Date();
        const expiryHours = options?.expiryHours ?? 48;
        const maxDownloads = options?.maxDownloads ?? order.maxDownloads;
        const downloadExpiresAt = new Date(now.getTime() + expiryHours * 60 * 60 * 1000);
        const downloadToken = crypto.randomUUID();
        const updated = await orderRepository_1.orderRepository.update(order.id, {
            downloadToken,
            downloadExpiresAt,
            downloadCount: 0,
            maxDownloads,
        });
        const downloadUrl = `${baseUrl}/api/download/${updated.downloadToken}`;
        await emailService_1.emailService.sendDownloadEmail({
            to: updated.customerEmail,
            name: updated.customerName,
            downloadUrl,
        });
        return { order: updated, downloadUrl };
    }
}
exports.OrderService = OrderService;
exports.orderService = new OrderService();
//# sourceMappingURL=orderService.js.map