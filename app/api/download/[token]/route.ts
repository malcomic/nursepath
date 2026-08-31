import { NextResponse } from 'next/server';
import { withHandler } from '@/lib/api/with-handler';
import { processDownload } from '@/lib/controllers/downloadController';

export const GET = withHandler(async (_req, { params }) => {
  const { token } = await params;
  const pdfUrl = await processDownload(token);
  return NextResponse.redirect(pdfUrl);
});
