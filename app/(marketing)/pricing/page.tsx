import type { Metadata } from 'next';
import Pricing from '@/components/sections/Pricing';
import FAQ from '@/components/sections/FAQ';
import CTA from '@/components/sections/CTA';

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Prepaid library access for study documents and Q&A — 1 day, 1 week, or 1 month. Study guides sold separately.',
};

export default function PricingPage() {
  return (
    <main>
      <section className="bg-navy-800 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-4 font-display text-4xl font-extrabold sm:text-5xl lg:text-6xl">
            Pricing
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-navy-200">
            Prepaid library passes for study docs and Q&amp;A. One-time study guides sold separately.
          </p>
        </div>
      </section>
      <Pricing />
      <FAQ />
      <CTA />
    </main>
  );
}
