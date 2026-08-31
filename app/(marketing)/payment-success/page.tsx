import type { Metadata } from 'next';
import { Suspense } from 'react';
import PaymentSuccessClient from '@/components/checkout/PaymentSuccessClient';

export const metadata: Metadata = {
  title: 'Payment Successful',
  description: 'Your NursePath purchase was successful. Access your study guide download.',
};

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="bg-gray-50 flex-grow py-20">
          <div className="max-w-3xl mx-auto px-4 text-center text-gray-600">Loading…</div>
        </main>
      }
    >
      <PaymentSuccessClient />
    </Suspense>
  );
}
