"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = require("../controllers/adminController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Public
router.post('/login', adminController_1.adminController.login);
// Protected admin self info
router.get('/me', auth_1.authMiddleware, adminController_1.adminController.getMe);
exports.default = router;
//# sourceMappingURL=adminRoutes.js.map