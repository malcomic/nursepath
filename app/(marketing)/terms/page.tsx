import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'NursePath terms of service — rules and guidelines for using our platform and study guides.',
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-20">
      <h1 className="text-4xl font-black text-gray-900">Terms of Service</h1>
      <p className="mt-2 text-sm text-gray-500">Last updated: January 2026</p>

      <div className="mt-8 space-y-6 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Acceptance of Terms</h2>
          <p>
            By accessing or using NursePath, you agree to be bound by these Terms of Service. If
            you do not agree, please do not use our services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Study Guide License</h2>
          <p>
            Purchased study guides are licensed for personal, non-commercial use only. You may not
            share, redistribute, or resell any materials. Each purchase is licensed to a single
            user.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Payments and Refunds</h2>
          <p>
            All prices are listed in USD. We offer a 30-day money-back guarantee on eligible
            purchases. See our{' '}
            <Link href="/refund" className="text-primary-600 hover:text-primary-700">
              Refund Policy
            </Link>{' '}
            for details.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Limitation of Liability</h2>
          <p>
            NursePath study guides are educational resources and do not guarantee exam results. We
            are not liable for any outcomes related to your use of our materials.
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
