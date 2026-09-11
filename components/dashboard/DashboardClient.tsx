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
  LogOut,
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
  const [email, setEmail] = useState<string | null>(null);
  const [emailInput, setEmailInput] = useState('');
  const [purchases, setPurchases] = useState<DashboardOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [linkSent, setLinkSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setFetching(true);
      setError(null);
      const res = await fetch('/api/dashboard/orders');
      const json = await res.json();
      if (!res.ok || !json.success) {
        if (res.status === 401) {
          setEmail(null);
          setPurchases([]);
          return;
        }
        throw new Error(json.error || 'Unable to load purchases.');
      }
      setPurchases(json.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load purchases.');
      setPurchases([]);
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    const boot = async () => {
      try {
        const res = await fetch('/api/dashboard/me');
        const json = await res.json();
        const sessionEmail = json?.data?.email as string | null;
        if (sessionEmail) {
          setEmail(sessionEmail);
          await fetchOrders();
        }
      } catch {
        setEmail(null);
      } finally {
        setLoading(false);
      }
    };
    void boot();
  }, [fetchOrders]);

  const handleRequestLink = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = emailInput.trim().toLowerCase();
    if (!trimmed) return;

    try {
      setRequesting(true);
      setError(null);
      setStatusMessage(null);
      const res = await fetch('/api/dashboard/request-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Could not send sign-in link.');
      }
      setLinkSent(true);
      setStatusMessage(
        json.message ||
          'If that email has purchases with us, a sign-in link is on the way. Check your inbox (and spam).'
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send sign-in link.');
      setLinkSent(false);
    } finally {
      setRequesting(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/dashboard/logout', { method: 'POST' });
    setEmail(null);
    setPurchases([]);
    setSearchQuery('');
    setError(null);
    setLinkSent(false);
    setStatusMessage(null);
    setEmailInput('');
  };

  const filtered = searchQuery
    ? purchases.filter((p) =>
        p.guide.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : purchases;

  if (loading) {
    return (
      <main className="flex-grow bg-soft py-12">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary-600" />
          <p className="text-navy-400">Loading your purchases…</p>
        </div>
      </main>
    );
  }

  if (!email) {
    return (
      <main className="flex-grow bg-soft py-12">
        <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8">
          <Card>
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100">
                <Mail className="h-7 w-7 text-primary-600" />
              </div>
              <h1 className="mb-2 font-display text-2xl font-extrabold text-navy-800">
                My Purchases
              </h1>
              <p className="text-sm text-navy-400">
                Enter the email you used at checkout. We&apos;ll send a one-time sign-in link
                (expires in 30 minutes) so you can view downloads securely.
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            {linkSent && statusMessage ? (
              <div className="space-y-4">
                <div className="rounded-lg border border-primary-200 bg-primary-50 px-3 py-3 text-sm text-primary-900">
                  {statusMessage}
                </div>
                <p className="text-xs text-navy-400 text-center">
                  Didn&apos;t get it? Check spam, or{' '}
                  <button
                    type="button"
                    className="font-semibold text-primary-600 hover:text-primary-700"
                    onClick={() => {
                      setLinkSent(false);
                      setStatusMessage(null);
                    }}
                  >
                    try again
                  </button>
                  .
                </p>
              </div>
            ) : (
              <form onSubmit={handleRequestLink} className="space-y-4">
                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
                <Button type="submit" fullWidth size="lg" isLoading={requesting}>
                  Email me a sign-in link
                </Button>
              </form>
            )}
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow bg-soft py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="mb-2 font-display text-4xl font-extrabold text-navy-800 sm:text-5xl">
              My Dashboard
            </h1>
            <p className="text-xl text-navy-400">
              Purchases for <span className="font-semibold text-navy-800">{email}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => void handleLogout()}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>

        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-300 w-5 h-5" />
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
            <p className="text-navy-400">Loading your purchases…</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((purchase) => (
              <Card key={purchase.id} hover className="flex flex-col">
                {purchase.guide.thumbnailUrl ? (
                  <div className="w-full h-48 bg-navy-50 rounded-xl mb-4 overflow-hidden relative">
                    <Image
                      src={purchase.guide.thumbnailUrl}
                      alt={purchase.guide.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-primary-100 to-primary-50 rounded-xl mb-4 flex items-center justify-center">
                    <FileText className="w-16 h-16 text-primary-600" />
                  </div>
                )}

                <h3 className="font-display text-xl font-bold text-navy-800 mb-2 line-clamp-2">
                  {purchase.guide.title}
                </h3>

                {purchase.guide.description && (
                  <p className="text-navy-400 text-sm mb-4 line-clamp-2 flex-grow">
                    {purchase.guide.description}
                  </p>
                )}

                <div className="flex items-center gap-2 text-sm text-navy-400 mb-4">
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
                      <p className="text-xs text-navy-400 text-center">
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
            <FileText className="w-16 h-16 text-navy-300 mx-auto mb-4" />
            <h3 className="font-display text-2xl font-bold text-navy-800 mb-2">No Purchases Yet</h3>
            <p className="text-navy-400 mb-6">
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
