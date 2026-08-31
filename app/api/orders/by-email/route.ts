import { withHandler } from '@/lib/api/with-handler';
import { jsonResponse } from '@/lib/api/response';
import { listOrdersByEmail } from '@/lib/controllers/publicOrderController';

export const GET = withHandler(async (req) => {
  const email = req.nextUrl.searchParams.get('email');
  return jsonResponse(await listOrdersByEmail(email));
});
