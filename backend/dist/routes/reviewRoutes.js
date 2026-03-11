"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const reviewController_1 = require("../controllers/reviewController");
const router = (0, express_1.Router)();
router.get('/', auth_1.authMiddleware, reviewController_1.reviewController.getAllForAdmin);
exports.default = router;
//# sourceMappingURL=reviewRoutes.js.map