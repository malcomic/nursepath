"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewController = exports.ReviewController = void 0;
const errorHandler_1 = require("../middleware/errorHandler");
const prisma_1 = require("../lib/prisma");
class ReviewController {
    constructor() {
        this.getAllForAdmin = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            if (!req.admin) {
                throw new errorHandler_1.ApiError(401, 'Not authenticated');
            }
            const reviews = await prisma_1.prisma.review.findMany({
                orderBy: { createdAt: 'desc' },
            });
            const data = reviews.map((r) => ({
                id: r.id,
                name: r.name,
                school: r.school,
                exam_type: r.exam_type,
                rating: r.rating,
                message: r.message,
                verification_type: r.verification_type,
                screenshot_url: r.screenshot_url,
                status: r.status,
                created_at: r.createdAt.toISOString(),
                updated_at: r.updatedAt.toISOString(),
            }));
            res.json({
                success: true,
                data,
            });
        });
    }
}
exports.ReviewController = ReviewController;
exports.reviewController = new ReviewController();
//# sourceMappingURL=reviewController.js.map