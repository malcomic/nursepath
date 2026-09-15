import { NextRequest } from 'next/server';
import { withHandler } from '@/lib/api/with-handler';
import { jsonResponse } from '@/lib/api/response';
import { verifyAdmin } from '@/lib/api/verify-admin';
import {
  getAllContentDocuments,
  getAllContentDocumentsPublic,
  createContentDocument,
} from '@/lib/controllers/contentDocumentController';
import type { ContentType } from '@/lib/types';

function isAdminRequest(req: NextRequest): boolean {
  try {
    verifyAdmin(req);
    return true;
  } catch {
    return false;
  }
}

function parseFilters(req: NextRequest): {
  type?: ContentType;
  categoryId?: string;
} {
  const typeParam = req.nextUrl.searchParams.get('type');
  const categoryId = req.nextUrl.searchParams.get('categoryId') || undefined;
  const type =
    typeParam === 'STUDY_DOC' || typeParam === 'QA_DOC' ? typeParam : undefined;
  return { type, categoryId };
}

export const GET = withHandler(async (req) => {
  const filters = parseFilters(req);
  if (isAdminRequest(req)) {
    return jsonResponse(await getAllContentDocuments(filters));
  }
  return jsonResponse(await getAllContentDocumentsPublic(filters));
});

export const POST = withHandler(async (req) => {
  verifyAdmin(req);
  const body = await req.json();
  const result = await createContentDocument(body);
  return jsonResponse(result, 201);
});
