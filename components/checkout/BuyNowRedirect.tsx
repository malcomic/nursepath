'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/cart/CartProvider';
import type { CheckoutGuide } from '@/components/checkout/CheckoutForm';

/** Buy-now shortcut: seed a one-item cart and go to /checkout */
export default function BuyNowRedirect({ guide }: { guide: CheckoutGuide }) {
  const router = useRouter();
  const { replaceCart, hydrated } = useCart();

  useEffect(() => {
    if (!hydrated) return;
    replaceCart([
      {
        guideId: guide.id,
        title: guide.title,
        price: Number(guide.price),
        thumbnailUrl: guide.thumbnailUrl ?? null,
        slug: guide.slug,
      },
    ]);
    router.replace('/checkout');
  }, [hydrated, guide, replaceCart, router]);

  return (
    <main className="flex flex-grow items-center justify-center bg-soft py-24">
      <p className="font-display text-navy-400">Preparing checkout…</p>
    </main>
  );
}
