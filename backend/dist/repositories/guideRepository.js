"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.guideRepository = exports.GuideRepository = void 0;
const prisma_1 = require("../lib/prisma");
class GuideRepository {
    async findAll() {
        const guides = await prisma_1.prisma.guide.findMany({
            include: { category: true },
            orderBy: { createdAt: 'desc' },
        });
        return guides.map(g => ({ ...g, price: Number(g.price) }));
    }
    async findById(id) {
        const guide = await prisma_1.prisma.guide.findUnique({
            where: { id },
            include: { category: true },
        });
        return guide ? { ...guide, price: Number(guide.price) } : null;
    }
    async findByCategory(categoryId) {
        const guides = await prisma_1.prisma.guide.findMany({
            where: { categoryId },
            include: { category: true },
            orderBy: { createdAt: 'desc' },
        });
        return guides.map(g => ({ ...g, price: Number(g.price) }));
    }
    async create(data) {
        const guide = await prisma_1.prisma.guide.create({
            data: {
                title: data.title,
                description: data.description,
                price: data.price,
                stripePriceId: data.stripePriceId ?? null,
                categoryId: data.categoryId,
                pdfUrl: data.pdfUrl,
                thumbnailUrl: data.thumbnailUrl,
            },
        });
        return { ...guide, price: Number(guide.price) };
    }
    async update(id, data) {
        const guide = await prisma_1.prisma.guide.update({
            where: { id },
            data: {
                title: data.title,
                description: data.description,
                price: data.price ? Number(data.price) : undefined,
                stripePriceId: data.stripePriceId === undefined ? undefined : (data.stripePriceId ?? null),
                categoryId: data.categoryId,
                pdfUrl: data.pdfUrl,
                thumbnailUrl: data.thumbnailUrl,
            },
        });
        return { ...guide, price: Number(guide.price) };
    }
    async delete(id) {
        const guide = await prisma_1.prisma.guide.delete({
            where: { id },
        });
        return { ...guide, price: Number(guide.price) };
    }
    async search(query) {
        const guides = await prisma_1.prisma.guide.findMany({
            where: {
                OR: [
                    { title: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } },
                ],
            },
            include: { category: true },
        });
        return guides.map(g => ({ ...g, price: Number(g.price) }));
    }
}
exports.GuideRepository = GuideRepository;
exports.guideRepository = new GuideRepository();
//# sourceMappingURL=guideRepository.js.map