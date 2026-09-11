import { z } from 'zod';
import { withHandler } from '@/lib/api/with-handler';
import { jsonResponse } from '@/lib/api/response';
import { checkIpRateLimit, getClientIp } from '@/lib/api/ip-rate-limit';
import { buyerAuthService } from '@/lib/services/buyerAuthService';

const bodySchema = z.object({
  email: z.string().trim().email(),
});

export const POST = withHandler(async (req) => {
  const ip = getClientIp(req);
  if (ip) {
    checkIpRateLimit(ip, 5, 60 * 60 * 1000);
  }

  const body = bodySchema.parse(await req.json());
  const result = await buyerAuthService.requestMagicLink(body.email);
  return jsonResponse(result);
});
