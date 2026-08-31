import { withHandler } from '@/lib/api/with-handler';
import { jsonResponse } from '@/lib/api/response';
import { verifyAdmin } from '@/lib/api/verify-admin';
import { listOrders } from '@/lib/controllers/orderController';

export const GET = withHandler(async (req) => {
  verifyAdmin(req);
  const { searchParams } = req.nextUrl;
  return jsonResponse(
    await listOrders(req, {
      page: searchParams.get('page'),
      search: searchParams.get('search'),
      status: searchParams.get('status'),
      dateFrom: searchParams.get('dateFrom'),
      dateTo: searchParams.get('dateTo'),
      sort: searchParams.get('sort'),
    })
  );
});
