import { withHandler } from '@/lib/api/with-handler';
import { jsonResponse } from '@/lib/api/response';
import { searchGuides } from '@/lib/controllers/guideController';

export const GET = withHandler(async (req) => {
  const q = req.nextUrl.searchParams.get('q');
  return jsonResponse(await searchGuides(q));
});
