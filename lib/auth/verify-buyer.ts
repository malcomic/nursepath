import { NextRequest } from 'next/server';
import { BUYER_TOKEN_COOKIE, verifyBuyerToken, type BuyerPayload } from '@/lib/auth/buyer-session';
import { ApiError } from '@/lib/errors/api-error';

export function requireBuyerSession(request: NextRequest): BuyerPayload {
  const token = request.cookies.get(BUYER_TOKEN_COOKIE)?.value;
  if (!token) {
    throw new ApiError(401, 'Sign in required. Request a magic link from the dashboard.');
  }
  return verifyBuyerToken(token);
}

export function getBuyerSession(request: NextRequest): BuyerPayload | null {
  const token = request.cookies.get(BUYER_TOKEN_COOKIE)?.value;
  if (!token) return null;
  try {
    return verifyBuyerToken(token);
  } catch {
    return null;
  }
}
