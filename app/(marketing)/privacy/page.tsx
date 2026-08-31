import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'NursePath privacy policy — how we collect, use, and protect your information.',
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-20">
      <h1 className="text-4xl font-black text-gray-900">Privacy Policy</h1>
      <p className="mt-2 text-sm text-gray-500">Last updated: January 2026</p>

      <div className="mt-8 space-y-6 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Information We Collect</h2>
          <p>
            When you create an account, make a purchase, or contact us, we may collect your name,
            email address, payment information, and usage data. We use this information to process
            orders, provide customer support, and improve our services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">How We Use Your Information</h2>
          <p>
            We use your information to fulfill orders, send purchase confirmations, respond to
            inquiries, and send relevant updates about our study guides. We do not sell your
            personal information to third parties.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your data. Payment
            processing is handled by Stripe and we do not store full credit card numbers on our
            servers.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Contact</h2>
          <p>
            For privacy-related questions, contact us at{' '}
            <a
              href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? 'support@nursepath.com'}`}
              className="text-primary-600 hover:text-primary-700"
            >
              {process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? 'support@nursepath.com'}
            </a>
            .
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
