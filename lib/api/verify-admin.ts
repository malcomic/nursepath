import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { config } from '@/lib/config/env';
import { ApiError } from '@/lib/errors/api-error';
import type { AdminPayload } from '@/lib/types';

export function verifyAdmin(request: NextRequest): AdminPayload {
  const cookieToken = request.cookies.get('admin_token')?.value;
  const headerToken = request.headers.get('authorization')?.split(' ')[1];
  const token = cookieToken || headerToken;

  if (!token) {
    throw new ApiError(401, 'No token provided');
  }

  try {
    return jwt.verify(token, config.jwtSecret!) as AdminPayload;
  } catch {
    throw new ApiError(401, 'Invalid token');
  }
}
