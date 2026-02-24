import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

export interface AuthRequest extends Request {
  admin?: { id: string; email: string };
}

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public errors?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      errors: err.errors,
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      errors: err.message,
    });
  }

  res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
};

export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
