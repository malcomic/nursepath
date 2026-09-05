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

  const selectClass =
    'w-full rounded-xl border border-border bg-white px-4 py-2.5 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500';

  return (
    <section
      className={`sticky top-[88px] z-40 border-b border-border bg-white shadow-sm ${isPending ? 'opacity-70' : ''}`}
    >
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-navy-300" />
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
              className="w-full rounded-xl border border-border bg-white py-3 pl-12 pr-4 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {currentParams.search && (
              <button
                onClick={() => updateParams({ search: undefined })}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-navy-300 hover:text-navy-600"
                aria-label="Clear search"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="min-w-[200px] flex-1">
            <select
              value={currentParams.category ?? ''}
              onChange={(e) => updateParams({ category: e.target.value || undefined })}
              className={selectClass}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="min-w-[200px] flex-1">
            <select
              value={currentParams.price ?? ''}
              onChange={(e) => updateParams({ price: e.target.value || undefined })}
              className={selectClass}
            >
              <option value="">All Prices</option>
              <option value="free">Free</option>
              <option value="under-25">Under $25</option>
              <option value="25-50">$25 - $50</option>
              <option value="50-100">$50 - $100</option>
              <option value="over-100">Over $100</option>
            </select>
          </div>

          <div className="min-w-[200px] flex-1">
            <select
              value={currentParams.sort ?? 'newest'}
              onChange={(e) => updateParams({ sort: e.target.value })}
              className={selectClass}
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
              <X className="h-4 w-4" />
              Clear Filters
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
