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
        throw new errorHandler_1.ApiError(410, 'Direct purchases are disabled. Please use Stripe checkout to purchase guides.');
    }
}
exports.PurchaseService = PurchaseService;
exports.purchaseService = new PurchaseService();
//# sourceMappingURL=purchaseService.js.map