import { withHandler } from '@/lib/api/with-handler';
import { jsonResponse } from '@/lib/api/response';
import { getBuyerSession } from '@/lib/auth/verify-buyer';

export const GET = withHandler(async (req) => {
  const session = getBuyerSession(req);
  if (!session) {
    return jsonResponse({ success: true as const, data: { email: null } });
  }
  return jsonResponse({ success: true as const, data: { email: session.email } });
});
