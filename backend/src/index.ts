import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import fs from 'fs';
import path from 'path';
import { config, validateConfig } from './config/env';
import { logger } from './config/logger';
import { errorHandler } from './middleware/errorHandler';
import { prisma } from './lib/prisma';
import adminRoutes from './routes/adminRoutes';
import categoryRoutes from './routes/categoryRoutes';
import guideRoutes from './routes/guideRoutes';
import purchaseRoutes from './routes/purchaseRoutes';
import settingsRoutes from './routes/settingsRoutes';

// Validate config
try {
  validateConfig();
} catch (error) {
  logger.error(error);
  process.exit(1);
}

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const thumbnailsDir = path.resolve(process.cwd(), 'uploads', 'thumbnails');
const pdfsDir = path.resolve(process.cwd(), 'uploads', 'pdfs');
fs.mkdirSync(thumbnailsDir, { recursive: true });
fs.mkdirSync(pdfsDir, { recursive: true });
app.use('/api/guides/thumbnail', express.static(thumbnailsDir));
app.use('/api/guides/pdf', express.static(pdfsDir));

// API Routes
app.use('/api/admin', adminRoutes);
app.use('/api/admin/settings', settingsRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/guides', guideRoutes);
app.use('/api/purchases', purchaseRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Backend is running!' });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = config.port;

const startServer = async () => {
  try {
    await prisma.$connect();
    logger.info('Connected to database');

    app.listen(PORT, () => {
      logger.info(`Server running on http://localhost:${PORT}`);
      logger.info(`Environment: ${config.nodeEnv}`);
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});
