"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRepository = exports.CategoryRepository = void 0;
const prisma_1 = require("../lib/prisma");
class CategoryRepository {
    async findAll() {
        return prisma_1.prisma.category.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
    async findById(id) {
        return prisma_1.prisma.category.findUnique({
            where: { id },
        });
    }
    async create(name, description, icon) {
        return prisma_1.prisma.category.create({
            data: {
                name,
                description,
                icon,
            },
        });
    }
    async update(id, data) {
        return prisma_1.prisma.category.update({
            where: { id },
            data: {
                name: data.name,
                description: data.description,
                icon: data.icon,
            },
        });
    }
    async delete(id) {
        return prisma_1.prisma.category.delete({
            where: { id },
        });
    }
}
exports.CategoryRepository = CategoryRepository;
exports.categoryRepository = new CategoryRepository();
//# sourceMappingURL=categoryRepository.js.map