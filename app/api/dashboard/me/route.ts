import { withHandler } from '@/lib/api/with-handler';
import { jsonResponse } from '@/lib/api/response';
import { getUserSession } from '@/lib/auth/verify-user';

export const GET = withHandler(async () => {
  const session = await getUserSession();
  if (!session) {
    return jsonResponse({ success: true as const, data: null });
  }
  return jsonResponse({
    success: true as const,
    data: {
      id: session.id,
      email: session.email,
      name: session.name ?? null,
      image: session.image ?? null,
    },
  });
});
