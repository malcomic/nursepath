"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicOrderController = exports.PublicOrderController = void 0;
const errorHandler_1 = require("../middleware/errorHandler");
const orderRepository_1 = require("../repositories/orderRepository");
const orderService_1 = require("../services/orderService");
const prisma_1 = require("../lib/prisma");
const enums_1 = require("../generated/prisma/enums");
class PublicOrderController {
    constructor() {
        this.listByEmail = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { email } = req.query;
            if (!email || typeof email !== 'string') {
                throw new errorHandler_1.ApiError(400, 'Email is required');
            }
            const orders = await prisma_1.prisma.order.findMany({
                where: {
                    customerEmail: email.trim(),
                    paymentStatus: enums_1.PaymentStatus.PAID,
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
        this.getStatus = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { id } = req.params;
            if (!id) {
                throw new errorHandler_1.ApiError(400, 'Order id is required');
            }
            const order = await orderRepository_1.orderRepository.findById(id);
            if (!order) {
                throw new errorHandler_1.ApiError(404, 'Order not found');
            }
            const eligible = orderService_1.orderService.canDownload(order);
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
}
exports.PublicOrderController = PublicOrderController;
exports.publicOrderController = new PublicOrderController();
//# sourceMappingURL=publicOrderController.js.map