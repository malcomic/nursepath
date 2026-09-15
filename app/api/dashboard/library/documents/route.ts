import { withHandler } from '@/lib/api/with-handler';
import { jsonResponse } from '@/lib/api/response';
import { requireUserSession } from '@/lib/auth/verify-user';
import { libraryService } from '@/lib/services/libraryService';
import type { ContentType } from '@/lib/types';

export const GET = withHandler(async (req) => {
  const session = await requireUserSession();
  const typeParam = req.nextUrl.searchParams.get('type');
  const type =
    typeParam === 'STUDY_DOC' || typeParam === 'QA_DOC' ? (typeParam as ContentType) : undefined;

  const data = await libraryService.listDocuments(session.id, { type });
  return jsonResponse({ success: true as const, data });
});
