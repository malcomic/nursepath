import type { Metadata } from 'next';
import { Suspense } from 'react';
import PaymentSuccessClient from '@/components/checkout/PaymentSuccessClient';

export const metadata: Metadata = {
  title: 'Payment Successful',
  description: 'Your NursePath purchase was successful. Access your study guide download.',
  robots: { index: false, follow: false },
};

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="flex-grow bg-soft py-20">
          <div className="mx-auto max-w-3xl px-4 text-center text-navy-400">Loading…</div>
        </main>
      }
    >
      <PaymentSuccessClient />
    </Suspense>
  );
}
