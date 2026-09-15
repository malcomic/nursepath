import { auth } from '@/lib/auth';
import { ApiError } from '@/lib/errors/api-error';

export type UserSession = {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
};

export async function getUserSession(): Promise<UserSession | null> {
  const session = await auth();
  const email = session?.user?.email?.trim().toLowerCase();
  const id = session?.user?.id;
  if (!session?.user || !email || !id) {
    return null;
  }
  return {
    id,
    email,
    name: session.user.name,
    image: session.user.image,
  };
}

export async function requireUserSession(): Promise<UserSession> {
  const session = await getUserSession();
  if (!session) {
    throw new ApiError(401, 'Sign in required.');
  }
  return session;
}
