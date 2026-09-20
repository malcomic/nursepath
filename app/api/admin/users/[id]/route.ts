import { withHandler } from '@/lib/api/with-handler';
import { jsonResponse } from '@/lib/api/response';
import { verifyAdmin } from '@/lib/api/verify-admin';
import { userService } from '@/lib/services/userService';

export const GET = withHandler(async (req, { params }) => {
  verifyAdmin(req);
  const { id } = await params;
  const data = await userService.getByIdForAdmin(id);
  return jsonResponse({
    success: true,
    data,
  });
});
