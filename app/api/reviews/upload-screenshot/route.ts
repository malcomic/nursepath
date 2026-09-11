import { withHandler } from '@/lib/api/with-handler';
import { jsonResponse } from '@/lib/api/response';
import { checkIpRateLimit, getClientIp } from '@/lib/api/ip-rate-limit';
import { ApiError } from '@/lib/errors/api-error';
import { put } from '@vercel/blob';

const MAX_SCREENSHOT_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp']);

export const POST = withHandler(async (req) => {
  const ip = getClientIp(req);
  if (ip) {
    checkIpRateLimit(ip);
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new ApiError(
      503,
      'BLOB_READ_WRITE_TOKEN is not configured. Set it in .env.local to enable uploads.'
    );
  }

  const formData = await req.formData();
  const file = formData.get('screenshot');

  if (!file || !(file instanceof File)) {
    throw new ApiError(400, 'Screenshot file is required (field name: screenshot)');
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    throw new ApiError(400, 'Screenshot must be PNG, JPEG, or WebP');
  }

  if (file.size > MAX_SCREENSHOT_SIZE) {
    throw new ApiError(400, 'Screenshot must be 5MB or smaller');
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_') || 'screenshot';
  const blob = await put(`reviews/screenshots/${Date.now()}-${safeName}`, file, {
    access: 'public',
    contentType: file.type,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  return jsonResponse({ success: true as const, data: { screenshotUrl: blob.url } });
});
