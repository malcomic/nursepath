import { withHandler } from '@/lib/api/with-handler';
import { jsonResponse } from '@/lib/api/response';
import { verifyAdmin } from '@/lib/api/verify-admin';
import { getAllReviewsAdmin } from '@/lib/controllers/reviewController';

export const GET = withHandler(async (req) => {
  verifyAdmin(req);
  return jsonResponse(await getAllReviewsAdmin());
});
