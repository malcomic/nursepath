"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const publicOrderController_1 = require("../controllers/publicOrderController");
const router = (0, express_1.Router)();
router.get('/by-email', publicOrderController_1.publicOrderController.listByEmail);
router.get('/:id', publicOrderController_1.publicOrderController.getStatus);
exports.default = router;
//# sourceMappingURL=publicOrderRoutes.js.map