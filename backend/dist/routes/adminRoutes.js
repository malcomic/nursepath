"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = require("../controllers/adminController");
const router = (0, express_1.Router)();
router.post('/login', adminController_1.adminController.login);
router.get('/me', adminController_1.adminController.getMe);
exports.default = router;
//# sourceMappingURL=adminRoutes.js.map