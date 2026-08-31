import { Star, StarHalf, StarOff } from 'lucide-react';

export default function StarRatingDisplay({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-1" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: fullStars }).map((_, idx) => (
        <Star key={`full-${idx}`} className="w-4 h-4 text-amber-400 fill-amber-400" />
      ))}
      {hasHalf && <StarHalf className="w-4 h-4 text-amber-400 fill-amber-400" />}
      {Array.from({ length: emptyStars }).map((_, idx) => (
        <StarOff key={`empty-${idx}`} className="w-4 h-4 text-slate-300" />
      ))}
    </div>
  );
}
