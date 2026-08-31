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
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4">Pricing</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
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
