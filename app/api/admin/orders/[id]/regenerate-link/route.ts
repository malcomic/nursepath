import { withHandler } from '@/lib/api/with-handler';
import { jsonResponse } from '@/lib/api/response';
import { verifyAdmin } from '@/lib/api/verify-admin';
import { regenerateOrderLink } from '@/lib/controllers/orderController';

export const POST = withHandler(async (req, { params }) => {
  verifyAdmin(req);
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  return jsonResponse(await regenerateOrderLink(req, id, body));
});
