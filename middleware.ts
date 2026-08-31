import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { ADMIN_TOKEN_COOKIE } from '@/lib/auth/admin-cookie';

const jwtSecret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

async function isValidAdminToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, jwtSecret);
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(ADMIN_TOKEN_COOKIE)?.value;
  const hasValidToken = token ? await isValidAdminToken(token) : false;

  if (pathname === '/admin/login') {
    if (hasValidToken) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    return NextResponse.next();
  }

  if (!hasValidToken) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
