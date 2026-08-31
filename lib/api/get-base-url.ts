import { NextRequest } from 'next/server';
import { config } from '@/lib/config/env';

export function getBaseUrl(request: NextRequest): string {
  const proto = request.headers.get('x-forwarded-proto') || 'http';
  const host = request.headers.get('host');
  if (host) {
    return `${proto}://${host}`;
  }
  return config.publicAppUrl || 'http://localhost:3000';
}
