import { withHandler } from '@/lib/api/with-handler';
import { jsonResponse } from '@/lib/api/response';
import { verifyAdmin } from '@/lib/api/verify-admin';
import { userService } from '@/lib/services/userService';

export const GET = withHandler(async (req) => {
  verifyAdmin(req);
  const pageParam = req.nextUrl.searchParams.get('page');
  const search = req.nextUrl.searchParams.get('search') ?? undefined;
  const page = pageParam ? Number.parseInt(pageParam, 10) : 1;
  const result = await userService.listForAdmin({
    page: Number.isFinite(page) && page > 0 ? page : 1,
    search,
    limit: 20,
  });
  return jsonResponse({
    success: true,
    data: result,
  });
});
