'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  FileText,
  Calendar,
  Search,
  Download,
  ExternalLink,
  Mail,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface DashboardOrder {
  id: string;
  paymentStatus: string;
  createdAt: string;
  canDownload: boolean;
  downloadStatus: string;
  downloadUrl: string | null;
  guide: {
    id: string;
    title: string;
    description?: string | null;
    price: number;
    thumbnailUrl?: string | null;
  };
}

export default function DashboardClient() {
  const [email, setEmail] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [purchases, setPurchases] = useState<DashboardOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPurchases = useCallback(async (lookupEmail: string) => {
    try {
      setFetching(true);
      setError(null);
      const res = await fetch(
        `/api/orders/by-email?email=${encodeURIComponent(lookupEmail)}`
      );
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Unable to load purchases.');
      }
      setPurchases(json.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load purchases.');
      setPurchases([]);
    } finally {
      setFetching(false);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('userEmail');
    if (stored) {
      setEmail(stored);
      setEmailInput(stored);
      fetchPurchases(stored);
    } else {
      setLoading(false);
    }
  }, [fetchPurchases]);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = emailInput.trim().toLowerCase();
    if (!trimmed) return;
    localStorage.setItem('userEmail', trimmed);
    setEmail(trimmed);
    setLoading(true);
    fetchPurchases(trimmed);
  };

  const handleChangeEmail = () => {
    localStorage.removeItem('userEmail');
    setEmail('');
    setEmailInput('');
    setPurchases([]);
    setSearchQuery('');
    setError(null);
  };

  const filtered = searchQuery
    ? purchases.filter((p) =>
        p.guide.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : purchases;

  if (loading) {
    return (
      <main className="flex-grow py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your purchases…</p>
        </div>
      </main>
    );
  }

  if (!email) {
    return (
      <main className="flex-grow py-12 bg-gray-50">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Mail className="w-7 h-7 text-primary-600" />
              </div>
              <h1 className="text-2xl font-black text-gray-900 mb-2">My Purchases</h1>
              <p className="text-gray-600 text-sm">
                Enter the email you used at checkout to view your study guides and download links.
              </p>
            </div>
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                name="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="you@example.com"
                required
              />
              <Button type="submit" fullWidth size="lg" isLoading={fetching}>
                View My Purchases
              </Button>
            </form>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-2">My Dashboard</h1>
            <p className="text-xl text-gray-600">
              Purchases for <span className="font-semibold text-gray-900">{email}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={handleChangeEmail}
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            Use a different email
          </button>
        </div>

        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search your guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12"
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {fetching ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading your purchases…</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((purchase) => (
              <Card key={purchase.id} hover className="flex flex-col">
                {purchase.guide.thumbnailUrl ? (
                  <div className="w-full h-48 bg-gray-100 rounded-xl mb-4 overflow-hidden relative">
                    <Image
                      src={purchase.guide.thumbnailUrl}
                      alt={purchase.guide.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl mb-4 flex items-center justify-center">
                    <FileText className="w-16 h-16 text-primary-600" />
                  </div>
                )}

                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                  {purchase.guide.title}
                </h3>

                {purchase.guide.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                    {purchase.guide.description}
                  </p>
                )}

                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Purchased{' '}
                    {new Date(purchase.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <div className="space-y-2 mt-auto">
                  {purchase.downloadUrl ? (
                    <a href={purchase.downloadUrl} className="block">
                      <Button fullWidth>
                        <Download className="w-5 h-5 mr-2" />
                        Download
                      </Button>
                    </a>
                  ) : (
                    <div className="space-y-2">
                      <Button fullWidth disabled>
                        <Download className="w-5 h-5 mr-2" />
                        Download unavailable
                      </Button>
                      <p className="text-xs text-gray-500 text-center">
                        Link expired.{' '}
                        <Link href="/contact" className="text-primary-600 hover:underline">
                          Contact support
                        </Link>
                      </p>
                    </div>
                  )}
                  <Link
                    href={`/payment-success?order_id=${encodeURIComponent(purchase.id)}`}
                    className="block"
                  >
                    <Button variant="outline" fullWidth>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Order details
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-16">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Purchases Yet</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery
                ? 'No guides found matching your search.'
                : "You haven't purchased any study guides with this email yet."}
            </p>
            <Link href="/services">
              <Button>Browse Study Guides</Button>
            </Link>
          </Card>
        )}
      </div>
    </main>
  );
}
