import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, BookCheck } from 'lucide-react';
import { guideService } from '@/lib/services/guideService';
import { categoryService } from '@/lib/services/categoryService';
import { slugify } from '@/lib/slugify';
import Hero from '@/components/sections/Hero';
import Features from '@/components/sections/Features';
import HowItWorks from '@/components/sections/HowItWorks';
import Pricing from '@/components/sections/Pricing';
import Testimonials from '@/components/sections/Testimonials';
import FAQ from '@/components/sections/FAQ';
import CTA from '@/components/sections/CTA';
import GuideGrid from '@/components/guides/GuideGrid';

export const metadata: Metadata = {
  title: 'NCLEX-RN Study Guides & Nursing Exam Prep',
  description:
    'Comprehensive NCLEX-RN study guides and nursing exam prep materials. Expert-curated resources to help you pass your nursing exams.',
  openGraph: {
    title: 'NCLEX-RN Study Guides & Nursing Exam Prep | NursePath',
    description:
      'Comprehensive NCLEX-RN study guides and nursing exam prep materials designed by nursing professionals.',
  },
};

export default async function HomePage() {
  const [guides, categories] = await Promise.all([
    guideService.getAllGuides(),
    categoryService.getAllCategories(),
  ]);
  const featured = guides.slice(0, 8);

  return (
    <main>
      <Hero />

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-4">
                Featured Study Guides
              </h2>
              <p className="text-xl text-gray-600">
                Handpicked resources to help you excel in your exams
              </p>
            </div>
            <Link
              href="/services"
              className="hidden md:flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors"
            >
              View All
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
          <GuideGrid guides={featured} />
          <div className="text-center mt-8 md:hidden">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors"
            >
              View All Guides
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-4">
                  Browse by Category
                </h2>
                <p className="text-xl text-gray-600">
                  Find study guides for your specific exam type
                </p>
              </div>
              <Link
                href="/services"
                className="hidden md:flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors"
              >
                View All
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${slugify(cat.name)}`}
                  className="bg-white p-6 rounded-2xl border border-gray-200 flex items-center justify-between hover:border-primary-500 hover:shadow-xl hover:shadow-primary-500/5 transition-all group"
                >
                  <span className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {cat.name}
                  </span>
                  <div className="bg-gray-50 p-2 rounded-lg group-hover:bg-primary-50 transition-colors">
                    <BookCheck className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Features />
      <HowItWorks />
      <Pricing />
      <Testimonials />
      <FAQ />
      <CTA />
    </main>
  );
}
