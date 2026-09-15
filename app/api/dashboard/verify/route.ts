import { NextResponse } from 'next/server';
import { config } from '@/lib/config/env';

/** @deprecated Magic-link sign-in is retired. Redirect to login. */
export async function GET() {
  const baseUrl = config.publicAppUrl || 'http://localhost:3000';
  return NextResponse.redirect(new URL('/login', baseUrl));
}
