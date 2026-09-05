'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FileText, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '@/components/cart/CartProvider';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function CartPageClient() {
  const { items, total, removeItem, hydrated } = useCart();

  if (!hydrated) {
    return (
      <main className="flex-grow bg-soft py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="h-40 animate-pulse rounded-2xl bg-white" />
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow bg-soft py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-8 font-display text-3xl font-extrabold text-navy-800 sm:text-4xl">
          Your Cart
        </h1>

        {items.length === 0 ? (
          <Card className="py-16 text-center">
            <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-navy-300" />
            <p className="mb-2 font-display text-xl font-bold text-navy-800">Your cart is empty</p>
            <p className="mb-8 text-navy-400">Browse study guides and add them to your cart.</p>
            <Link href="/services">
              <Button>Browse Study Guides</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              {items.map((item) => (
                <Card key={item.guideId} className="flex gap-4 p-4 sm:p-5">
                  {item.thumbnailUrl ? (
                    <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-navy-50">
                      <Image
                        src={item.thumbnailUrl}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                  ) : (
                    <div className="flex h-24 w-20 shrink-0 items-center justify-center rounded-xl bg-primary-50">
                      <FileText className="h-8 w-8 text-primary-600" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/guides/${item.slug}`}
                      className="font-display text-lg font-bold text-navy-800 hover:text-primary-600"
                    >
                      {item.title}
                    </Link>
                    <p className="mt-1 font-display text-lg font-extrabold text-primary-600">
                      {item.price === 0 ? 'FREE' : `$${Number(item.price).toFixed(2)}`}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.guideId)}
                    className="self-start rounded-lg p-2 text-navy-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    aria-label={`Remove ${item.title}`}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </Card>
              ))}
            </div>

            <Card className="h-fit lg:sticky lg:top-28">
              <h2 className="mb-4 font-display text-xl font-bold text-navy-800">Summary</h2>
              <div className="mb-2 flex justify-between text-navy-400">
                <span>
                  {items.length} item{items.length === 1 ? '' : 's'}
                </span>
                <span>{total === 0 ? 'FREE' : `$${total.toFixed(2)}`}</span>
              </div>
              <div className="mb-6 flex justify-between border-t border-border pt-4 font-display text-lg font-bold text-navy-800">
                <span>Total</span>
                <span>{total === 0 ? 'FREE' : `$${total.toFixed(2)}`}</span>
              </div>
              <Link href="/checkout" className="block">
                <Button fullWidth size="lg">
                  Proceed to Checkout
                </Button>
              </Link>
              <Link
                href="/services"
                className="mt-4 block text-center text-sm font-semibold text-primary-600 hover:text-primary-700"
              >
                Continue shopping
              </Link>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}
