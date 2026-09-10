import { withHandler } from '@/lib/api/with-handler';
import { jsonResponse } from '@/lib/api/response';
import { handlePaystackWebhook } from '@/lib/controllers/paystackController';

export const runtime = 'nodejs';

export const POST = withHandler(async (req) => {
  const rawBody = await req.text();
  const signature = req.headers.get('x-paystack-signature');
  const result = await handlePaystackWebhook(rawBody, signature);
  return jsonResponse(result);
});
