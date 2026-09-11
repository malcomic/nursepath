import { ApiError } from '@/lib/errors/api-error';

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

const DEFAULT_MAX = 5;
const DEFAULT_WINDOW_MS = 60 * 60 * 1000;

/** In-memory IP rate limit (5 requests per hour by default). */
export function checkIpRateLimit(
  ip: string,
  max = DEFAULT_MAX,
  windowMs = DEFAULT_WINDOW_MS
) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return;
  }

  if (entry.count >= max) {
    throw new ApiError(429, 'Too many requests. Please try again later.');
  }

  entry.count += 1;
}

export function getClientIp(req: Request): string | undefined {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    undefined
  );
}
