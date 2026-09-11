import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import { categoryService } from '@/lib/services/categoryService';
import { guideService } from '@/lib/services/guideService';
import { toPublicGuide } from '@/lib/controllers/guideController';
import { getCategorySeo } from '@/lib/seo/category-keywords';
import { ApiError } from '@/lib/errors/api-error';
import GuideGrid from '@/components/guides/GuideGrid';
import CTA from '@/components/sections/CTA';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const categories = await categoryService.getAllCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const category = await categoryService.getCategoryByParam(slug);
    const seo = getCategorySeo(category.slug);
    return {
      title: `${category.name} Study Guides`,
      description: category.description ?? seo.description,
      openGraph: {
        title: `${category.name} Study Guides | NursePath`,
        description: category.description ?? seo.description,
      },
    };
  } catch (err) {
    if (err instanceof ApiError && err.statusCode === 404) {
      const seo = getCategorySeo(slug);
      return { title: seo.title, description: seo.description };
    }
    throw err;
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug: param } = await params;

  let category;
  try {
    category = await categoryService.getCategoryByParam(param);
  } catch (err) {
    if (err instanceof ApiError && err.statusCode === 404) {
      notFound();
    }
    throw err;
  }

  if (param === category.id) {
    permanentRedirect(`/categories/${category.slug}`);
  }

  const guides = (await guideService.getGuidesByCategory(category.id)).map(toPublicGuide);
  const seo = getCategorySeo(category.slug);

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
