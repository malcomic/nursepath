'use client';

import { Star } from 'lucide-react';

interface StarRatingInputProps {
  value: number;
  onChange: (value: number) => void;
}

export default function StarRatingInput({ value, onChange }: StarRatingInputProps) {
  return (
    <div className="flex items-center gap-1" aria-label="Rating from 1 to 5 stars">
      {Array.from({ length: 5 }).map((_, index) => {
        const starValue = index + 1;
        const active = starValue <= value;
        return (
          <button
            key={starValue}
            type="button"
            onClick={() => onChange(starValue)}
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
            aria-label={`${starValue} star${starValue === 1 ? '' : 's'}`}
          >
            <Star
              className={`w-6 h-6 transition-colors ${
                active ? 'text-amber-400 fill-amber-400' : 'text-slate-300 hover:text-amber-200'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
