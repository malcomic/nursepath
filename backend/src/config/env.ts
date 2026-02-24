import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  jwtExpiry: process.env.JWT_EXPIRY || '24h',
  nodeEnv: process.env.NODE_ENV || 'development',
  uploadDir: process.env.UPLOAD_DIR || './uploads',
};

export const validateConfig = () => {
  if (!config.databaseUrl) {
    throw new Error('DATABASE_URL is required');
  }
  if (!config.jwtSecret) {
    throw new Error('JWT_SECRET is required');
  }
};
