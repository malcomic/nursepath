import { withHandler } from '@/lib/api/with-handler';
import { jsonResponse } from '@/lib/api/response';
import { requireUserSession } from '@/lib/auth/verify-user';
import { buyerAuthService } from '@/lib/services/buyerAuthService';

export const GET = withHandler(async () => {
  const session = await requireUserSession();
  const data = await buyerAuthService.listSessionOrders(session.email, session.id);
  return jsonResponse({ success: true as const, data });
});
