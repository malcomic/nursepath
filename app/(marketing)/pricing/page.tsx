import type { Metadata } from 'next';
import Pricing from '@/components/sections/Pricing';
import FAQ from '@/components/sections/FAQ';
import CTA from '@/components/sections/CTA';

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Simple, transparent pricing for NCLEX-RN study guides and nursing exam prep. All plans include a 30-day money-back guarantee.',
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
            Choose the plan that works best for your nursing exam preparation journey.
          </p>
        </div>
      </section>
      <Pricing />
      <FAQ />
      <CTA />
    </main>
  );
}
