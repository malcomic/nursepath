'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import Button from '@/components/ui/Button';

interface Category {
  id: string;
  name: string;
}

interface ServicesFiltersProps {
  categories: Category[];
  currentParams: {
    category?: string;
    search?: string;
    price?: string;
    sort?: string;
  };
}

export default function ServicesFilters({ categories, currentParams }: ServicesFiltersProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const updateParams = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const merged = { ...currentParams, ...updates };

    if (merged.category) params.set('category', merged.category);
    if (merged.search) params.set('search', merged.search);
    if (merged.price) params.set('price', merged.price);
    if (merged.sort && merged.sort !== 'newest') params.set('sort', merged.sort);

    const query = params.toString();
    startTransition(() => {
      router.push(query ? `/services?${query}` : '/services');
    });
  };

  const clearFilters = () => {
    startTransition(() => {
      router.push('/services');
    });
  };

  const hasActiveFilters =
    !!currentParams.category || !!currentParams.search || !!currentParams.price;

  return (
    <section
      className={`bg-white border-b border-gray-200 sticky top-20 z-40 shadow-sm ${isPending ? 'opacity-70' : ''}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search guides by title or description..."
              defaultValue={currentParams.search ?? ''}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  updateParams({ search: e.currentTarget.value || undefined });
                }
              }}
              onBlur={(e) => {
                const value = e.target.value;
                if (value !== (currentParams.search ?? '')) {
                  updateParams({ search: value || undefined });
                }
              }}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
            />
            {currentParams.search && (
              <button
                onClick={() => updateParams({ search: undefined })}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <select
              value={currentParams.category ?? ''}
              onChange={(e) => updateParams({ category: e.target.value || undefined })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <select
              value={currentParams.price ?? ''}
              onChange={(e) => updateParams({ price: e.target.value || undefined })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
            >
              <option value="">All Prices</option>
              <option value="free">Free</option>
              <option value="under-25">Under $25</option>
              <option value="25-50">$25 - $50</option>
              <option value="50-100">$50 - $100</option>
              <option value="over-100">Over $100</option>
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <select
              value={currentParams.sort ?? 'newest'}
              onChange={(e) => updateParams({ sort: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="title">Title: A-Z</option>
            </select>
          </div>

          {hasActiveFilters && (
            <Button variant="ghost" onClick={clearFilters} className="flex items-center gap-2">
              <X className="w-4 h-4" />
              Clear Filters
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
