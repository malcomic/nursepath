import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { api } from '../api';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import GuideGrid from '../components/guides/GuideGrid';
import Button from '../components/ui/Button';
import type { Guide } from '../types';

interface Category {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
}

export default function ServicesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [guides, setGuides] = useState<Guide[]>([]);
  const [allGuides, setAllGuides] = useState<Guide[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get('category') || ''
  );
  const [searchQuery, setSearchQuery] = useState<string>(
    searchParams.get('search') || ''
  );
  const [priceFilter, setPriceFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterAndSortGuides();
  }, [selectedCategory, searchQuery, priceFilter, sortBy, allGuides]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [guidesRes, categoriesRes] = await Promise.all([
        api.get('/guides'),
        api.get('/categories'),
      ]);
      setAllGuides(guidesRes.data || []);
      setCategories(categoriesRes.data || []);
    } catch (error) {
      console.error('Failed to fetch guides:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortGuides = () => {
    let filtered = [...allGuides];

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter((guide) => guide.categoryId === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (guide) =>
          guide.title.toLowerCase().includes(query) ||
          (guide.description && guide.description.toLowerCase().includes(query))
      );
    }

    // Price filter
    if (priceFilter) {
      filtered = filtered.filter((guide) => {
        const price = Number(guide.price);
        switch (priceFilter) {
          case 'free':
            return price === 0;
          case 'under-25':
            return price > 0 && price < 25;
          case '25-50':
            return price >= 25 && price <= 50;
          case '50-100':
            return price > 50 && price <= 100;
          case 'over-100':
            return price > 100;
          default:
            return true;
        }
      });
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        case 'oldest':
          return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
        case 'price-low':
          return Number(a.price) - Number(b.price);
        case 'price-high':
          return Number(b.price) - Number(a.price);
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setGuides(filtered);
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
    setPriceFilter('');
    setSortBy('newest');
    setSearchParams({});
  };

  const hasActiveFilters = selectedCategory || searchQuery || priceFilter;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow">
        {/* Header Section */}
        <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4">
              Study Guides Catalog
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">
              Browse our comprehensive collection of nursing study guides and find the perfect resources for your exam preparation.
            </p>
          </div>
        </section>

        {/* Filters and Search Section */}
        <section className="bg-white border-b border-gray-200 sticky top-20 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Search Bar */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search guides by title or description..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSearchParams({ ...Object.fromEntries(searchParams), search: e.target.value });
                  }}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      const newParams = { ...Object.fromEntries(searchParams) };
                      delete newParams.search;
                      setSearchParams(newParams);
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Category Filter */}
              <div className="flex-1 min-w-[200px]">
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    if (e.target.value) {
                      setSearchParams({ ...Object.fromEntries(searchParams), category: e.target.value });
                    } else {
                      const newParams = { ...Object.fromEntries(searchParams) };
                      delete newParams.category;
                      setSearchParams(newParams);
                    }
                  }}
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

              {/* Price Filter */}
              <div className="flex-1 min-w-[200px]">
                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
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

              {/* Sort By */}
              <div className="flex-1 min-w-[200px]">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="title">Title: A-Z</option>
                </select>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Clear Filters
                </Button>
              )}
            </div>

            {/* Results Count */}
            <div className="mt-4 text-sm text-gray-600">
              Showing {guides.length} {guides.length === 1 ? 'guide' : 'guides'}
              {hasActiveFilters && ' (filtered)'}
            </div>
          </div>
        </section>

        {/* Guides Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <GuideGrid guides={guides} loading={loading} />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
