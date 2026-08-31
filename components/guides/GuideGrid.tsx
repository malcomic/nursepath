import type { GuideWithCategory } from '@/lib/types/guide';
import GuideCard from './GuideCard';

interface GuideGridProps {
  guides: GuideWithCategory[];
}

export default function GuideGrid({ guides }: GuideGridProps) {
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
