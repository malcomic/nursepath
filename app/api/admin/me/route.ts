import { withHandler } from '@/lib/api/with-handler';
import { jsonResponse } from '@/lib/api/response';
import { verifyAdmin } from '@/lib/api/verify-admin';
import { getAdminMe } from '@/lib/controllers/adminController';

export const GET = withHandler(async (req) => {
  const admin = verifyAdmin(req);
  return jsonResponse(await getAdminMe(admin.id));
});
