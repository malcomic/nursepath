"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const guideController_1 = require("../controllers/guideController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Public routes
router.get('/', guideController_1.guideController.getAll);
router.get('/search', guideController_1.guideController.search);
router.get('/:id', guideController_1.guideController.getById);
router.get('/category/:categoryId', guideController_1.guideController.getByCategory);
// Admin routes
router.post('/', auth_1.authMiddleware, guideController_1.guideController.create);
router.put('/:id', auth_1.authMiddleware, guideController_1.guideController.update);
router.delete('/:id', auth_1.authMiddleware, guideController_1.guideController.delete);
exports.default = router;
//# sourceMappingURL=guideRoutes.js.map