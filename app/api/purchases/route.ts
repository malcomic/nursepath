import { withHandler } from '@/lib/api/with-handler';
import { jsonResponse } from '@/lib/api/response';
import { verifyAdmin } from '@/lib/api/verify-admin';
import { getAllPurchases, createPurchase } from '@/lib/controllers/purchaseController';

export const GET = withHandler(async (req) => {
  verifyAdmin(req);
  return jsonResponse(await getAllPurchases());
});

export const POST = withHandler(async (req) => {
  verifyAdmin(req);
  const body = await req.json();
  const result = await createPurchase(body);
  return jsonResponse(result, 201);
});
