import { createHash, randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';
import { config } from '@/lib/config/env';
import { ApiError } from '@/lib/errors/api-error';

export const BUYER_TOKEN_COOKIE = 'buyer_token';
export const BUYER_SESSION_DAYS = 7;
export const MAGIC_LINK_TTL_MS = 30 * 60 * 1000;

export interface BuyerPayload {
  email: string;
  typ: 'buyer';
}

export function hashToken(raw: string): string {
  return createHash('sha256').update(raw).digest('hex');
}

export function generateRawToken(): string {
  return randomBytes(32).toString('hex');
}

export function signBuyerSession(email: string): string {
  return jwt.sign(
    { email: email.trim().toLowerCase(), typ: 'buyer' } satisfies BuyerPayload,
    config.jwtSecret!,
    { expiresIn: `${BUYER_SESSION_DAYS}d` }
  );
}

export function verifyBuyerToken(token: string): BuyerPayload {
  try {
    const payload = jwt.verify(token, config.jwtSecret!) as BuyerPayload;
    if (payload.typ !== 'buyer' || !payload.email) {
      throw new ApiError(401, 'Invalid session');
    }
    return { email: payload.email.toLowerCase(), typ: 'buyer' };
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(401, 'Invalid or expired session');
  }
}

export function buildBuyerCookie(token: string): string {
  const maxAge = BUYER_SESSION_DAYS * 86400;
  const secure = config.nodeEnv === 'production' ? '; Secure' : '';
  return `${BUYER_TOKEN_COOKIE}=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAge}${secure}`;
}

export function clearBuyerCookie(): string {
  const secure = config.nodeEnv === 'production' ? '; Secure' : '';
  return `${BUYER_TOKEN_COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0${secure}`;
}
