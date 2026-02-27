"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const zod_1 = require("zod");
const errorHandler_1 = require("./errorHandler");
const validateRequest = (schema) => (req, res, next) => {
    try {
        const validated = schema.parse(req.body);
        req.body = validated;
        next();
    }
    catch (err) {
        if (err instanceof zod_1.z.ZodError) {
            throw new errorHandler_1.ApiError(400, 'Validation error', err.issues);
        }
        next(err);
    }
};
exports.validateRequest = validateRequest;
//# sourceMappingURL=validation.js.map