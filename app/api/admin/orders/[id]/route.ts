import { withHandler } from '@/lib/api/with-handler';
import { jsonResponse } from '@/lib/api/response';
import { verifyAdmin } from '@/lib/api/verify-admin';
import { getOrderById, deleteOrder } from '@/lib/controllers/orderController';

export const GET = withHandler(async (req, { params }) => {
  verifyAdmin(req);
  const { id } = await params;
  return jsonResponse(await getOrderById(id));
});

export const DELETE = withHandler(async (req, { params }) => {
  verifyAdmin(req);
  const { id } = await params;
  return jsonResponse(await deleteOrder(id));
});
