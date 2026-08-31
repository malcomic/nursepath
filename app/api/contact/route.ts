import { withHandler } from '@/lib/api/with-handler';
import { jsonResponse } from '@/lib/api/response';
import { submitContactForm } from '@/lib/controllers/contactController';

export const POST = withHandler(async (req) => {
  const body = await req.json();
  const ipAddress =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    undefined;
  return jsonResponse(await submitContactForm(body, ipAddress));
});
