import { config } from '@/lib/config/env';

export const ADMIN_TOKEN_COOKIE = 'admin_token';

export function parseJwtExpiryToSeconds(expiry: string): number {
  const match = expiry.match(/^(\d+)([smhd])$/);
  if (!match) return 86400;
  const value = parseInt(match[1], 10);
  const unit = match[2];
  switch (unit) {
    case 's':
      return value;
    case 'm':
      return value * 60;
    case 'h':
      return value * 3600;
    case 'd':
      return value * 86400;
    default:
      return 86400;
  }
}

export function buildAdminCookie(token: string): string {
  const maxAge = parseJwtExpiryToSeconds(config.jwtExpiry || '24h');
  const secure = config.nodeEnv === 'production' ? '; Secure' : '';
  return `${ADMIN_TOKEN_COOKIE}=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAge}${secure}`;
}

export function clearAdminCookie(): string {
  const secure = config.nodeEnv === 'production' ? '; Secure' : '';
  return `${ADMIN_TOKEN_COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0${secure}`;
}
