import { withHandler } from '@/lib/api/with-handler';
import { jsonResponse } from '@/lib/api/response';
import { getGuidesByCategory } from '@/lib/controllers/guideController';

export const GET = withHandler(async (_req, { params }) => {
  const { categoryId } = await params;
  return jsonResponse(await getGuidesByCategory(categoryId));
});
