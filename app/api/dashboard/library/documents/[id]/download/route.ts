import { withHandler } from '@/lib/api/with-handler';
import { requireUserSession } from '@/lib/auth/verify-user';
import { libraryService } from '@/lib/services/libraryService';
import { fetchRemotePdf, pdfAttachmentResponse } from '@/lib/library/proxy-pdf';
import { ApiError } from '@/lib/errors/api-error';

export const GET = withHandler(async (_req, { params }) => {
  const session = await requireUserSession();
  const { id } = await params;
  const { doc } = await libraryService.authorizeDownload(session.id, id);

  try {
    const { bytes, contentType } = await fetchRemotePdf(doc.fileUrl);
    return pdfAttachmentResponse(bytes, `${doc.slug || doc.title}.pdf`, contentType);
  } catch {
    throw new ApiError(502, 'Unable to download document.');
  }
});
