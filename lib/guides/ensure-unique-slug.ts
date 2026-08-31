import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/slugify';

/**
 * Returns a unique guide slug based on `base` (usually slugify(title)).
 * Appends -2, -3, ... on collision. Pass excludeId when updating an existing guide.
 */
export async function ensureUniqueGuideSlug(
  base: string,
  excludeId?: string
): Promise<string> {
  const candidate = slugify(base) || 'guide';
  let suffix = 0;

  for (;;) {
    const slug = suffix === 0 ? candidate : `${candidate}-${suffix + 1}`;
    const existing = await prisma.guide.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!existing || (excludeId && existing.id === excludeId)) {
      return slug;
    }
    suffix += 1;
    if (suffix > 1000) {
      return `${candidate}-${Date.now()}`;
    }
  }
}
