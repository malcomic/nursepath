import { withHandler } from '@/lib/api/with-handler';
import { jsonResponse } from '@/lib/api/response';
import { initializePayment } from '@/lib/controllers/paystackController';

export const POST = withHandler(async (req) => {
  const body = await req.json();
  const ipAddress =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    undefined;
  return jsonResponse(await initializePayment(body, ipAddress));
});
