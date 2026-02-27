import type { Guide } from '../../types';
import GuideCard from './GuideCard';

interface GuideGridProps {
  guides: Guide[];
  loading?: boolean;
}

export default function GuideGrid({ guides, loading }: GuideGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse">
            <div className="w-full h-48 bg-gray-200 rounded-xl mb-4" />
            <div className="h-4 bg-gray-200 rounded mb-2" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  if (guides.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">No guides found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {guides.map((guide) => (
        <GuideCard key={guide.id} guide={guide} />
      ))}
    </div>
  );
}
