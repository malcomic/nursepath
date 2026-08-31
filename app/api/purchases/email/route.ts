import { withHandler } from '@/lib/api/with-handler';
import { jsonResponse } from '@/lib/api/response';
import { verifyAdmin } from '@/lib/api/verify-admin';
import { getPurchasesByEmail } from '@/lib/controllers/purchaseController';

export const GET = withHandler(async (req) => {
  verifyAdmin(req);
  const email = req.nextUrl.searchParams.get('email');
  return jsonResponse(await getPurchasesByEmail(email));
});
