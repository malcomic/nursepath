import type { GuideWithCategory } from '@/lib/types/guide';

export interface GuideFilters {
  category?: string;
  search?: string;
  price?: '' | 'free' | 'under-25' | '25-50' | '50-100' | 'over-100';
  sort?: 'newest' | 'oldest' | 'price-low' | 'price-high' | 'title';
}

const VALID_PRICE_FILTERS = new Set(['free', 'under-25', '25-50', '50-100', 'over-100']);
const VALID_SORT_OPTIONS = new Set(['newest', 'oldest', 'price-low', 'price-high', 'title']);

export function parseGuideFilters(params: {
  category?: string;
  search?: string;
  price?: string;
  sort?: string;
}): GuideFilters {
  return {
    category: params.category || undefined,
    search: params.search || undefined,
    price:
      params.price && VALID_PRICE_FILTERS.has(params.price)
        ? (params.price as GuideFilters['price'])
        : undefined,
    sort:
      params.sort && VALID_SORT_OPTIONS.has(params.sort)
        ? (params.sort as GuideFilters['sort'])
        : 'newest',
  };
}

export function filterGuides(
  guides: GuideWithCategory[],
  filters: GuideFilters
): GuideWithCategory[] {
  let filtered = [...guides];

  if (filters.category) {
    filtered = filtered.filter((guide) => guide.categoryId === filters.category);
  }

  if (filters.search && filters.search.length >= 2) {
    const query = filters.search.toLowerCase();
    filtered = filtered.filter(
      (guide) =>
        guide.title.toLowerCase().includes(query) ||
        (guide.description && guide.description.toLowerCase().includes(query))
    );
  }

  if (filters.price) {
    filtered = filtered.filter((guide) => {
      const price = Number(guide.price);
      switch (filters.price) {
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

  const sort = filters.sort ?? 'newest';
  filtered.sort((a, b) => {
    switch (sort) {
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

  return filtered;
}
