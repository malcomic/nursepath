"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryService = exports.CategoryService = void 0;
const categoryRepository_1 = require("../repositories/categoryRepository");
const errorHandler_1 = require("../middleware/errorHandler");
class CategoryService {
    async getAllCategories() {
        return categoryRepository_1.categoryRepository.findAll();
    }
    async getCategory(id) {
        const category = await categoryRepository_1.categoryRepository.findById(id);
        if (!category) {
            throw new errorHandler_1.ApiError(404, 'Category not found');
        }
        return category;
    }
    async createCategory(name, description, icon) {
        const existing = await categoryRepository_1.categoryRepository.findAll();
        if (existing.some((c) => c.name === name)) {
            throw new errorHandler_1.ApiError(400, 'Category already exists');
        }
        return categoryRepository_1.categoryRepository.create(name, description, icon);
    }
    async updateCategory(id, name, description, icon) {
        await this.getCategory(id); // Verify exists
        return categoryRepository_1.categoryRepository.update(id, { name, description, icon });
    }
    async deleteCategory(id) {
        await this.getCategory(id); // Verify exists
        return categoryRepository_1.categoryRepository.delete(id);
    }
}
exports.CategoryService = CategoryService;
exports.categoryService = new CategoryService();
//# sourceMappingURL=categoryService.js.map