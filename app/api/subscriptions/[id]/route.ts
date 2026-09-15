import { withHandler } from '@/lib/api/with-handler';
import { jsonResponse } from '@/lib/api/response';
import { requireUserSession } from '@/lib/auth/verify-user';
import { subscriptionService } from '@/lib/services/subscriptionService';

export const GET = withHandler(async (_req, { params }) => {
  const session = await requireUserSession();
  const { id } = await params;
  const sub = await subscriptionService.getByIdForUser(id, session.id);
  return jsonResponse({
    success: true as const,
    data: {
      id: sub.id,
      status: sub.status,
      startsAt: sub.startsAt,
      endsAt: sub.endsAt,
      amountUsd: sub.amountUsd,
      plan: {
        code: sub.plan.code,
        name: sub.plan.name,
        durationDays: sub.plan.durationDays,
        priceUsd: sub.plan.priceUsd,
      },
    },
  });
});
