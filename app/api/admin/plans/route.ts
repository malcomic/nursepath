import { withHandler } from '@/lib/api/with-handler';
import { jsonResponse } from '@/lib/api/response';
import { verifyAdmin } from '@/lib/api/verify-admin';
import { planService } from '@/lib/services/planService';

export const GET = withHandler(async (req) => {
  verifyAdmin(req);
  const plans = await planService.listAll();
  return jsonResponse({ success: true, data: { items: plans } });
});
