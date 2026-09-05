'use client';

import Link from 'next/link';
import { ShoppingBag, ShoppingCart } from 'lucide-react';
import Button from '../ui/Button';
import { useCart } from '@/components/cart/CartProvider';

interface GuidePurchaseButtonProps {
  guideId: string;
  price: number;
  title: string;
  slug: string;
  thumbnailUrl?: string | null;
}

export default function GuidePurchaseButton({
  guideId,
  price,
  title,
  slug,
  thumbnailUrl,
}: GuidePurchaseButtonProps) {
  const { addItem, isInCart } = useCart();
  const inCart = isInCart(guideId);

  const handleAdd = () => {
    addItem({
      guideId,
      title,
      price: Number(price),
      thumbnailUrl: thumbnailUrl ?? null,
      slug,
    });
  };

  return (
    <div className="space-y-3">
      {inCart ? (
        <Link href="/cart" className="block">
          <Button size="lg" fullWidth variant="teal">
            <ShoppingCart className="mr-2 h-5 w-5" />
            View Cart
          </Button>
        </Link>
      ) : (
        <Button size="lg" fullWidth onClick={handleAdd}>
          <ShoppingBag className="mr-2 h-5 w-5" />
          {price === 0 ? 'Add Free Guide to Cart' : 'Add to Cart'}
        </Button>
      )}
      <Link
        href={`/purchase/${guideId}`}
        className="block text-center text-sm font-semibold text-primary-600 hover:text-primary-700"
      >
        Buy now — skip cart
      </Link>
    </div>
  );
}
