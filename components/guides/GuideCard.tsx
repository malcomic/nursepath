'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FileText, Eye } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import type { GuideWithCategory } from '@/lib/types/guide';
import { useCart } from '@/components/cart/CartProvider';

interface GuideCardProps {
  guide: GuideWithCategory;
}

export default function GuideCard({ guide }: GuideCardProps) {
  const categoryName = guide.category?.name || 'Uncategorized';
  const { addItem, isInCart } = useCart();
  const inCart = isInCart(guide.id);

  const handleAdd = () => {
    addItem({
      guideId: guide.id,
      title: guide.title,
      price: Number(guide.price),
      thumbnailUrl: guide.thumbnailUrl,
      slug: guide.slug,
    });
  };

  return (
    <Card hover className="group flex h-full flex-col overflow-hidden rounded-2xl border-border p-4">
      {guide.thumbnailUrl ? (
        <div className="relative mb-4 h-48 w-full overflow-hidden rounded-xl bg-navy-50">
          <Image
            src={guide.thumbnailUrl}
            alt={guide.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>
      ) : (
        <div className="mb-4 flex h-48 w-full items-center justify-center rounded-xl bg-primary-50">
          <FileText className="h-16 w-16 text-primary-600" />
        </div>
      )}

      <div className="mb-3">
        <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-700">
          {categoryName}
        </span>
      </div>

      <h3 className="mb-2 line-clamp-2 font-display text-lg font-bold text-navy-800 transition-colors group-hover:text-primary-600">
        {guide.title}
      </h3>

      {guide.description && (
        <p className="mb-4 line-clamp-2 flex-grow text-sm text-navy-400">{guide.description}</p>
      )}

      <div className="mt-auto space-y-3">
        <span className="font-display text-2xl font-extrabold text-navy-800">
          {Number(guide.price) === 0 ? 'FREE' : `$${Number(guide.price).toFixed(2)}`}
        </span>

        <div className="grid grid-cols-2 gap-2">
          <Link
            href={`/guides/${guide.slug}`}
            className="flex items-center justify-center gap-2 rounded-full border border-primary-100 bg-primary-50 py-2.5 text-sm font-semibold text-primary-600 transition-colors hover:bg-primary-100"
          >
            <Eye className="h-4 w-4" />
            View
          </Link>
          {inCart ? (
            <Link
              href="/cart"
              className="flex items-center justify-center rounded-full bg-navy-800 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-700"
            >
              In Cart
            </Link>
          ) : (
            <Button
              type="button"
              onClick={handleAdd}
              className="!rounded-full py-2.5 text-sm"
              size="sm"
            >
              Add to Cart
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
