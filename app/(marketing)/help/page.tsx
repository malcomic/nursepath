import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Help Center',
  description: 'NursePath help center — FAQs and support for study guides, downloads, and purchases.',
};

const faqs = [
  {
    q: 'How do I download my purchased study guide?',
    a: 'After purchase, you will receive a download link via email. You can also access your guides from your dashboard once logged in.',
  },
  {
    q: 'What format are the study guides?',
    a: 'All study guides are provided as PDF files optimized for desktop and mobile viewing.',
  },
  {
    q: 'Can I get a refund?',
    a: 'Yes — we offer a 30-day money-back guarantee. See our Refund Policy for details.',
  },
  {
    q: 'How do I contact support?',
    a: 'Email us or use the contact form on our Contact page. We typically respond within 24 hours.',
  },
];

export default function HelpPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-20">
      <h1 className="text-4xl font-black text-gray-900">Help Center</h1>
      <p className="mt-4 text-gray-600 leading-relaxed">
        Find answers to common questions below. Need more help?{' '}
        <Link href="/contact" className="text-primary-600 font-semibold hover:text-primary-700">
          Contact us
        </Link>
        .
      </p>

      <div className="mt-10 space-y-6">
        {faqs.map((faq) => (
          <div key={faq.q} className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">{faq.q}</h2>
            <p className="text-gray-600 leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>

      <p className="mt-8">
        <Link href="/" className="text-primary-600 font-semibold hover:text-primary-700">
          Return to home
        </Link>
      </p>
    </main>
  );
}
