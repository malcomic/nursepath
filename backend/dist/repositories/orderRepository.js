"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRepository = exports.OrderRepository = void 0;
const prisma_1 = require("../lib/prisma");
class OrderRepository {
    async findById(id) {
        return prisma_1.prisma.order.findUnique({
            where: { id },
            include: {
                guide: true,
            },
        });
    }
    async findManyWithFilters(filters) {
        const { page = 1, limit = 20, search, status, dateFrom, dateTo, sort = 'newest', } = filters;
        const where = {};
        if (status) {
            where.paymentStatus = status;
        }
        if (search) {
            const searchTerm = search.trim();
            where.OR = [
                { id: { contains: searchTerm, mode: 'insensitive' } },
                { customerEmail: { contains: searchTerm, mode: 'insensitive' } },
                { customerName: { contains: searchTerm, mode: 'insensitive' } },
            ];
        }
        if (dateFrom || dateTo) {
            where.createdAt = {};
            if (dateFrom) {
                where.createdAt.gte = dateFrom;
            }
            if (dateTo) {
                where.createdAt.lte = dateTo;
            }
        }
        let orderBy = { createdAt: 'desc' };
        if (sort === 'oldest') {
            orderBy = { createdAt: 'asc' };
        }
        else if (sort === 'highest_price') {
            orderBy = { price: 'desc' };
        }
        else if (sort === 'lowest_price') {
            orderBy = { price: 'asc' };
        }
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            prisma_1.prisma.order.findMany({
                where,
                include: { guide: true },
                orderBy,
                skip,
                take: limit,
            }),
            prisma_1.prisma.order.count({ where }),
        ]);
        return { items, total, page, limit };
    }
    async create(data) {
        return prisma_1.prisma.order.create({ data });
    }
    async update(id, data) {
        return prisma_1.prisma.order.update({
            where: { id },
            data,
        });
    }
    async delete(id) {
        return prisma_1.prisma.order.delete({
            where: { id },
        });
    }
}
exports.OrderRepository = OrderRepository;
exports.orderRepository = new OrderRepository();
//# sourceMappingURL=orderRepository.js.map