import type { Metadata } from 'next';
import Link from 'next/link';
import LegalPageShell from '@/components/legal/LegalPageShell';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'NursePath terms of service — rules and guidelines for using our platform and study guides.',
  openGraph: {
    title: 'Terms of Service | NursePath',
    description: 'Rules and guidelines for using NursePath and our digital study guides.',
    type: 'website',
  },
};

export default function TermsPage() {
  return (
    <LegalPageShell title="Terms of Service">
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-3">Acceptance of Terms</h2>
        <p>
          By accessing or using NursePath, you agree to be bound by these Terms of Service and our{' '}
          <Link href="/privacy" className="text-primary-600 hover:text-primary-700">
            Privacy Policy
          </Link>
          . If you do not agree, please do not use our services.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-3">Study Guide License</h2>
        <p>
          Purchased study guides are licensed for personal, non-commercial use only. You may not
          share, redistribute, or resell any materials. Each purchase is licensed to a single user.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-3">Payments and Refunds</h2>
        <p>
          All prices are listed in USD. Payments are processed by Stripe. We offer a 30-day
          money-back guarantee on eligible purchases. See our{' '}
          <Link href="/refund" className="text-primary-600 hover:text-primary-700">
            Refund Policy
          </Link>{' '}
          for details.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-3">Limitation of Liability</h2>
        <p>
          NursePath study guides are educational resources and do not guarantee exam results. We are
          not liable for any outcomes related to your use of our materials.
        </p>
      </section>
    </LegalPageShell>
  );
}
