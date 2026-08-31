import { withHandler } from '@/lib/api/with-handler';
import { jsonResponse } from '@/lib/api/response';
import { getOrderStatus } from '@/lib/controllers/publicOrderController';

export const GET = withHandler(async (_req, { params }) => {
  const { id } = await params;
  return jsonResponse(await getOrderStatus(id));
});
