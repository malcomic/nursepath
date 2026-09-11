import { withHandler } from '@/lib/api/with-handler';
import { jsonResponse } from '@/lib/api/response';
import { clearBuyerCookie } from '@/lib/auth/buyer-session';

export const POST = withHandler(async () => {
  const response = jsonResponse({ success: true as const });
  response.headers.set('Set-Cookie', clearBuyerCookie());
  return response;
});
