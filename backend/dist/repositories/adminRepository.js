"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRepository = exports.AdminRepository = void 0;
const prisma_1 = require("../lib/prisma");
class AdminRepository {
    async findByEmail(email) {
        return prisma_1.prisma.admin.findUnique({
            where: { email },
        });
    }
    async findById(id) {
        return prisma_1.prisma.admin.findUnique({
            where: { id },
        });
    }
    async create(email, passwordHash) {
        return prisma_1.prisma.admin.create({
            data: {
                email,
                passwordHash,
            },
        });
    }
    async updatePassword(id, passwordHash) {
        return prisma_1.prisma.admin.update({
            where: { id },
            data: { passwordHash },
        });
    }
}
exports.AdminRepository = AdminRepository;
exports.adminRepository = new AdminRepository();
//# sourceMappingURL=adminRepository.js.map