"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const settingsController_1 = require("../controllers/settingsController");
const router = (0, express_1.Router)();
router.get('/', auth_1.authMiddleware, settingsController_1.settingsController.get);
router.put('/', auth_1.authMiddleware, settingsController_1.settingsController.update);
exports.default = router;
//# sourceMappingURL=settingsRoutes.js.map