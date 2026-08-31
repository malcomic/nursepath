import type { Metadata } from 'next';
import LegalPageShell from '@/components/legal/LegalPageShell';

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: 'NursePath refund policy — 30-day money-back guarantee on study guide purchases.',
  openGraph: {
    title: 'Refund Policy | NursePath',
    description: '30-day money-back guarantee on NursePath study guide purchases.',
    type: 'website',
  },
};

export default function RefundPage() {
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? 'support@nursepath.com';

  return (
    <LegalPageShell title="Refund Policy">
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
          <a href={`mailto:${supportEmail}`} className="text-primary-600 hover:text-primary-700">
            {supportEmail}
          </a>{' '}
          with your order details and reason for the refund. We aim to process refunds within 5–7
          business days. Refunds are returned to the original payment method used at checkout.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-3">Exceptions</h2>
        <p>
          Refunds may be declined if we detect abuse of the refund policy, such as repeated
          purchases and refund requests for the same content.
        </p>
      </section>
    </LegalPageShell>
  );
}
