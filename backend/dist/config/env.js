"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateConfig = exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    port: parseInt(process.env.PORT || '5000', 10),
    databaseUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    jwtExpiry: process.env.JWT_EXPIRY || '24h',
    nodeEnv: process.env.NODE_ENV || 'development',
    uploadDir: process.env.UPLOAD_DIR || './uploads',
};
const validateConfig = () => {
    if (!exports.config.databaseUrl) {
        throw new Error('DATABASE_URL is required');
    }
    if (!exports.config.jwtSecret) {
        throw new Error('JWT_SECRET is required');
    }
};
exports.validateConfig = validateConfig;
//# sourceMappingURL=env.js.map