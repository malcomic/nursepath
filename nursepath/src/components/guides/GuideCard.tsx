import { Link } from 'react-router-dom';
import { Star, FileText, CheckCircle, ShoppingBag, Eye } from 'lucide-react';
import Card from '../ui/Card';

interface GuideCardProps {
  guide: {
    id: string;
    title: string;
    description?: string | null;
    price: number;
    categoryId: string;
    thumbnailUrl?: string | null;
    category?: {
      id: string;
      name: string;
    };
  };
}

export default function GuideCard({ guide }: GuideCardProps) {
  const categoryName = guide.category?.name || 'Uncategorized';

  return (
    <Card hover className="flex flex-col h-full group">
      {/* Thumbnail */}
      {guide.thumbnailUrl ? (
        <div className="w-full h-48 bg-gray-100 rounded-xl mb-4 overflow-hidden">
          <img
            src={guide.thumbnailUrl}
            alt={guide.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl mb-4 flex items-center justify-center">
          <FileText className="w-16 h-16 text-primary-600" />
        </div>
      )}

      {/* Category Badge */}
      <div className="flex items-center justify-between mb-3">
        <span className="bg-primary-100 text-primary-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg">
          {categoryName}
        </span>
        <div className="flex items-center gap-1 text-amber-500">
          <Star className="w-4 h-4 fill-current" />
          <span className="text-xs font-bold">4.8</span>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
        {guide.title}
      </h3>

      {/* Description */}
      {guide.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
          {guide.description}
        </p>
      )}

      {/* Features */}
      <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
        <div className="flex items-center gap-1">
          <FileText className="w-3.5 h-3.5" />
          <span>Study Guide</span>
        </div>
        <div className="flex items-center gap-1">
          <CheckCircle className="w-3.5 h-3.5 text-green-500" />
          <span>2024 Updated</span>
        </div>
      </div>

      {/* Price and Actions */}
      <div className="mt-auto space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-black text-gray-900">
            {guide.price === 0 ? 'FREE' : `$${guide.price.toFixed(2)}`}
          </span>
          {guide.price > 0 && (
            <span className="text-sm font-bold text-gray-400 line-through">
              ${(guide.price * 1.5).toFixed(0)}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Link
            to={`/guides/${guide.id}`}
            className="bg-primary-50 text-primary-600 py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary-100 transition-colors border border-primary-100"
          >
            <Eye className="w-4 h-4" />
            View
          </Link>
          <Link
            to={`/purchase/${guide.id}`}
            className="bg-primary-600 text-white py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary-700 transition-colors shadow-md"
          >
            <ShoppingBag className="w-4 h-4" />
            Buy
          </Link>
        </div>
      </div>
    </Card>
  );
}
