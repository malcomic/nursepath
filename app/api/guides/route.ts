import { withHandler } from '@/lib/api/with-handler';
import { jsonResponse } from '@/lib/api/response';
import { verifyAdmin } from '@/lib/api/verify-admin';
import { getAllGuides, createGuide } from '@/lib/controllers/guideController';

export const GET = withHandler(async () => {
  return jsonResponse(await getAllGuides());
});

export const POST = withHandler(async (req) => {
  verifyAdmin(req);
  const body = await req.json();
  const result = await createGuide(body);
  return jsonResponse(result, 201);
});
