'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  CheckCircle,
  Download,
  FileText,
  ArrowRight,
  Clock,
  XCircle,
  RefreshCw,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface OrderItem {
  id: string;
  paymentStatus: 'PAID' | 'PENDING' | 'FAILED' | 'REFUNDED';
  guide: { id: string; title: string; price: number };
  downloadUrl: string | null;
}

interface OrderData extends OrderItem {
  items?: OrderItem[];
}

const POLL_INTERVAL_MS = 1500;
const MAX_POLL_ATTEMPTS = 20;

export default function PaymentSuccessClient() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<OrderData | null>(null);
  const [pollAttempts, setPollAttempts] = useState(0);

  const fetchStatus = useCallback(async () => {
    if (!orderId) return;

    try {
      setError(null);
      const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}`);
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
  }, [orderId]);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      setError('Missing order id.');
      return;
    }
    fetchStatus();
  }, [orderId, fetchStatus]);

  useEffect(() => {
    if (!orderId || data?.paymentStatus !== 'PENDING') return;
    if (pollAttempts >= MAX_POLL_ATTEMPTS) return;

    const timer = window.setTimeout(() => {
      setPollAttempts((n) => n + 1);
      fetchStatus();
    }, POLL_INTERVAL_MS);

    return () => window.clearTimeout(timer);
  }, [data?.paymentStatus, orderId, pollAttempts, fetchStatus]);

  const items = data?.items?.length ? data.items : data ? [data] : [];

  const statusLabel = useMemo(() => {
    switch (data?.paymentStatus) {
      case 'PAID':
        return { text: 'Payment successful', tone: 'success' as const };
      case 'PENDING':
        return { text: 'Confirming payment…', tone: 'pending' as const };
      case 'FAILED':
        return { text: 'Payment failed', tone: 'error' as const };
      case 'REFUNDED':
        return { text: 'Payment refunded', tone: 'error' as const };
      default:
        return { text: 'Loading…', tone: 'pending' as const };
    }
  }, [data?.paymentStatus]);

  const pollTimedOut = data?.paymentStatus === 'PENDING' && pollAttempts >= MAX_POLL_ATTEMPTS;
  const total = items.reduce((sum, i) => sum + Number(i.guide.price), 0);

  return (
    <main className="flex-grow bg-soft py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          {statusLabel.tone === 'success' ? (
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-secondary-100">
              <CheckCircle className="h-12 w-12 text-secondary-600" />
            </div>
          ) : statusLabel.tone === 'pending' ? (
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
              <Clock className="h-12 w-12 text-amber-600" />
            </div>
          ) : (
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
              <XCircle className="h-12 w-12 text-red-600" />
            </div>
          )}

          <h1 className="mb-4 font-display text-4xl font-extrabold text-navy-800 sm:text-5xl">
            {statusLabel.text}
          </h1>
          <p className="mb-2 text-xl text-navy-400">
            {data?.paymentStatus === 'PAID'
              ? items.length > 1
                ? 'Your study guides are ready to download.'
                : 'Your study guide is ready to download.'
              : data?.paymentStatus === 'PENDING'
                ? pollTimedOut
                  ? 'Payment confirmation is taking longer than expected.'
                  : 'This can take a few seconds after checkout.'
                : 'Please try purchasing again or contact support.'}
          </p>
          {orderId && (
            <p className="text-navy-300">
              Order ID: <span className="font-semibold">{orderId}</span>
            </p>
          )}
        </div>

        <Card className="mb-8">
          <h2 className="mb-6 font-display text-2xl font-bold text-navy-800">Order Details</h2>
          {loading ? (
            <div className="text-sm text-navy-400">Loading order…</div>
          ) : error ? (
            <div className="text-sm text-red-600">{error}</div>
          ) : items.length > 0 ? (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b border-border py-4 last:border-0"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary-50">
                      <FileText className="h-8 w-8 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-navy-800">{item.guide.title}</h3>
                      <p className="text-sm text-navy-400">Study Guide - PDF</p>
                    </div>
                  </div>
                  <p className="font-bold text-navy-800">
                    {item.guide.price === 0 ? 'FREE' : `$${Number(item.guide.price).toFixed(2)}`}
                  </p>
                </div>
              ))}
              <div className="flex items-center justify-between pt-2">
                <span className="font-display text-lg font-bold text-navy-800">Total</span>
                <span className="font-display text-2xl font-extrabold text-navy-800">
                  {total === 0 ? 'FREE' : `$${total.toFixed(2)}`}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-sm text-navy-400">No order data.</div>
          )}
        </Card>

        <Card className="mb-8">
          <h2 className="mb-6 font-display text-2xl font-bold text-navy-800">Download</h2>
          <p className="mb-6 text-navy-400">
            Downloads are enabled once payment is confirmed. A copy of your download link has also
            been sent to your email. You can reclaim purchases anytime on your dashboard using the
            same email you used at checkout.
          </p>
          <div className="space-y-3">
            {items.filter((i) => i.downloadUrl).map((item) => (
              <a key={item.id} href={item.downloadUrl!} className="block">
                <Button fullWidth size="lg" className="group">
                  <Download className="mr-2 h-5 w-5" />
                  Download {item.guide.title}
                </Button>
              </a>
            ))}
            {data?.paymentStatus === 'PENDING' && (
              <Button fullWidth size="lg" disabled>
                <Download className="mr-2 h-5 w-5" />
                {pollTimedOut ? 'Still waiting for confirmation…' : 'Waiting for confirmation…'}
              </Button>
            )}
            {pollTimedOut && (
              <Button variant="outline" fullWidth onClick={() => fetchStatus()}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Check again
              </Button>
            )}
            <Link href="/dashboard" className="block">
              <Button variant="outline" fullWidth>
                View in Dashboard
              </Button>
            </Link>
          </div>
        </Card>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Link href="/services" className="flex-1">
            <Button variant="outline" fullWidth size="lg" className="group">
              Browse More Guides
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/dashboard" className="flex-1">
            <Button fullWidth size="lg">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
