import { PDFDocument } from 'pdf-lib';
import { withHandler } from '@/lib/api/with-handler';
import { jsonResponse } from '@/lib/api/response';
import { verifyAdmin } from '@/lib/api/verify-admin';
import { ApiError } from '@/lib/errors/api-error';
import { put } from '@vercel/blob';

const MAX_PDF_SIZE = 20 * 1024 * 1024;
const PREVIEW_PAGE_RATIO = 0.15;

async function buildPreviewPdf(sourceBytes: ArrayBuffer): Promise<Uint8Array | null> {
  try {
    const source = await PDFDocument.load(sourceBytes, { ignoreEncryption: true });
    const totalPages = source.getPageCount();
    if (totalPages < 1) return null;

    const previewPageCount = Math.max(1, Math.ceil(totalPages * PREVIEW_PAGE_RATIO));
    const pageIndexes = Array.from({ length: Math.min(previewPageCount, totalPages) }, (_, i) => i);

    const preview = await PDFDocument.create();
    const copiedPages = await preview.copyPages(source, pageIndexes);
    for (const page of copiedPages) {
      preview.addPage(page);
    }

    return preview.save();
  } catch (error) {
    console.error('Failed to generate preview PDF:', error);
    return null;
  }
}

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
  const timestamp = Date.now();
  const bytes = await file.arrayBuffer();

  const blob = await put(`guides/pdf/${timestamp}-${safeName}`, bytes, {
    access: 'public',
    contentType: file.type,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  let previewPdfUrl: string | null = null;
  const previewBytes = await buildPreviewPdf(bytes);
  if (previewBytes) {
    const previewBlob = await put(
      `guides/preview/${timestamp}-${safeName}`,
      Buffer.from(previewBytes),
      {
        access: 'public',
        contentType: 'application/pdf',
        token: process.env.BLOB_READ_WRITE_TOKEN,
      }
    );
    previewPdfUrl = previewBlob.url;
  }

  return jsonResponse({
    success: true as const,
    data: { pdfUrl: blob.url, previewPdfUrl },
  });
});
