"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderController = exports.OrderController = void 0;
const errorHandler_1 = require("../middleware/errorHandler");
const orderService_1 = require("../services/orderService");
class OrderController {
    constructor() {
        this.getAll = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            if (!req.admin) {
                throw new errorHandler_1.ApiError(401, 'Not authenticated');
            }
            const { page, search, status, dateFrom, dateTo, sort } = req.query;
            const result = await orderService_1.orderService.listOrders({
                page: page ? Number(page) : undefined,
                search: search,
                status: status,
                dateFrom: dateFrom,
                dateTo: dateTo,
                sort: sort,
            });
            res.json({
                success: true,
                data: result,
            });
        });
        this.getById = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            if (!req.admin) {
                throw new errorHandler_1.ApiError(401, 'Not authenticated');
            }
            const { id } = req.params;
            const order = await orderService_1.orderService.getOrderById(id);
            res.json({
                success: true,
                data: order,
            });
        });
        this.refund = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            if (!req.admin) {
                throw new errorHandler_1.ApiError(401, 'Not authenticated');
            }
            const { id } = req.params;
            const updated = await orderService_1.orderService.markAsRefunded(id);
            res.json({
                success: true,
                data: updated,
            });
        });
        this.resendLink = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            if (!req.admin) {
                throw new errorHandler_1.ApiError(401, 'Not authenticated');
            }
            const { id } = req.params;
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            const result = await orderService_1.orderService.resendDownloadLink(id, baseUrl);
            res.json({
                success: true,
                data: result,
            });
        });
        this.regenerateLink = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            if (!req.admin) {
                throw new errorHandler_1.ApiError(401, 'Not authenticated');
            }
            const { id } = req.params;
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            const { maxDownloads, expiryHours } = req.body || {};
            const result = await orderService_1.orderService.regenerateDownloadLink(id, baseUrl, {
                maxDownloads,
                expiryHours,
            });
            res.json({
                success: true,
                data: result,
            });
        });
        this.delete = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            if (!req.admin) {
                throw new errorHandler_1.ApiError(401, 'Not authenticated');
            }
            const { id } = req.params;
            await orderService_1.orderService.deleteOrder(id);
            res.json({
                success: true,
            });
        });
    }
}
exports.OrderController = OrderController;
exports.orderController = new OrderController();
//# sourceMappingURL=orderController.js.map