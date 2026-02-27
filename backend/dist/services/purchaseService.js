"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.purchaseService = exports.PurchaseService = void 0;
const purchaseRepository_1 = require("../repositories/purchaseRepository");
const guideRepository_1 = require("../repositories/guideRepository");
const errorHandler_1 = require("../middleware/errorHandler");
class PurchaseService {
    async getAllPurchases() {
        return purchaseRepository_1.purchaseRepository.findAll();
    }
    async getPurchasesByGuide(guideId) {
        await guideRepository_1.guideRepository.findById(guideId); // Verify guide exists
        return purchaseRepository_1.purchaseRepository.findByGuideId(guideId);
    }
    async getPurchasesByEmail(email) {
        return purchaseRepository_1.purchaseRepository.findByEmail(email);
    }
    async createPurchase(guideId, buyerName, buyerEmail) {
        // Verify guide exists
        const guide = await guideRepository_1.guideRepository.findById(guideId);
        if (!guide) {
            throw new errorHandler_1.ApiError(404, 'Guide not found');
        }
        // Create purchase
        const purchase = await purchaseRepository_1.purchaseRepository.create(guideId, buyerName, buyerEmail);
        return {
            purchase,
            downloadUrl: guide.pdfUrl,
        };
    }
}
exports.PurchaseService = PurchaseService;
exports.purchaseService = new PurchaseService();
//# sourceMappingURL=purchaseService.js.map