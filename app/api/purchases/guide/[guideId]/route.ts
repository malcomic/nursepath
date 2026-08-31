import { withHandler } from '@/lib/api/with-handler';
import { jsonResponse } from '@/lib/api/response';
import { verifyAdmin } from '@/lib/api/verify-admin';
import { getPurchasesByGuide } from '@/lib/controllers/purchaseController';

export const GET = withHandler(async (req, { params }) => {
  verifyAdmin(req);
  const { guideId } = await params;
  return jsonResponse(await getPurchasesByGuide(guideId));
});
