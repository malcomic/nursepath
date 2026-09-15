import { withHandler } from '@/lib/api/with-handler';
import { jsonResponse } from '@/lib/api/response';
import { requireUserSession } from '@/lib/auth/verify-user';
import { subscriptionService } from '@/lib/services/subscriptionService';

export const GET = withHandler(async () => {
  const session = await requireUserSession();
  const summary = await subscriptionService.getAccessSummary(session.id);
  return jsonResponse({
    success: true as const,
    data: {
      hasAccess: summary.access.hasAccess,
      endsAt: summary.access.endsAt,
      planName: summary.access.planName,
      planCode: summary.access.planCode,
      recent: summary.recent.map((s) => ({
        id: s.id,
        status: s.status,
        startsAt: s.startsAt,
        endsAt: s.endsAt,
        amountUsd: s.amountUsd,
        createdAt: s.createdAt,
        plan: {
          code: s.plan.code,
          name: s.plan.name,
          durationDays: s.plan.durationDays,
        },
      })),
    },
  });
});
