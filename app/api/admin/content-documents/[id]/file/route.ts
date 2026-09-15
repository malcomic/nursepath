import { withHandler } from '@/lib/api/with-handler';
import { verifyAdmin } from '@/lib/api/verify-admin';
import { contentDocumentService } from '@/lib/services/contentDocumentService';
import {
  fetchRemotePdf,
  pdfAttachmentResponse,
  pdfInlineResponse,
} from '@/lib/library/proxy-pdf';
import { ApiError } from '@/lib/errors/api-error';

export const GET = withHandler(async (req, { params }) => {
  verifyAdmin(req);
  const { id } = await params;
  const disposition =
    req.nextUrl.searchParams.get('disposition') === 'attachment'
      ? 'attachment'
      : 'inline';

  const doc = await contentDocumentService.getById(id);

  try {
    const { bytes, contentType } = await fetchRemotePdf(doc.fileUrl);
    const filename = `${doc.slug || doc.title}.pdf`;
    return disposition === 'attachment'
      ? pdfAttachmentResponse(bytes, filename, contentType)
      : pdfInlineResponse(bytes, filename, contentType);
  } catch {
    throw new ApiError(502, 'Unable to load document file.');
  }
});
