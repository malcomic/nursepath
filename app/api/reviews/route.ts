import { withHandler } from '@/lib/api/with-handler';
import { jsonResponse } from '@/lib/api/response';
import { getClientIp } from '@/lib/api/ip-rate-limit';
import { getApprovedReviews, createReview } from '@/lib/controllers/reviewController';

export const GET = withHandler(async () => {
  return jsonResponse(await getApprovedReviews());
});

export const POST = withHandler(async (req) => {
  const body = await req.json();
  const result = await createReview(body, getClientIp(req));
  return jsonResponse(result, 201);
});
