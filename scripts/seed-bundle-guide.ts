/**
 * Ensures the Complete NCLEX-RN Prep Bundle guide exists for the homepage CTA.
 *
 * Usage:
 *   npx tsx scripts/seed-bundle-guide.ts
 *
 * Prerequisites:
 * - DATABASE_URL set
 * - At least one Category in the database
 * - After seeding, set a real pdfUrl / stripePriceId / thumbnailUrl in Admin → Guides
 */
import 'dotenv/config';
import { prisma } from '../lib/prisma';

const BUNDLE_SLUG = 'complete-nclex-rn-prep-bundle';

async function main() {
  const existing = await prisma.guide.findUnique({ where: { slug: BUNDLE_SLUG } });
  if (existing) {
    console.log(`Bundle guide already exists: ${existing.id} (${existing.slug})`);
    return;
  }

  const category = await prisma.category.findFirst({ orderBy: { createdAt: 'asc' } });
  if (!category) {
    throw new Error('No categories found. Create a category in admin first, then re-run this script.');
  }

  const guide = await prisma.guide.create({
    data: {
      title: 'The Complete NCLEX-RN Prep Bundle',
      slug: BUNDLE_SLUG,
      description:
        'Includes Ultimate NCLEX-RN Cram Sheets, Pharmacology Cards, Med-Surg cheat sheets, and 500+ practice questions compiled in one easy-to-use bundle.',
      price: 79,
      categoryId: category.id,
      // Placeholder — replace via Admin with a real Vercel Blob PDF URL
      pdfUrl: 'https://example.com/replace-with-real-bundle.pdf',
      thumbnailUrl: null,
      stripePriceId: null,
    },
  });

  console.log(`Created bundle guide: ${guide.id}`);
  console.log(`Public URL: /guides/${guide.slug}`);
  console.log('Next: open Admin → Guides, upload the PDF, set Stripe Price ID, and save.');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
