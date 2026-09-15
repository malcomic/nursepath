import { withHandler } from '@/lib/api/with-handler';
import { jsonResponse } from '@/lib/api/response';
import { planService } from '@/lib/services/planService';

export const GET = withHandler(async () => {
  const plans = await planService.listActive();
  return jsonResponse({ success: true as const, data: plans });
});
