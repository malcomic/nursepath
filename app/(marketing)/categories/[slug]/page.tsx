import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { categoryService } from '@/lib/services/categoryService';
import { guideService } from '@/lib/services/guideService';
import { getCategorySeo } from '@/lib/seo/category-keywords';
import { slugify } from '@/lib/slugify';
import GuideGrid from '@/components/guides/GuideGrid';
import CTA from '@/components/sections/CTA';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const categories = await categoryService.getAllCategories();
  return categories.map((c) => ({ slug: slugify(c.name) }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const seo = getCategorySeo(slug);
  const categories = await categoryService.getAllCategories();
  const category = categories.find((c) => slugify(c.name) === slug);

  return {
    title: category ? `${category.name} Study Guides` : seo.title,
    description: category?.description ?? seo.description,
    openGraph: {
      title: category ? `${category.name} Study Guides | NursePath` : seo.title,
      description: category?.description ?? seo.description,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const categories = await categoryService.getAllCategories();
  const category = categories.find((c) => slugify(c.name) === slug);

  if (!category) {
    notFound();
  }

  const guides = await guideService.getGuidesByCategory(category.id);
  const seo = getCategorySeo(slug);

  return (
    <main>
      <section className="bg-navy-800 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="mb-4 font-display text-4xl font-extrabold sm:text-5xl lg:text-6xl">
            {category.name}
          </h1>
          <p className="max-w-2xl text-xl text-navy-200">
            {category.description ?? seo.description}
          </p>
        </div>
      </section>

      <section className="bg-soft py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <p className="text-navy-400">
              {guides.length} {guides.length === 1 ? 'guide' : 'guides'} in this category
            </p>
            <Link
              href={`/services?category=${category.id}`}
              className="font-semibold text-primary-600 transition-colors hover:text-primary-700"
            >
              View in catalog →
            </Link>
          </div>
          <GuideGrid guides={guides} />
        </div>
      </section>

      <CTA
        title={`Ready to Master ${category.name}?`}
        description="Browse our full catalog or get started with a study guide today."
        primaryButtonText="Browse All Guides"
        primaryButtonLink={`/services?category=${category.id}`}
      />
    </main>
  );
}
