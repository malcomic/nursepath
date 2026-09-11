import { NextResponse } from 'next/server';
import { withHandler } from '@/lib/api/with-handler';
import { buyerAuthService } from '@/lib/services/buyerAuthService';
import { buildBuyerCookie } from '@/lib/auth/buyer-session';
import { config } from '@/lib/config/env';

export const GET = withHandler(async (req) => {
  const token = req.nextUrl.searchParams.get('token') || '';
  const { sessionToken } = await buyerAuthService.consumeMagicLink(token);

  const baseUrl = config.publicAppUrl || req.nextUrl.origin;
  const response = NextResponse.redirect(new URL('/dashboard', baseUrl));
  response.headers.set('Set-Cookie', buildBuyerCookie(sessionToken));
  return response;
});
