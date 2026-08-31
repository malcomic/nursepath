import type { Metadata } from 'next';
import Link from 'next/link';
import LegalPageShell from '@/components/legal/LegalPageShell';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'NursePath privacy policy — how we collect, use, and protect your information.',
  openGraph: {
    title: 'Privacy Policy | NursePath',
    description: 'How NursePath collects, uses, and protects your information.',
    type: 'website',
  },
};

export default function PrivacyPage() {
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? 'support@nursepath.com';

  return (
    <LegalPageShell title="Privacy Policy">
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-3">Information We Collect</h2>
        <p>
          When you make a purchase or contact us, we may collect your name, email address, order
          details, and messages you send through our contact form. Payment card details are processed
          by Stripe — we do not store full credit card numbers on our servers.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-3">How We Use Your Information</h2>
        <p>
          We use your information to fulfill orders, send download links and purchase confirmations
          via email, respond to support inquiries, and improve our services. We do not sell your
          personal information to third parties.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-3">Payment Processing</h2>
        <p>
          Payments are handled securely by{' '}
          <a
            href="https://stripe.com/privacy"
            className="text-primary-600 hover:text-primary-700"
            target="_blank"
            rel="noopener noreferrer"
          >
            Stripe
          </a>
          . Stripe&apos;s privacy policy governs how payment data is collected and stored during
          checkout.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-3">Data Security</h2>
        <p>
          We implement industry-standard security measures to protect your data. Download links are
          time-limited and tied to your order to prevent unauthorized sharing.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-3">Your Rights</h2>
        <p>
          You may request access to or deletion of your personal data by contacting us. See our{' '}
          <Link href="/terms" className="text-primary-600 hover:text-primary-700">
            Terms of Service
          </Link>{' '}
          for additional information about use of the platform.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-3">Contact</h2>
        <p>
          For privacy-related questions, contact us at{' '}
          <a href={`mailto:${supportEmail}`} className="text-primary-600 hover:text-primary-700">
            {supportEmail}
          </a>
          .
        </p>
      </section>
    </LegalPageShell>
  );
}
