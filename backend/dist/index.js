"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const env_1 = require("./config/env");
const logger_1 = require("./config/logger");
const errorHandler_1 = require("./middleware/errorHandler");
const prisma_1 = require("./lib/prisma");
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const guideRoutes_1 = __importDefault(require("./routes/guideRoutes"));
const purchaseRoutes_1 = __importDefault(require("./routes/purchaseRoutes"));
const settingsRoutes_1 = __importDefault(require("./routes/settingsRoutes"));
const reviewRoutes_1 = __importDefault(require("./routes/reviewRoutes"));
const downloadRoutes_1 = __importDefault(require("./routes/downloadRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const stripeRoutes_1 = __importDefault(require("./routes/stripeRoutes"));
const stripeController_1 = require("./controllers/stripeController");
const publicOrderRoutes_1 = __importDefault(require("./routes/publicOrderRoutes"));
// Validate config
try {
    (0, env_1.validateConfig)();
}
catch (error) {
    logger_1.logger.error(error);
    process.exit(1);
}
const app = (0, express_1.default)();
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
// Stripe webhooks require the raw body for signature verification.
app.post('/api/stripe-webhook', express_1.default.raw({ type: 'application/json' }), stripeController_1.stripeController.webhook);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const thumbnailsDir = path_1.default.resolve(process.cwd(), 'uploads', 'thumbnails');
const pdfsDir = path_1.default.resolve(process.cwd(), 'uploads', 'pdfs');
fs_1.default.mkdirSync(thumbnailsDir, { recursive: true });
fs_1.default.mkdirSync(pdfsDir, { recursive: true });
app.use('/api/guides/thumbnail', express_1.default.static(thumbnailsDir));
app.use('/api/guides/pdf', express_1.default.static(pdfsDir));
// API Routes
app.use('/api/admin', adminRoutes_1.default);
app.use('/api/admin/settings', settingsRoutes_1.default);
app.use('/api/admin/reviews', reviewRoutes_1.default);
app.use('/api/categories', categoryRoutes_1.default);
app.use('/api/guides', guideRoutes_1.default);
app.use('/api/download', downloadRoutes_1.default);
app.use('/api/purchases', purchaseRoutes_1.default);
app.use('/api/admin/orders', orderRoutes_1.default);
app.use('/api/orders', publicOrderRoutes_1.default);
app.use('/api', stripeRoutes_1.default);
// Health check
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Backend is running!' });
});
// Error handler (must be last)
app.use(errorHandler_1.errorHandler);
// Start server
const PORT = env_1.config.port;
const startServer = async () => {
    try {
        await prisma_1.prisma.$connect();
        logger_1.logger.info('Connected to database');
        app.listen(PORT, () => {
            logger_1.logger.info(`Server running on http://localhost:${PORT}`);
            logger_1.logger.info(`Environment: ${env_1.config.nodeEnv}`);
        });
    }
    catch (error) {
        logger_1.logger.error(`Failed to start server: ${error instanceof Error ? error.message : String(error)}`);
        process.exit(1);
    }
};
startServer();
// Graceful shutdown
process.on('SIGINT', async () => {
    logger_1.logger.info('Shutting down gracefully...');
    await prisma_1.prisma.$disconnect();
    process.exit(0);
});
//# sourceMappingURL=index.js.map