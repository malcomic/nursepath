import { z } from 'zod';
import { withHandler } from '@/lib/api/with-handler';
import { jsonResponse } from '@/lib/api/response';
import { verifyAdmin } from '@/lib/api/verify-admin';
import { planService } from '@/lib/services/planService';

const updatePlanSchema = z.object({
  priceUsd: z.number().min(0).optional(),
  isActive: z.boolean().optional(),
  description: z.string().trim().max(2000).nullable().optional(),
});

export const PUT = withHandler(async (req, ctx) => {
  verifyAdmin(req);
  const { id } = await ctx.params;
  const body = updatePlanSchema.parse(await req.json());
  const plan = await planService.updatePlan(id, body);
  return jsonResponse({ success: true, data: plan });
});
