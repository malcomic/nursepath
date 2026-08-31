import { withHandler } from '@/lib/api/with-handler';
import { jsonResponse } from '@/lib/api/response';
import { handleStripeWebhook } from '@/lib/controllers/stripeController';

export const runtime = 'nodejs';

export const POST = withHandler(async (req) => {
  const rawBody = await req.text();
  const signature = req.headers.get('stripe-signature');
  const result = await handleStripeWebhook(rawBody, signature);
  return jsonResponse(result);
});
