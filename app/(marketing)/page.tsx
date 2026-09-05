import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Award,
  Activity,
  Briefcase,
  Heart,
  Users,
  Smile,
  BookCheck,
  type LucideIcon,
} from 'lucide-react';
import { guideService } from '@/lib/services/guideService';
import { categoryService } from '@/lib/services/categoryService';
import { slugify } from '@/lib/slugify';
import Hero from '@/components/sections/Hero';
import Features from '@/components/sections/Features';
import HowItWorks from '@/components/sections/HowItWorks';
import BundleOffer from '@/components/sections/BundleOffer';
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

const BUNDLE_SLUG = 'complete-nclex-rn-prep-bundle';

const CATEGORY_ICONS: LucideIcon[] = [Award, Activity, Briefcase, Heart, Users, Smile];

export default async function HomePage() {
  const [guides, categories] = await Promise.all([
    guideService.getAllGuides(),
    categoryService.getAllCategories(),
  ]);
  const featured = guides.slice(0, 3);

  let bundle = null;
  try {
    bundle = await guideService.getGuideByParam(BUNDLE_SLUG);
  } catch {
    bundle = null;
  }

  const categoriesWithCounts = categories.map((cat) => ({
    ...cat,
    count: guides.filter((g) => g.categoryId === cat.id).length,
  }));

  return (
    <main>
      <Hero />

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-3 font-display text-sm font-bold uppercase text-primary-600">
              Student Favorites
            </p>
            <h2 className="mb-4 font-display text-3xl font-bold text-navy-800 sm:text-4xl">
              Most Popular Study Guides
            </h2>
            <p className="text-lg text-navy-400">
              High-yield content, clear diagrams, and practice questions. Instantly downloaded to
              any device.
            </p>
          </div>
          <GuideGrid guides={featured} />
          <div className="mt-10 text-center">
            <Link
              href="/services"
              className="font-display font-semibold text-primary-600 hover:text-primary-700"
            >
              View all study guides →
            </Link>
          </div>
        </div>
      </section>

      {categoriesWithCounts.length > 0 && (
        <section className="bg-soft py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <p className="mb-3 font-display text-sm font-bold uppercase text-primary-600">
                Targeted Learning
              </p>
              <h2 className="mb-4 font-display text-3xl font-bold text-navy-800 sm:text-4xl">
                Browse Study Guides by Category
              </h2>
              <p className="text-lg text-navy-400">
                Focus on your weak areas with targeted study guides covering essential nursing
                domains.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categoriesWithCounts.map((cat, i) => {
                const Icon = CATEGORY_ICONS[i % CATEGORY_ICONS.length] ?? BookCheck;
                return (
                  <Link
                    key={cat.id}
                    href={`/categories/${slugify(cat.name)}`}
                    className="flex items-center gap-4 rounded-2xl border border-border bg-white p-6 transition-all hover:border-primary-500 hover:shadow-soft"
                  >
                    <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary-50">
                      <Icon className="h-7 w-7 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold text-navy-800">{cat.name}</h3>
                      <p className="text-sm text-navy-400">
                        {cat.count} Guide{cat.count === 1 ? '' : 's'}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <HowItWorks />
      <Features />

      {bundle && (
        <BundleOffer
          slug={bundle.slug}
          title={bundle.title}
          description={bundle.description}
          price={Number(bundle.price)}
          thumbnailUrl={bundle.thumbnailUrl}
        />
      )}

      <Testimonials />
      <FAQ />
      <CTA />
    </main>
  );
}
