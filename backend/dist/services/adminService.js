"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminService = exports.AdminService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const adminRepository_1 = require("../repositories/adminRepository");
const env_1 = require("../config/env");
const errorHandler_1 = require("../middleware/errorHandler");
class AdminService {
    async login(email, password) {
        const admin = await adminRepository_1.adminRepository.findByEmail(email);
        if (!admin) {
            throw new errorHandler_1.ApiError(401, 'Invalid credentials');
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, admin.passwordHash);
        if (!isPasswordValid) {
            throw new errorHandler_1.ApiError(401, 'Invalid credentials');
        }
        const token = jsonwebtoken_1.default.sign({ id: admin.id, email: admin.email }, env_1.config.jwtSecret, { expiresIn: env_1.config.jwtExpiry });
        return {
            token,
            admin: {
                id: admin.id,
                email: admin.email,
            },
        };
    }
    async getAdmin(id) {
        const admin = await adminRepository_1.adminRepository.findById(id);
        if (!admin) {
            throw new errorHandler_1.ApiError(404, 'Admin not found');
        }
        return {
            id: admin.id,
            email: admin.email,
        };
    }
}
exports.AdminService = AdminService;
exports.adminService = new AdminService();
//# sourceMappingURL=adminService.js.map