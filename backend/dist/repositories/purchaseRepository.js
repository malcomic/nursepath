"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.purchaseRepository = exports.PurchaseRepository = void 0;
const prisma_1 = require("../lib/prisma");
class PurchaseRepository {
    async findAll() {
        return prisma_1.prisma.purchase.findMany({
            include: { guide: true },
            orderBy: { purchasedAt: 'desc' },
        });
    }
    async findByGuideId(guideId) {
        return prisma_1.prisma.purchase.findMany({
            where: { guideId },
            orderBy: { purchasedAt: 'desc' },
        });
    }
    async findByEmail(email) {
        return prisma_1.prisma.purchase.findMany({
            where: { buyerEmail: email },
            include: { guide: true },
            orderBy: { purchasedAt: 'desc' },
        });
    }
    async create(guideId, buyerName, buyerEmail) {
        return prisma_1.prisma.purchase.create({
            data: {
                guideId,
                buyerName,
                buyerEmail,
            },
        });
    }
}
exports.PurchaseRepository = PurchaseRepository;
exports.purchaseRepository = new PurchaseRepository();
//# sourceMappingURL=purchaseRepository.js.map