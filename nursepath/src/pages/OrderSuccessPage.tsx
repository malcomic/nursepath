import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Download, FileText, ArrowRight, Clock, XCircle } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { api } from '../api';

export default function OrderSuccessPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{
    id: string;
    paymentStatus: 'PAID' | 'PENDING' | 'FAILED' | 'REFUNDED';
    guide: { id: string; title: string; price: number };
    downloadUrl: string | null;
  } | null>(null);

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

  const fetchStatus = async () => {
    if (!orderId) return;
    try {
      setError(null);
      const res = await api.get(`/orders/${encodeURIComponent(orderId)}`);
      setData(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load payment status.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      setError('Missing order id.');
      return;
    }
    fetchStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  useEffect(() => {
    if (!orderId) return;
    if (data?.paymentStatus !== 'PENDING') return;

    const t = window.setTimeout(() => {
      fetchStatus();
    }, 1500);

    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.paymentStatus, orderId]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Message */}
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
                  ? 'This can take a few seconds after checkout.'
                  : 'Please try purchasing again or contact support.'}
            </p>
            {orderId && (
              <p className="text-gray-500">
                Order ID: <span className="font-semibold">{orderId}</span>
              </p>
            )}
          </div>

          {/* Order Details */}
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
                    <p className="font-bold text-gray-900">${data.guide.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-black text-gray-900">
                    ${data.guide.price.toFixed(2)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-600">No order data.</div>
            )}
          </Card>

          {/* Download Section */}
          <Card className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Download Your Guide</h2>
            <p className="text-gray-600 mb-6">
              We only enable downloads once Stripe confirms your payment via webhook.
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
                    ? 'Waiting for confirmation…'
                    : 'Download unavailable'}
                </Button>
              )}
              <Link to="/dashboard" className="block">
                <Button variant="outline" fullWidth>
                  View in Dashboard
                </Button>
              </Link>
            </div>
          </Card>

          {/* Next Steps */}
          <Card>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Next?</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-600 font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Download Your Guide</h3>
                  <p className="text-gray-600">Get instant access to your purchased study guide.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-600 font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Start Studying</h3>
                  <p className="text-gray-600">Review the material and create your study plan.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-600 font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Ace Your Exam</h3>
                  <p className="text-gray-600">Use our proven study materials to pass with confidence.</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link to="/services" className="flex-1">
              <Button variant="outline" fullWidth size="lg" className="group">
                Browse More Guides
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/dashboard" className="flex-1">
              <Button fullWidth size="lg">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
