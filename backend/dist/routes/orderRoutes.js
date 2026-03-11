"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const orderController_1 = require("../controllers/orderController");
const router = (0, express_1.Router)();
// Admin routes
router.get('/', auth_1.authMiddleware, orderController_1.orderController.getAll);
router.get('/:id', auth_1.authMiddleware, orderController_1.orderController.getById);
router.post('/:id/resend-link', auth_1.authMiddleware, orderController_1.orderController.resendLink);
router.post('/:id/regenerate-link', auth_1.authMiddleware, orderController_1.orderController.regenerateLink);
router.post('/:id/refund', auth_1.authMiddleware, orderController_1.orderController.refund);
router.delete('/:id', auth_1.authMiddleware, orderController_1.orderController.delete);
exports.default = router;
//# sourceMappingURL=orderRoutes.js.map