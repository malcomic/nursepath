import type { Metadata } from 'next';
import { Suspense } from 'react';
import LibrarySuccessClient from '@/components/checkout/LibrarySuccessClient';

export const metadata: Metadata = {
  title: 'Library payment',
  description: 'Confirming your NursePath library access payment.',
};

export default function LibrarySuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="flex-grow bg-soft py-20 text-center text-navy-400">
          Loading…
        </main>
      }
    >
      <LibrarySuccessClient />
    </Suspense>
  );
}
