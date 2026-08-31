import { withHandler } from '@/lib/api/with-handler';
import { jsonResponse } from '@/lib/api/response';
import { loginAdmin } from '@/lib/controllers/adminController';
import { buildAdminCookie } from '@/lib/auth/admin-cookie';

export const POST = withHandler(async (req) => {
  const body = await req.json();
  const result = await loginAdmin(body);
  const response = jsonResponse(result);
  response.headers.set('Set-Cookie', buildAdminCookie(result.data.token));
  return response;
});
