import { withHandler } from '@/lib/api/with-handler';
import { jsonResponse } from '@/lib/api/response';
import { verifyAdmin } from '@/lib/api/verify-admin';
import { subscriptionService } from '@/lib/services/subscriptionService';
import { SubscriptionStatus } from '@/lib/generated/prisma/enums';

export const GET = withHandler(async (req) => {
  verifyAdmin(req);
  const statusParam = req.nextUrl.searchParams.get('status');
  const status =
    statusParam && Object.values(SubscriptionStatus).includes(statusParam as SubscriptionStatus)
      ? (statusParam as SubscriptionStatus)
      : undefined;
  const items = await subscriptionService.listForAdmin(status);
  return jsonResponse({
    success: true,
    data: {
      items: items.map((s) => ({
        id: s.id,
        status: s.status,
        startsAt: s.startsAt,
        endsAt: s.endsAt,
        amountUsd: s.amountUsd,
        createdAt: s.createdAt,
        paymentReference: s.paymentReference,
        user: s.user,
        plan: { id: s.plan.id, name: s.plan.name, code: s.plan.code },
      })),
    },
  });
});
