import type { Category, ContentDocument } from '@/lib/types';

export type ContentDocumentWithCategory = ContentDocument & {
  category?: Category | null;
};

/** Safe for unpaid / marketing surfaces (no full file URL). */
export type PublicContentDocumentWithCategory = Omit<ContentDocumentWithCategory, 'fileUrl'>;
