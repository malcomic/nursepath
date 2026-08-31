import type { Metadata } from 'next';
import { categoryService } from '@/lib/services/categoryService';
import { getFilteredGuides } from '@/lib/guides/get-filtered-guides';
import { getCategorySeo } from '@/lib/seo/category-keywords';
import { slugify } from '@/lib/slugify';
import GuideGrid from '@/components/guides/GuideGrid';
import ServicesFilters from '@/components/services/ServicesFilters';

interface ServicesPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    price?: string;
    sort?: string;
  }>;
}

export async function generateMetadata({ searchParams }: ServicesPageProps): Promise<Metadata> {
  const params = await searchParams;

  if (params.category) {
    const categories = await categoryService.getAllCategories();
    const category = categories.find((c) => c.id === params.category);
    if (category) {
      const slug = slugify(category.name);
      const seo = getCategorySeo(slug);
      return {
        title: seo.title,
        description: seo.description,
      };
    }
  }

  return {
    title: 'Study Guides Catalog',
    description:
      'Browse our comprehensive collection of NCLEX-RN study guides and nursing exam prep resources.',
  };
}

export default async function ServicesPage({ searchParams }: ServicesPageProps) {
  const params = await searchParams;
  const [categories, guides] = await Promise.all([
    categoryService.getAllCategories(),
    getFilteredGuides(params),
  ]);

  const hasActiveFilters = !!(params.category || params.search || params.price);

  return (
    <main className="bg-gray-50">
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4">Study Guides Catalog</h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Browse our comprehensive collection of nursing study guides and find the perfect
            resources for your exam preparation.
          </p>
        </div>
      </section>

      <ServicesFilters categories={categories} currentParams={params} />

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 text-sm text-gray-600">
            Showing {guides.length} {guides.length === 1 ? 'guide' : 'guides'}
            {hasActiveFilters && ' (filtered)'}
          </div>
          <GuideGrid guides={guides} />
        </div>
      </section>
    </main>
  );
}
