import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';

/**
 * Edge-safe Auth.js config (no Prisma). Used by middleware.
 * Credentials provider lives in lib/auth.ts (Node runtime).
 */
export const authConfig = {
  providers: [
    Google({
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isLoggedIn = !!auth?.user;

      if (pathname.startsWith('/dashboard')) {
        return isLoggedIn;
      }

      if (
        pathname.startsWith('/checkout/library') ||
        pathname.startsWith('/library-success')
      ) {
        return isLoggedIn;
      }

      if (pathname === '/login' || pathname === '/register') {
        if (isLoggedIn) {
          return Response.redirect(new URL('/dashboard', request.nextUrl));
        }
        return true;
      }

      return true;
    },
    jwt({ token, user }) {
      if (user?.id) {
        token.id = String(user.id);
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        const id =
          typeof token.id === 'string'
            ? token.id
            : typeof token.sub === 'string'
              ? token.sub
              : '';
        session.user.id = id;
      }
      return session;
    },
  },
  trustHost: true,
} satisfies NextAuthConfig;
