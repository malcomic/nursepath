"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.guideController = exports.GuideController = void 0;
const zod_1 = require("zod");
const guideService_1 = require("../services/guideService");
const errorHandler_1 = require("../middleware/errorHandler");
const createFileUrlSchema = (prefix, errorMessage) => zod_1.z.string().refine((value) => {
    if (value.startsWith(prefix)) {
        return true;
    }
    try {
        new URL(value);
        return true;
    }
    catch {
        return false;
    }
}, errorMessage);
const thumbnailUrlSchema = createFileUrlSchema('/api/guides/thumbnail/', 'Invalid thumbnail URL');
const pdfUrlSchema = createFileUrlSchema('/api/guides/pdf/', 'Invalid PDF URL');
const createGuideSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(255),
    description: zod_1.z.string().optional(),
    price: zod_1.z.number().positive(),
    stripePriceId: zod_1.z
        .string()
        .trim()
        .min(1)
        .max(255)
        .optional()
        .or(zod_1.z.literal('').transform(() => undefined)),
    categoryId: zod_1.z.string().min(1),
    pdfUrl: pdfUrlSchema,
    thumbnailUrl: thumbnailUrlSchema.optional(),
});
const updateGuideSchema = createGuideSchema.partial();
class GuideController {
    constructor() {
        this.getAll = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const guides = await guideService_1.guideService.getAllGuides();
            res.json({
                success: true,
                data: guides,
            });
        });
        this.getById = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { id } = req.params;
            const guide = await guideService_1.guideService.getGuide(id);
            res.json({
                success: true,
                data: guide,
            });
        });
        this.getByCategory = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { categoryId } = req.params;
            const guides = await guideService_1.guideService.getGuidesByCategory(categoryId);
            res.json({
                success: true,
                data: guides,
            });
        });
        this.search = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { q } = req.query;
            if (!q || typeof q !== 'string') {
                throw new errorHandler_1.ApiError(400, 'Search query required');
            }
            const results = await guideService_1.guideService.searchGuides(q);
            res.json({
                success: true,
                data: results,
            });
        });
        this.create = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            if (!req.admin) {
                throw new errorHandler_1.ApiError(401, 'Not authenticated');
            }
            const data = createGuideSchema.parse(req.body);
            const guide = await guideService_1.guideService.createGuide(data);
            res.status(201).json({
                success: true,
                data: guide,
            });
        });
        this.update = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            if (!req.admin) {
                throw new errorHandler_1.ApiError(401, 'Not authenticated');
            }
            const { id } = req.params;
            const data = updateGuideSchema.parse(req.body);
            const guide = await guideService_1.guideService.updateGuide(id, data);
            res.json({
                success: true,
                data: guide,
            });
        });
        this.delete = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            if (!req.admin) {
                throw new errorHandler_1.ApiError(401, 'Not authenticated');
            }
            const { id } = req.params;
            await guideService_1.guideService.deleteGuide(id);
            res.json({
                success: true,
                message: 'Guide deleted',
            });
        });
        this.uploadThumbnail = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            if (!req.admin) {
                throw new errorHandler_1.ApiError(401, 'Not authenticated');
            }
            if (!req.file) {
                throw new errorHandler_1.ApiError(400, 'Thumbnail file is required');
            }
            const thumbnailUrl = `/api/guides/thumbnail/${encodeURIComponent(req.file.filename)}`;
            res.status(201).json({
                success: true,
                data: { thumbnailUrl },
            });
        });
        this.uploadPdf = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            if (!req.admin) {
                throw new errorHandler_1.ApiError(401, 'Not authenticated');
            }
            if (!req.file) {
                throw new errorHandler_1.ApiError(400, 'PDF file is required');
            }
            const pdfUrl = `/api/guides/pdf/${encodeURIComponent(req.file.filename)}`;
            res.status(201).json({
                success: true,
                data: { pdfUrl },
            });
        });
    }
}
exports.GuideController = GuideController;
exports.guideController = new GuideController();
//# sourceMappingURL=guideController.js.map