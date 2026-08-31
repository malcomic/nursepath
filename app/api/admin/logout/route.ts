import { withHandler } from '@/lib/api/with-handler';
import { jsonResponse } from '@/lib/api/response';
import { clearAdminCookie } from '@/lib/auth/admin-cookie';

export const POST = withHandler(async () => {
  const response = jsonResponse({ success: true as const });
  response.headers.set('Set-Cookie', clearAdminCookie());
  return response;
});
