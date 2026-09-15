import { withHandler } from '@/lib/api/with-handler';
import { jsonResponse } from '@/lib/api/response';
import { requireUserSession } from '@/lib/auth/verify-user';
import { initializeLibrarySubscription } from '@/lib/controllers/subscriptionPaystackController';

export const POST = withHandler(async (req) => {
  const session = await requireUserSession();
  const body = await req.json();
  const result = await initializeLibrarySubscription(body, {
    id: session.id,
    email: session.email,
    name: session.name,
  });
  return jsonResponse(result);
});
