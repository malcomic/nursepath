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
    publicAppUrl: process.env.PUBLIC_APP_URL,
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
};
const validateConfig = () => {
    if (!exports.config.databaseUrl) {
        throw new Error('DATABASE_URL is required');
    }
    if (!exports.config.jwtSecret) {
        throw new Error('JWT_SECRET is required');
    }
    if (!exports.config.publicAppUrl) {
        throw new Error('PUBLIC_APP_URL is required (e.g. http://localhost:5173)');
    }
    if (!exports.config.stripeSecretKey) {
        throw new Error('STRIPE_SECRET_KEY is required');
    }
    if (!exports.config.stripeWebhookSecret) {
        throw new Error('STRIPE_WEBHOOK_SECRET is required');
    }
};
exports.validateConfig = validateConfig;
//# sourceMappingURL=env.js.map