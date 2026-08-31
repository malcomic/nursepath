'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Lock, FileText, CheckCircle } from 'lucide-react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export interface CheckoutGuide {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  price: number;
  thumbnailUrl?: string | null;
  stripePriceId?: string | null;
}

interface CheckoutFormProps {
  guide: CheckoutGuide;
}

export default function CheckoutForm({ guide }: CheckoutFormProps) {
  const router = useRouter();
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isFree = guide.price === 0;
  const canCheckout = isFree || !!guide.stripePriceId;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      localStorage.setItem('userEmail', buyerEmail);

      if (isFree) {
        const res = await fetch('/api/checkout/free', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            guideId: guide.id,
            buyerName,
            buyerEmail,
          }),
        });
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.error || 'Checkout failed');
        }
        router.push(`/payment-success?order_id=${encodeURIComponent(json.data.orderId)}`);
        return;
      }

      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guideId: guide.id,
          buyerName,
          buyerEmail,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Checkout failed');
      }

      const url = json.data?.url;
      if (!url) {
        throw new Error('No checkout URL returned');
      }

      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Purchase failed. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <main className="bg-gray-50 flex-grow py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-medium">Back</span>
        </button>

        {!canCheckout && (
          <Card className="mb-8 border-amber-200 bg-amber-50">
            <p className="text-amber-900 font-medium mb-2">
              This guide is not available for online checkout yet.
            </p>
            <p className="text-amber-800 text-sm mb-4">
              Payment has not been configured for this guide. Please check back later or contact
              support.
            </p>
            <Link
              href={`/guides/${guide.slug}`}
              className="text-primary-600 font-semibold hover:text-primary-700"
            >
              ← Back to guide details
            </Link>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-8">
                Complete Your Purchase
              </h1>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
                  <div className="space-y-4">
                    <Input
                      label="Full Name"
                      name="buyerName"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      required
                      placeholder="John Doe"
                      disabled={!canCheckout}
                    />
                    <Input
                      label="Email Address"
                      name="buyerEmail"
                      type="email"
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      required
                      placeholder="john@example.com"
                      helperText="We'll send your download link to this email"
                      disabled={!canCheckout}
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <Button
                    type="submit"
                    fullWidth
                    size="lg"
                    isLoading={submitting}
                    disabled={!canCheckout || !buyerName || !buyerEmail}
                    className="group"
                  >
                    <Lock className="w-5 h-5 mr-2" />
                    {isFree
                      ? 'Get Free Guide'
                      : submitting
                        ? 'Redirecting…'
                        : 'Continue to secure checkout'}
                  </Button>
                  <p className="text-sm text-gray-500 mt-4 text-center">
                    {isFree
                      ? 'No payment required — instant download after confirmation'
                      : 'Your payment is secure and encrypted via Stripe'}
                  </p>
                </div>
              </form>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="flex items-start gap-4 mb-6 pb-6 border-b border-gray-200">
                {guide.thumbnailUrl ? (
                  <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                    <Image
                      src={guide.thumbnailUrl}
                      alt={guide.title}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-8 h-8 text-primary-600" />
                  </div>
                )}
                <div className="flex-grow min-w-0">
                  <h3 className="font-bold text-gray-900 line-clamp-2 mb-1">{guide.title}</h3>
                  <p className="text-sm text-gray-600">Study Guide - PDF</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{guide.price === 0 ? 'FREE' : `$${guide.price.toFixed(2)}`}</span>
                </div>
                <div className="flex items-center justify-between text-gray-600">
                  <span>Tax</span>
                  <span>$0.00</span>
                </div>
                <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-black text-gray-900">
                    {guide.price === 0 ? 'FREE' : `$${guide.price.toFixed(2)}`}
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-secondary-600" />
                  <span>Instant download</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-secondary-600" />
                  <span>Lifetime access</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-secondary-600" />
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
