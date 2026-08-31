import { withHandler } from '@/lib/api/with-handler';
import { jsonResponse } from '@/lib/api/response';
import { getApprovedReviews, createReview } from '@/lib/controllers/reviewController';

export const GET = withHandler(async () => {
  return jsonResponse(await getApprovedReviews());
});

export const POST = withHandler(async (req) => {
  const body = await req.json();
  const ipAddress =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    undefined;
  const result = await createReview(body, ipAddress);
  return jsonResponse(result, 201);
});
