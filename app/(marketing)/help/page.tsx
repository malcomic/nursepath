import type { Metadata } from 'next';
import Link from 'next/link';
import LegalPageShell from '@/components/legal/LegalPageShell';

export const metadata: Metadata = {
  title: 'Help Center',
  description: 'NursePath help center — FAQs and support for study guides, downloads, and purchases.',
  openGraph: {
    title: 'Help Center | NursePath',
    description: 'FAQs and support for study guides, downloads, and purchases.',
    type: 'website',
  },
};

const faqs = [
  {
    q: 'How do I download my purchased study guide?',
    a: (
      <>
        After purchase, you will receive a download link via email. You can also open{' '}
        <Link href="/dashboard" className="text-primary-600 hover:text-primary-700">
          My Purchases
        </Link>{' '}
        and request a one-time email sign-in link to view past orders and downloads.
      </>
    ),
  },
  {
    q: 'How do I sign in to My Purchases?',
    a: (
      <>
        Go to{' '}
        <Link href="/dashboard" className="text-primary-600 hover:text-primary-700">
          My Purchases
        </Link>
        , enter the email you used at checkout, and we will email you a magic link. Links expire
        in 30 minutes and can only be used once. After you sign in, your session lasts about 7 days.
      </>
    ),
  },
  {
    q: 'How long is my download link valid?',
    a: 'Download links are typically valid for 48 hours from purchase and may be used up to 3 times per order. Check your order confirmation email for the exact expiry time.',
  },
  {
    q: 'What format are the study guides?',
    a: 'All study guides are provided as PDF files optimized for desktop and mobile viewing.',
  },
  {
    q: 'Can I get a refund?',
    a: (
      <>
        Yes — we offer a 30-day money-back guarantee. See our{' '}
        <Link href="/refund" className="text-primary-600 hover:text-primary-700">
          Refund Policy
        </Link>{' '}
        for details.
      </>
    ),
  },
  {
    q: 'How do I contact support?',
    a: (
      <>
        Email us or use the contact form on our{' '}
        <Link href="/contact" className="text-primary-600 hover:text-primary-700">
          Contact
        </Link>{' '}
        page. We typically respond within 24 hours.
      </>
    ),
  },
];

export default function HelpPage() {
  return (
    <LegalPageShell title="Help Center">
      <p className="text-gray-600 leading-relaxed -mt-2 mb-2">
        Find answers to common questions below. Need more help?{' '}
        <Link href="/contact" className="text-primary-600 font-semibold hover:text-primary-700">
          Contact us
        </Link>
        .
      </p>

      <div className="space-y-6">
        {faqs.map((faq) => (
          <div key={faq.q} className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">{faq.q}</h2>
            <div className="text-gray-600 leading-relaxed">{faq.a}</div>
          </div>
        ))}
      </div>
    </LegalPageShell>
  );
}
