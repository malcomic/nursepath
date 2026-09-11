import { withHandler } from '@/lib/api/with-handler';
import { jsonResponse } from '@/lib/api/response';
import { requireBuyerSession } from '@/lib/auth/verify-buyer';
import { buyerAuthService } from '@/lib/services/buyerAuthService';

export const GET = withHandler(async (req) => {
  const session = requireBuyerSession(req);
  const data = await buyerAuthService.listSessionOrders(session.email);
  return jsonResponse({ success: true as const, data });
});
