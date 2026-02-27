"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminController = exports.AdminController = void 0;
const zod_1 = require("zod");
const adminService_1 = require("../services/adminService");
const errorHandler_1 = require("../middleware/errorHandler");
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
});
class AdminController {
    constructor() {
        this.login = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { email, password } = loginSchema.parse(req.body);
            const result = await adminService_1.adminService.login(email, password);
            res.json({
                success: true,
                data: result,
            });
        });
        this.getMe = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            if (!req.admin) {
                throw new errorHandler_1.ApiError(401, 'Not authenticated');
            }
            const admin = await adminService_1.adminService.getAdmin(req.admin.id);
            res.json({
                success: true,
                data: admin,
            });
        });
    }
}
exports.AdminController = AdminController;
exports.adminController = new AdminController();
//# sourceMappingURL=adminController.js.map