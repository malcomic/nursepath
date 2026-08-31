import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: 'NursePath refund policy — 30-day money-back guarantee on study guide purchases.',
};

export default function RefundPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-20">
      <h1 className="text-4xl font-black text-gray-900">Refund Policy</h1>
      <p className="mt-2 text-sm text-gray-500">Last updated: January 2026</p>

      <div className="mt-8 space-y-6 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">30-Day Money-Back Guarantee</h2>
          <p>
            We stand behind the quality of our study guides. If you are not satisfied with your
            purchase for any reason, contact us within 30 days of purchase for a full refund.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">How to Request a Refund</h2>
          <p>
            Email us at{' '}
            <a
              href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? 'support@nursepath.com'}`}
              className="text-primary-600 hover:text-primary-700"
            >
              {process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? 'support@nursepath.com'}
            </a>{' '}
            with your order details and reason for the refund. We aim to process refunds within 5–7
            business days.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Exceptions</h2>
          <p>
            Refunds may be declined if we detect abuse of the refund policy, such as repeated
            purchases and refund requests for the same content.
          </p>
        </section>
      </div>

      <p className="mt-8">
        <Link href="/" className="text-primary-600 font-semibold hover:text-primary-700">
          Return to home
        </Link>
      </p>
    </main>
  );
}
