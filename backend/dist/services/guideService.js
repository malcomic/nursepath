"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.guideService = exports.GuideService = void 0;
const guideRepository_1 = require("../repositories/guideRepository");
const categoryRepository_1 = require("../repositories/categoryRepository");
const errorHandler_1 = require("../middleware/errorHandler");
class GuideService {
    async getAllGuides() {
        return guideRepository_1.guideRepository.findAll();
    }
    async getGuide(id) {
        const guide = await guideRepository_1.guideRepository.findById(id);
        if (!guide) {
            throw new errorHandler_1.ApiError(404, 'Guide not found');
        }
        return guide;
    }
    async getGuidesByCategory(categoryId) {
        await categoryRepository_1.categoryRepository.findById(categoryId); // Verify category exists
        return guideRepository_1.guideRepository.findByCategory(categoryId);
    }
    async createGuide(data) {
        // Verify category exists
        await categoryRepository_1.categoryRepository.findById(data.categoryId);
        return guideRepository_1.guideRepository.create({
            title: data.title,
            description: data.description ?? null,
            price: data.price,
            categoryId: data.categoryId,
            pdfUrl: data.pdfUrl,
            thumbnailUrl: data.thumbnailUrl ?? null,
        });
    }
    async updateGuide(id, data) {
        await this.getGuide(id); // Verify exists
        if (data.categoryId) {
            await categoryRepository_1.categoryRepository.findById(data.categoryId); // Verify category exists
        }
        return guideRepository_1.guideRepository.update(id, data);
    }
    async deleteGuide(id) {
        await this.getGuide(id); // Verify exists
        return guideRepository_1.guideRepository.delete(id);
    }
    async searchGuides(query) {
        if (query.length < 2) {
            throw new errorHandler_1.ApiError(400, 'Search query must be at least 2 characters');
        }
        return guideRepository_1.guideRepository.search(query);
    }
}
exports.GuideService = GuideService;
exports.guideService = new GuideService();
//# sourceMappingURL=guideService.js.map