import { guideService } from '@/lib/services/guideService';
import { filterGuides, parseGuideFilters } from './filter-guides';

export async function getFilteredGuides(params: {
  category?: string;
  search?: string;
  price?: string;
  sort?: string;
}) {
  const filters = parseGuideFilters(params);

  let guides;
  if (filters.search && filters.search.length >= 2) {
    guides = await guideService.searchGuides(filters.search);
  } else {
    guides = await guideService.getAllGuides();
  }

  return filterGuides(guides, filters);
}
