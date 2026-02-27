"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const purchaseController_1 = require("../controllers/purchaseController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Public routes
router.post('/', purchaseController_1.purchaseController.create);
router.get('/email', purchaseController_1.purchaseController.getByEmail);
// Admin routes
router.get('/', auth_1.authMiddleware, purchaseController_1.purchaseController.getAll);
router.get('/guide/:guideId', auth_1.authMiddleware, purchaseController_1.purchaseController.getByGuide);
exports.default = router;
//# sourceMappingURL=purchaseRoutes.js.map