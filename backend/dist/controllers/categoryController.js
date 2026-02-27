"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryController = exports.CategoryController = void 0;
const zod_1 = require("zod");
const categoryService_1 = require("../services/categoryService");
const errorHandler_1 = require("../middleware/errorHandler");
const createCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(255),
    description: zod_1.z.string().optional(),
    icon: zod_1.z.string().optional(),
});
const updateCategorySchema = createCategorySchema.partial();
class CategoryController {
    constructor() {
        this.getAll = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const categories = await categoryService_1.categoryService.getAllCategories();
            res.json({
                success: true,
                data: categories,
            });
        });
        this.getById = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { id } = req.params;
            const category = await categoryService_1.categoryService.getCategory(id);
            res.json({
                success: true,
                data: category,
            });
        });
        this.create = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            if (!req.admin) {
                throw new errorHandler_1.ApiError(401, 'Not authenticated');
            }
            const data = createCategorySchema.parse(req.body);
            const category = await categoryService_1.categoryService.createCategory(data.name, data.description, data.icon);
            res.status(201).json({
                success: true,
                data: category,
            });
        });
        this.update = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            if (!req.admin) {
                throw new errorHandler_1.ApiError(401, 'Not authenticated');
            }
            const { id } = req.params;
            const data = updateCategorySchema.parse(req.body);
            const category = await categoryService_1.categoryService.updateCategory(id, data.name || '', data.description, data.icon);
            res.json({
                success: true,
                data: category,
            });
        });
        this.delete = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            if (!req.admin) {
                throw new errorHandler_1.ApiError(401, 'Not authenticated');
            }
            const { id } = req.params;
            await categoryService_1.categoryService.deleteCategory(id);
            res.json({
                success: true,
                message: 'Category deleted',
            });
        });
    }
}
exports.CategoryController = CategoryController;
exports.categoryController = new CategoryController();
//# sourceMappingURL=categoryController.js.map