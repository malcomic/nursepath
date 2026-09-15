import { get, put } from '@vercel/blob';
import { ApiError } from '@/lib/errors/api-error';

export function getLibraryPrivateToken(): string {
  const token = process.env.BLOB_LIBRARY_READ_WRITE_TOKEN;
  if (!token) {
    throw new ApiError(
      503,
      'BLOB_LIBRARY_READ_WRITE_TOKEN is not configured. Create a Private Blob store and set the token.'
    );
  }
  return token;
}

/** True for private Vercel Blob URLs (or raw content/pdf pathnames). */
export function isPrivateBlobUrl(urlOrPathname: string): boolean {
  const value = urlOrPathname.trim();
  if (!value) return false;
  if (value.startsWith('content/pdf/')) return true;
  try {
    const host = new URL(value).hostname;
    return host.includes('.private.blob.vercel-storage.com');
  } catch {
    return false;
  }
}

/** Extract blob pathname from a full URL or return pathname as-is. */
export function toBlobPathname(urlOrPathname: string): string {
  const value = urlOrPathname.trim();
  if (!value.includes('://')) {
    return value.replace(/^\//, '');
  }
  const url = new URL(value);
  return decodeURIComponent(url.pathname.replace(/^\//, ''));
}

export async function putLibraryPdf(
  pathname: string,
  bytes: ArrayBuffer | Buffer | Uint8Array,
  contentType = 'application/pdf'
) {
  const token = getLibraryPrivateToken();
  let body: Buffer;
  if (Buffer.isBuffer(bytes)) {
    body = bytes;
  } else if (bytes instanceof ArrayBuffer) {
    body = Buffer.from(new Uint8Array(bytes));
  } else {
    body = Buffer.from(bytes);
  }
  return put(pathname, body, {
    access: 'private',
    contentType,
    token,
  });
}

export async function getLibraryPdfBytes(fileUrlOrPathname: string): Promise<{
  bytes: ArrayBuffer;
  contentType: string;
}> {
  const token = getLibraryPrivateToken();
  const pathname = toBlobPathname(fileUrlOrPathname);
  const result = await get(pathname, { access: 'private', token });

  if (!result || result.statusCode !== 200 || !result.stream) {
    throw new Error(`Private blob not found: ${pathname}`);
  }

  const bytes = await new Response(result.stream).arrayBuffer();
  const contentType = result.blob.contentType || 'application/pdf';
  return { bytes, contentType };
}
