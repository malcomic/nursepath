/**
 * Re-upload public ContentDocument full PDFs into the private library Blob store.
 *
 * Prerequisites:
 * - DATABASE_URL
 * - BLOB_LIBRARY_READ_WRITE_TOKEN (private store)
 * - BLOB_READ_WRITE_TOKEN (optional; used to delete old public blobs)
 *
 * Usage:
 *   npx tsx scripts/migrate-library-pdfs-to-private.ts --dry-run
 *   npx tsx scripts/migrate-library-pdfs-to-private.ts
 */
import 'dotenv/config';
import { del } from '@vercel/blob';
import { prisma } from '../lib/prisma';
import {
  isPrivateBlobUrl,
  putLibraryPdf,
  toBlobPathname,
} from '../lib/blob/library-private';

const dryRun = process.argv.includes('--dry-run');

async function main() {
  if (!process.env.BLOB_LIBRARY_READ_WRITE_TOKEN) {
    throw new Error('BLOB_LIBRARY_READ_WRITE_TOKEN is required');
  }

  const docs = await prisma.contentDocument.findMany({
    where: { fileUrl: { not: '' } },
    select: { id: true, title: true, slug: true, fileUrl: true },
    orderBy: { createdAt: 'asc' },
  });

  const candidates = docs.filter((d) => !isPrivateBlobUrl(d.fileUrl));
  console.log(
    `Found ${docs.length} documents; ${candidates.length} need migration${dryRun ? ' (dry-run)' : ''}.`
  );

  let migrated = 0;
  let failed = 0;

  for (const doc of candidates) {
    const label = `${doc.id} (${doc.slug || doc.title})`;
    try {
      console.log(`→ ${label}`);
      console.log(`  from: ${doc.fileUrl}`);

      const res = await fetch(doc.fileUrl);
      if (!res.ok) {
        throw new Error(`fetch failed (${res.status})`);
      }
      const bytes = await res.arrayBuffer();
      const contentType = res.headers.get('content-type') || 'application/pdf';
      const baseName =
        toBlobPathname(doc.fileUrl).split('/').pop() ||
        `${doc.slug || doc.id}.pdf`;
      const pathname = `content/pdf/${Date.now()}-${baseName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

      if (dryRun) {
        console.log(`  would put → ${pathname} (${bytes.byteLength} bytes)`);
        migrated += 1;
        continue;
      }

      const blob = await putLibraryPdf(pathname, Buffer.from(bytes), contentType);
      await prisma.contentDocument.update({
        where: { id: doc.id },
        data: { fileUrl: blob.url },
      });
      console.log(`  to:   ${blob.url}`);

      if (process.env.BLOB_READ_WRITE_TOKEN) {
        try {
          await del(doc.fileUrl, { token: process.env.BLOB_READ_WRITE_TOKEN });
          console.log('  deleted old public blob');
        } catch (err) {
          console.warn('  could not delete old public blob:', err);
        }
      }

      migrated += 1;
    } catch (err) {
      failed += 1;
      console.error(`  FAILED ${label}:`, err);
    }
  }

  console.log(`Done. migrated=${migrated} failed=${failed}`);
  if (failed > 0) {
    process.exitCode = 1;
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
