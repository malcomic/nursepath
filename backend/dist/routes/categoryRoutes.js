"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categoryController_1 = require("../controllers/categoryController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Public routes
router.get('/', categoryController_1.categoryController.getAll);
router.get('/:id', categoryController_1.categoryController.getById);
// Admin routes
router.post('/', auth_1.authMiddleware, categoryController_1.categoryController.create);
router.put('/:id', auth_1.authMiddleware, categoryController_1.categoryController.update);
router.delete('/:id', auth_1.authMiddleware, categoryController_1.categoryController.delete);
exports.default = router;
//# sourceMappingURL=categoryRoutes.js.map