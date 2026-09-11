import type { Category, Guide } from '@/lib/types';

export type GuideWithCategory = Guide & { category?: Category | null };

/** Guide payload safe for unpaid / marketing surfaces (no full PDF URL). */
export type PublicGuideWithCategory = Omit<GuideWithCategory, 'pdfUrl'>;

export type { Category as GuideCategory };
