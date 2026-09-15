import { withHandler } from '@/lib/api/with-handler';
import { jsonResponse } from '@/lib/api/response';
import { requireUserSession } from '@/lib/auth/verify-user';
import { listOrdersByEmail } from '@/lib/controllers/publicOrderController';
import { ApiError } from '@/lib/errors/api-error';

/** @deprecated Prefer GET /api/dashboard/orders. Requires Auth.js session matching email. */
export const GET = withHandler(async (req) => {
  const session = await requireUserSession();
  const email = req.nextUrl.searchParams.get('email');
  if (!email || email.trim().toLowerCase() !== session.email) {
    throw new ApiError(403, 'Email does not match your session');
  }
  return jsonResponse(await listOrdersByEmail(email));
});
