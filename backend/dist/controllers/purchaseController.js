"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.purchaseController = exports.PurchaseController = void 0;
const zod_1 = require("zod");
const purchaseService_1 = require("../services/purchaseService");
const errorHandler_1 = require("../middleware/errorHandler");
const createPurchaseSchema = zod_1.z.object({
    guideId: zod_1.z.string().min(1),
    buyerName: zod_1.z.string().min(1).max(255),
    buyerEmail: zod_1.z.string().email(),
});
class PurchaseController {
    constructor() {
        this.getAll = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            if (!req.admin) {
                throw new errorHandler_1.ApiError(401, 'Not authenticated');
            }
            const purchases = await purchaseService_1.purchaseService.getAllPurchases();
            res.json({
                success: true,
                data: purchases,
            });
        });
        this.getByGuide = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            if (!req.admin) {
                throw new errorHandler_1.ApiError(401, 'Not authenticated');
            }
            const { guideId } = req.params;
            const purchases = await purchaseService_1.purchaseService.getPurchasesByGuide(guideId);
            res.json({
                success: true,
                data: purchases,
            });
        });
        this.getByEmail = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { email } = req.query;
            if (!email || typeof email !== 'string') {
                throw new errorHandler_1.ApiError(400, 'Email required');
            }
            const purchases = await purchaseService_1.purchaseService.getPurchasesByEmail(email);
            res.json({
                success: true,
                data: purchases,
            });
        });
        this.create = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const data = createPurchaseSchema.parse(req.body);
            const result = await purchaseService_1.purchaseService.createPurchase(data.guideId, data.buyerName, data.buyerEmail);
            res.status(201).json({
                success: true,
                data: result,
            });
        });
    }
}
exports.PurchaseController = PurchaseController;
exports.purchaseController = new PurchaseController();
//# sourceMappingURL=purchaseController.js.map