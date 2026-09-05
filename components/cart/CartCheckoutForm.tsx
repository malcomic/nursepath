'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, FileText, Lock, CheckCircle } from 'lucide-react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useCart } from '@/components/cart/CartProvider';

export default function CartCheckoutForm() {
  const router = useRouter();
  const { items, total, clearCart, hydrated } = useCart();
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isFree = total === 0 && items.length > 0;
  const hasUnconfiguredPaid = items.some((i) => Number(i.price) > 0);
  // Stripe config checked server-side; client allows submit for paid carts

  if (!hydrated) {
    return (
      <main className="flex-grow bg-soft py-16">
        <div className="mx-auto max-w-5xl px-4">
          <div className="h-64 animate-pulse rounded-2xl bg-white" />
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="flex-grow bg-soft py-16">
        <div className="mx-auto max-w-lg px-4 text-center">
          <Card className="py-12">
            <p className="mb-6 font-display text-xl font-bold text-navy-800">Your cart is empty</p>
            <Link href="/services">
              <Button>Browse Study Guides</Button>
            </Link>
          </Card>
        </div>
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const guideIds = items.map((i) => i.guideId);

    try {
      localStorage.setItem('userEmail', buyerEmail);

      if (isFree) {
        const res = await fetch('/api/checkout/free', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ guideIds, buyerName, buyerEmail }),
        });
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.error || 'Checkout failed');
        }
        clearCart();
        router.push(`/payment-success?order_id=${encodeURIComponent(json.data.orderId)}`);
        return;
      }

      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guideIds, buyerName, buyerEmail }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Checkout failed');
      }

      const url = json.data?.url;
      if (!url) {
        throw new Error('No checkout URL returned');
      }

      clearCart();
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Purchase failed. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <main className="flex-grow bg-soft py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/cart"
          className="mb-8 inline-flex items-center gap-2 font-medium text-navy-400 transition-colors hover:text-primary-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to cart
        </Link>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <h1 className="mb-8 font-display text-3xl font-extrabold text-navy-800 sm:text-4xl">
                Complete Your Purchase
              </h1>

              {error && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="mb-4 font-display text-xl font-bold text-navy-800">
                    Contact Information
                  </h2>
                  <div className="space-y-4">
                    <Input
                      label="Full Name"
                      name="buyerName"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      required
                      placeholder="Jane Doe"
                    />
                    <Input
                      label="Email Address"
                      name="buyerEmail"
                      type="email"
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      required
                      placeholder="jane@example.com"
                      helperText="We'll send your download link(s) to this email"
                    />
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <Button
                    type="submit"
                    fullWidth
                    size="lg"
                    isLoading={submitting}
                    disabled={!buyerName || !buyerEmail}
                    className="group"
                  >
                    <Lock className="mr-2 h-5 w-5" />
                    {isFree
                      ? 'Get Free Guides'
                      : submitting
                        ? 'Redirecting…'
                        : 'Continue to secure checkout'}
                  </Button>
                  <p className="mt-4 text-center text-sm text-navy-400">
                    {isFree
                      ? 'No payment required — instant download after confirmation'
                      : 'Your payment is secure and encrypted via Stripe'}
                  </p>
                  {!isFree && hasUnconfiguredPaid && (
                    <p className="mt-2 text-center text-xs text-navy-400">
                      Paid guides must have Stripe prices configured in admin.
                    </p>
                  )}
                </div>
              </form>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-28">
              <h2 className="mb-6 font-display text-xl font-bold text-navy-800">Order Summary</h2>

              <div className="mb-6 space-y-4 border-b border-border pb-6">
                {items.map((item) => (
                  <div key={item.guideId} className="flex items-start gap-3">
                    {item.thumbnailUrl ? (
                      <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-lg bg-navy-50">
                        <Image
                          src={item.thumbnailUrl}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                    ) : (
                      <div className="flex h-14 w-12 shrink-0 items-center justify-center rounded-lg bg-primary-50">
                        <FileText className="h-5 w-5 text-primary-600" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-semibold text-navy-800">{item.title}</p>
                      <p className="text-sm text-primary-600">
                        {item.price === 0 ? 'FREE' : `$${Number(item.price).toFixed(2)}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mb-6 flex items-center justify-between">
                <span className="font-display text-lg font-bold text-navy-800">Total</span>
                <span className="font-display text-2xl font-extrabold text-navy-800">
                  {total === 0 ? 'FREE' : `$${total.toFixed(2)}`}
                </span>
              </div>

              <div className="space-y-2 border-t border-border pt-6">
                <div className="flex items-center gap-2 text-sm text-navy-400">
                  <CheckCircle className="h-4 w-4 text-secondary-600" />
                  <span>Instant download</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-navy-400">
                  <CheckCircle className="h-4 w-4 text-secondary-600" />
                  <span>No account required</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-navy-400">
                  <CheckCircle className="h-4 w-4 text-secondary-600" />
                  <span>30-day money-back guarantee</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
