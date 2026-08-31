import { withHandler } from '@/lib/api/with-handler';
import { jsonResponse } from '@/lib/api/response';
import { verifyAdmin } from '@/lib/api/verify-admin';
import { ApiError } from '@/lib/errors/api-error';
import { put } from '@vercel/blob';

const MAX_PDF_SIZE = 20 * 1024 * 1024;

export const POST = withHandler(async (req) => {
  verifyAdmin(req);

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new ApiError(
      503,
      'BLOB_READ_WRITE_TOKEN is not configured. Set it in .env.local to enable uploads.'
    );
  }

  const formData = await req.formData();
  const file = formData.get('pdf');

  if (!file || !(file instanceof File)) {
    throw new ApiError(400, 'PDF file is required (field name: pdf)');
  }

  if (file.type !== 'application/pdf') {
    throw new ApiError(400, 'File must be a PDF (application/pdf)');
  }

  if (file.size > MAX_PDF_SIZE) {
    throw new ApiError(400, 'PDF must be 20MB or smaller');
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_') || 'guide.pdf';
  const blob = await put(`guides/pdf/${Date.now()}-${safeName}`, file, {
    access: 'public',
    contentType: file.type,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  return jsonResponse({ success: true as const, data: { pdfUrl: blob.url } });
});
