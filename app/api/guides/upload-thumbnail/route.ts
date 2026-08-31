import { withHandler } from '@/lib/api/with-handler';
import { jsonResponse } from '@/lib/api/response';
import { verifyAdmin } from '@/lib/api/verify-admin';
import { ApiError } from '@/lib/errors/api-error';
import { put } from '@vercel/blob';

const MAX_THUMBNAIL_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp']);

export const POST = withHandler(async (req) => {
  verifyAdmin(req);

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new ApiError(
      503,
      'BLOB_READ_WRITE_TOKEN is not configured. Set it in .env.local to enable uploads.'
    );
  }

  const formData = await req.formData();
  const file = formData.get('thumbnail');

  if (!file || !(file instanceof File)) {
    throw new ApiError(400, 'Thumbnail file is required (field name: thumbnail)');
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    throw new ApiError(400, 'Thumbnail must be PNG, JPEG, or WebP');
  }

  if (file.size > MAX_THUMBNAIL_SIZE) {
    throw new ApiError(400, 'Thumbnail must be 5MB or smaller');
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_') || 'thumbnail';
  const blob = await put(`guides/thumbnail/${Date.now()}-${safeName}`, file, {
    access: 'public',
    contentType: file.type,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  return jsonResponse({ success: true as const, data: { thumbnailUrl: blob.url } });
});
