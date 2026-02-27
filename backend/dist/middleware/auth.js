"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const errorHandler_1 = require("./errorHandler");
const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            throw new errorHandler_1.ApiError(401, 'No token provided');
        }
        const decoded = jsonwebtoken_1.default.verify(token, env_1.config.jwtSecret);
        req.admin = decoded;
        next();
    }
    catch (err) {
        if (err instanceof errorHandler_1.ApiError) {
            return res.status(err.statusCode).json({
                success: false,
                error: err.message,
            });
        }
        res.status(401).json({
            success: false,
            error: 'Invalid token',
        });
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=auth.js.map