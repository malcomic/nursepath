'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Clock, XCircle, RefreshCw, BookOpen } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const POLL_INTERVAL_MS = 1500;
const MAX_POLL_ATTEMPTS = 20;

interface SubscriptionStatus {
  id: string;
  status: 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  startsAt: string | null;
  endsAt: string | null;
  amountUsd: number;
  plan: {
    code: string;
    name: string;
    durationDays: number;
    priceUsd: number;
  };
}

export default function LibrarySuccessClient() {
  const searchParams = useSearchParams();
  const subscriptionId = searchParams.get('subscription_id');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<SubscriptionStatus | null>(null);
  const [pollAttempts, setPollAttempts] = useState(0);

  const fetchStatus = useCallback(async () => {
    if (!subscriptionId) return;

    try {
      setError(null);
      const res = await fetch(`/api/subscriptions/${encodeURIComponent(subscriptionId)}`);
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Unable to load payment status.');
      }
      setData(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load payment status.');
    } finally {
      setLoading(false);
    }
  }, [subscriptionId]);

  useEffect(() => {
    if (!subscriptionId) {
      setLoading(false);
      setError('Missing subscription id.');
      return;
    }
    void fetchStatus();
  }, [subscriptionId, fetchStatus]);

  useEffect(() => {
    if (!subscriptionId || data?.status !== 'PENDING') return;
    if (pollAttempts >= MAX_POLL_ATTEMPTS) return;

    const timer = window.setTimeout(() => {
      setPollAttempts((n) => n + 1);
      void fetchStatus();
    }, POLL_INTERVAL_MS);

    return () => window.clearTimeout(timer);
  }, [data?.status, subscriptionId, pollAttempts, fetchStatus]);

  const endsAtLabel = data?.endsAt
    ? new Date(data.endsAt).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    : null;

  return (
    <main className="flex-grow bg-soft py-12">
      <div className="mx-auto max-w-lg px-4 sm:px-6 lg:px-8">
        <Card className="text-center">
          {loading ? (
            <>
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary-600" />
              <p className="text-navy-400">Confirming your payment…</p>
            </>
          ) : error ? (
            <>
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
                <XCircle className="h-7 w-7 text-red-600" />
              </div>
              <h1 className="mb-2 font-display text-2xl font-extrabold text-navy-800">
                Something went wrong
              </h1>
              <p className="mb-6 text-sm text-navy-400">{error}</p>
              <Button variant="outline" onClick={() => void fetchStatus()}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Try again
              </Button>
            </>
          ) : data?.status === 'ACTIVE' ? (
            <>
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary-50">
                <CheckCircle className="h-7 w-7 text-secondary-600" />
              </div>
              <h1 className="mb-2 font-display text-2xl font-extrabold text-navy-800">
                Access activated
              </h1>
              <p className="mb-2 text-navy-400">
                Your <span className="font-semibold text-navy-800">{data.plan.name}</span> pass is
                ready.
              </p>
              {endsAtLabel && (
                <p className="mb-6 text-sm text-navy-400">Access until {endsAtLabel}</p>
              )}
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/dashboard/library" className="flex-1">
                  <Button fullWidth>
                    <BookOpen className="mr-2 h-4 w-4" />
                    Browse library
                  </Button>
                </Link>
                <Link href="/dashboard" className="flex-1">
                  <Button variant="outline" fullWidth>
                    Dashboard
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
                <Clock className="h-7 w-7 text-primary-600" />
              </div>
              <h1 className="mb-2 font-display text-2xl font-extrabold text-navy-800">
                Payment pending
              </h1>
              <p className="mb-6 text-sm text-navy-400">
                {pollAttempts >= MAX_POLL_ATTEMPTS
                  ? 'Still waiting for confirmation. Refresh in a moment, or check your dashboard.'
                  : 'Confirming with Paystack… this usually takes a few seconds.'}
              </p>
              <Link href="/dashboard/library">
                <Button variant="outline">Open library dashboard</Button>
              </Link>
            </>
          )}
        </Card>
      </div>
    </main>
  );
}
