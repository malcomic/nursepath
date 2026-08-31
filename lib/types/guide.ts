import type { Category, Guide } from '@/lib/types';

export type GuideWithCategory = Guide & { category?: Category | null };

export type { Category as GuideCategory };
