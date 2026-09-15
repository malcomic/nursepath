import { NextRequest } from 'next/server';
import { withHandler } from '@/lib/api/with-handler';
import { jsonResponse } from '@/lib/api/response';
import { verifyAdmin } from '@/lib/api/verify-admin';
import {
  getContentDocumentById,
  getContentDocumentByIdPublic,
  updateContentDocument,
  deleteContentDocument,
} from '@/lib/controllers/contentDocumentController';

function isAdminRequest(req: NextRequest): boolean {
  try {
    verifyAdmin(req);
    return true;
  } catch {
    return false;
  }
}

export const GET = withHandler(async (req, { params }) => {
  const { id } = await params;
  if (isAdminRequest(req)) {
    return jsonResponse(await getContentDocumentById(id));
  }
  return jsonResponse(await getContentDocumentByIdPublic(id));
});

export const PUT = withHandler(async (req, { params }) => {
  verifyAdmin(req);
  const { id } = await params;
  const body = await req.json();
  return jsonResponse(await updateContentDocument(id, body));
});

export const DELETE = withHandler(async (req, { params }) => {
  verifyAdmin(req);
  const { id } = await params;
  return jsonResponse(await deleteContentDocument(id));
});
