'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Lock, CheckCircle } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useCurrency } from '@/components/currency/CurrencyProvider';

type PaymentMethod = 'card' | 'mpesa';

export interface LibraryCheckoutPlan {
  code: string;
  name: string;
  description: string | null;
  durationDays: number;
  priceUsd: number;
}

interface LibraryCheckoutFormProps {
  plan: LibraryCheckoutPlan;
  userEmail: string;
  userName?: string | null;
}

function formatDuration(days: number) {
  if (days === 1) return '1 day';
  if (days === 7) return '1 week';
  if (days === 30) return '1 month';
  return `${days} days`;
}

export default function LibraryCheckoutForm({
  plan,
  userEmail,
  userName,
}: LibraryCheckoutFormProps) {
  const router = useRouter();
  const { toKes, formatKesAmount, formatUsdAmount } = useCurrency();
  const [method, setMethod] = useState<PaymentMethod>('card');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const kesTotal = toKes(plan.priceUsd);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/paystack/initialize-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planCode: plan.code,
          method,
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
    <main className="flex-grow bg-soft py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-8 flex items-center gap-2 text-navy-400 transition-colors hover:text-primary-600"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="font-medium">Back</span>
        </button>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <h1 className="mb-2 font-display text-3xl font-extrabold text-navy-800 sm:text-4xl">
                Get library access
              </h1>
              <p className="mb-8 text-navy-400">
                Paying as{' '}
                <span className="font-semibold text-navy-800">
                  {userName || userEmail}
                </span>{' '}
                ({userEmail})
              </p>

              {error && (
                <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <p className="mb-3 text-sm font-semibold text-navy-700">Payment method</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setMethod('card')}
                      className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
                        method === 'card'
                          ? 'border-primary-600 bg-primary-50 text-primary-700'
                          : 'border-border text-navy-600 hover:bg-soft'
                      }`}
                    >
                      Card (USD)
                      <span className="mt-1 block text-xs font-normal text-navy-400">
                        {formatUsdAmount(plan.priceUsd)}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMethod('mpesa')}
                      className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
                        method === 'mpesa'
                          ? 'border-primary-600 bg-primary-50 text-primary-700'
                          : 'border-border text-navy-600 hover:bg-soft'
                      }`}
                    >
                      M-Pesa (KES)
                      <span className="mt-1 block text-xs font-normal text-navy-400">
                        {formatKesAmount(kesTotal)}
                      </span>
                    </button>
                  </div>
                </div>

                <Button type="submit" fullWidth size="lg" isLoading={submitting}>
                  <Lock className="mr-2 h-4 w-4" />
                  Pay {method === 'card' ? formatUsdAmount(plan.priceUsd) : formatKesAmount(kesTotal)}
                </Button>

                <p className="text-center text-xs text-navy-400">
                  Secure checkout powered by Paystack. Prepaid — no auto-renew.
                </p>
              </form>
            </Card>
          </div>

          <div>
            <Card>
              <h2 className="mb-4 font-display text-xl font-bold text-navy-800">Order summary</h2>
              <p className="font-semibold text-navy-800">{plan.name}</p>
              <p className="mt-1 text-sm text-navy-400">
                {plan.description || `Access for ${formatDuration(plan.durationDays)}`}
              </p>
              <ul className="mt-4 space-y-2 text-sm text-navy-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-secondary-600" />
                  Study docs + Q&amp;A library
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-secondary-600" />
                  Up to 3 unique downloads per pass
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-secondary-600" />
                  Stacks if you already have access
                </li>
              </ul>
              <div className="mt-6 border-t border-border pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-navy-400">Total</span>
                  <span className="font-display text-xl font-bold text-navy-800">
                    {formatUsdAmount(plan.priceUsd)}
                  </span>
                </div>
              </div>
              <p className="mt-4 text-xs text-navy-400">
                Prefer one-time guides?{' '}
                <Link href="/services" className="text-primary-600 hover:underline">
                  Browse study guides
                </Link>
              </p>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
