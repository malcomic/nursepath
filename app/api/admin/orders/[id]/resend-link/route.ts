import { withHandler } from '@/lib/api/with-handler';
import { jsonResponse } from '@/lib/api/response';
import { verifyAdmin } from '@/lib/api/verify-admin';
import { resendOrderLink } from '@/lib/controllers/orderController';

export const POST = withHandler(async (req, { params }) => {
  verifyAdmin(req);
  const { id } = await params;
  return jsonResponse(await resendOrderLink(req, id));
});
