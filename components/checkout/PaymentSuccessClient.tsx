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

interface OrderData {
  id: string;
  paymentStatus: 'PAID' | 'PENDING' | 'FAILED' | 'REFUNDED';
  guide: { id: string; title: string; price: number };
  downloadUrl: string | null;
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

  const pollTimedOut =
    data?.paymentStatus === 'PENDING' && pollAttempts >= MAX_POLL_ATTEMPTS;

  return (
    <main className="bg-gray-50 flex-grow py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          {statusLabel.tone === 'success' ? (
            <div className="w-20 h-20 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-secondary-600" />
            </div>
          ) : statusLabel.tone === 'pending' ? (
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-12 h-12 text-amber-600" />
            </div>
          ) : (
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
          )}

          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
            {statusLabel.text}
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            {data?.paymentStatus === 'PAID'
              ? 'Your study guide is ready to download.'
              : data?.paymentStatus === 'PENDING'
                ? pollTimedOut
                  ? 'Payment confirmation is taking longer than expected.'
                  : 'This can take a few seconds after checkout.'
                : 'Please try purchasing again or contact support.'}
          </p>
          {orderId && (
            <p className="text-gray-500">
              Order ID: <span className="font-semibold">{orderId}</span>
            </p>
          )}
        </div>

        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Details</h2>
          {loading ? (
            <div className="text-sm text-gray-600">Loading order…</div>
          ) : error ? (
            <div className="text-sm text-red-600">{error}</div>
          ) : data ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between py-4 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-8 h-8 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{data.guide.title}</h3>
                    <p className="text-sm text-gray-600">Study Guide - PDF</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">
                    {data.guide.price === 0 ? 'FREE' : `$${data.guide.price.toFixed(2)}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-black text-gray-900">
                  {data.guide.price === 0 ? 'FREE' : `$${data.guide.price.toFixed(2)}`}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-600">No order data.</div>
          )}
        </Card>

        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Download Your Guide</h2>
          <p className="text-gray-600 mb-6">
            Downloads are enabled once payment is confirmed. A copy of your download link has also
            been sent to your email. You can reclaim purchases anytime on your dashboard using the
            same email you used at checkout.
          </p>
          <div className="space-y-3">
            {data?.downloadUrl ? (
              <a href={data.downloadUrl} className="block">
                <Button fullWidth size="lg" className="group">
                  <Download className="w-5 h-5 mr-2" />
                  Download Now
                </Button>
              </a>
            ) : (
              <Button fullWidth size="lg" disabled className="group">
                <Download className="w-5 h-5 mr-2" />
                {data?.paymentStatus === 'PENDING'
                  ? pollTimedOut
                    ? 'Still waiting for confirmation…'
                    : 'Waiting for confirmation…'
                  : 'Download unavailable'}
              </Button>
            )}
            {pollTimedOut && (
              <Button variant="outline" fullWidth onClick={() => fetchStatus()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Check again
              </Button>
            )}
            <Link href="/dashboard" className="block">
              <Button variant="outline" fullWidth>
                View in Dashboard
              </Button>
            </Link>
            <Link href="/reviews#submit" className="block">
              <Button variant="ghost" fullWidth>
                Leave a review
              </Button>
            </Link>
          </div>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/services" className="flex-1">
            <Button variant="outline" fullWidth size="lg" className="group">
              Browse More Guides
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
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
