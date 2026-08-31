import { withHandler } from '@/lib/api/with-handler';
import { jsonResponse } from '@/lib/api/response';
import { verifyAdmin } from '@/lib/api/verify-admin';
import { approveReview } from '@/lib/controllers/reviewController';

export const PATCH = withHandler(async (req, { params }) => {
  verifyAdmin(req);
  const { id } = await params;
  return jsonResponse(await approveReview(id));
});
