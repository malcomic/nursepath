"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const enums_1 = require("../generated/prisma/enums");
const errorHandler_1 = require("../middleware/errorHandler");
const router = (0, express_1.Router)();
router.get('/:token', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { token } = req.params;
    const order = await prisma_1.prisma.order.findUnique({
        where: { downloadToken: token },
        include: { guide: true },
    });
    if (!order) {
        throw new errorHandler_1.ApiError(404, 'Download link not found');
    }
    const now = new Date();
    const isExpired = order.downloadExpiresAt <= now || order.downloadCount >= order.maxDownloads;
    const isPaid = order.paymentStatus === enums_1.PaymentStatus.PAID;
    const notRefunded = order.paymentStatus !== enums_1.PaymentStatus.REFUNDED;
    if (!isPaid || !notRefunded || isExpired) {
        throw new errorHandler_1.ApiError(410, 'Download link has expired or is no longer valid');
    }
    await prisma_1.prisma.order.update({
        where: { id: order.id },
        data: {
            downloadCount: { increment: 1 },
        },
    });
    // For now, redirect directly to the PDF URL.
    // Later this can be replaced by signed URLs or proxied downloads.
    return res.redirect(order.guide.pdfUrl);
}));
exports.default = router;
//# sourceMappingURL=downloadRoutes.js.map