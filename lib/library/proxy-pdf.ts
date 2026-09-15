import { NextResponse } from 'next/server';
import { getLibraryPdfBytes, isPrivateBlobUrl } from '@/lib/blob/library-private';

/**
 * Fetch a PDF for proxying: private library blobs via SDK get(), else public URL fetch.
 */
export async function fetchRemotePdf(fileUrl: string): Promise<{
  bytes: ArrayBuffer;
  contentType: string;
}> {
  if (isPrivateBlobUrl(fileUrl)) {
    return getLibraryPdfBytes(fileUrl);
  }

  const res = await fetch(fileUrl);
  if (!res.ok) {
    throw new Error(`Failed to fetch PDF (${res.status})`);
  }
  const bytes = await res.arrayBuffer();
  const contentType = res.headers.get('content-type') || 'application/pdf';
  return { bytes, contentType };
}

export function pdfInlineResponse(bytes: ArrayBuffer, filename: string, contentType: string) {
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_') || 'document.pdf';
  const downloadName = safeName.toLowerCase().endsWith('.pdf') ? safeName : `${safeName}.pdf`;
  return new NextResponse(bytes, {
    status: 200,
    headers: {
      'Content-Type': contentType.includes('pdf') ? 'application/pdf' : contentType,
      'Content-Disposition': `inline; filename="${downloadName}"`,
      'Cache-Control': 'private, no-store',
    },
  });
}

export function pdfAttachmentResponse(
  bytes: ArrayBuffer,
  filename: string,
  contentType: string
) {
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_') || 'document.pdf';
  const downloadName = safeName.toLowerCase().endsWith('.pdf') ? safeName : `${safeName}.pdf`;
  return new NextResponse(bytes, {
    status: 200,
    headers: {
      'Content-Type': contentType.includes('pdf') ? 'application/pdf' : contentType,
      'Content-Disposition': `attachment; filename="${downloadName}"`,
      'Cache-Control': 'private, no-store',
    },
  });
}
