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

export default function MyGuidesClient() {
  const [purchases, setPurchases] = useState<DashboardOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/dashboard/orders');
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Unable to load purchases.');
      }
      setPurchases(json.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load purchases.');
      setPurchases([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchOrders();
  }, [fetchOrders]);

  const filtered = searchQuery
    ? purchases.filter((p) =>
        p.guide.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : purchases;

  return (
    <div>
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-navy-300" />
          <Input
            placeholder="Search your guides..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12"
          />
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary-600" />
          <p className="text-navy-400">Loading your purchases…</p>
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((purchase) => (
            <Card key={purchase.id} hover className="flex flex-col">
              {purchase.guide.thumbnailUrl ? (
                <div className="relative mb-4 h-48 w-full overflow-hidden rounded-xl bg-navy-50">
                  <Image
                    src={purchase.guide.thumbnailUrl}
                    alt={purchase.guide.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              ) : (
                <div className="mb-4 flex h-48 w-full items-center justify-center rounded-xl bg-gradient-to-br from-primary-100 to-primary-50">
                  <FileText className="h-16 w-16 text-primary-600" />
                </div>
              )}

              <h3 className="mb-2 line-clamp-2 font-display text-xl font-bold text-navy-800">
                {purchase.guide.title}
              </h3>

              {purchase.guide.description && (
                <p className="mb-4 line-clamp-2 flex-grow text-sm text-navy-400">
                  {purchase.guide.description}
                </p>
              )}

              <div className="mb-4 flex items-center gap-2 text-sm text-navy-400">
                <Calendar className="h-4 w-4" />
                <span>
                  Purchased{' '}
                  {new Date(purchase.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>

              <div className="mt-auto space-y-2">
                {purchase.downloadUrl ? (
                  <a href={purchase.downloadUrl} className="block">
                    <Button fullWidth>
                      <Download className="mr-2 h-5 w-5" />
                      Download
                    </Button>
                  </a>
                ) : (
                  <div className="space-y-2">
                    <Button fullWidth disabled>
                      <Download className="mr-2 h-5 w-5" />
                      Download unavailable
                    </Button>
                    <p className="text-center text-xs text-navy-400">
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
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Order details
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="py-16 text-center">
          <FileText className="mx-auto mb-4 h-16 w-16 text-navy-300" />
          <h3 className="mb-2 font-display text-2xl font-bold text-navy-800">
            No Purchases Yet
          </h3>
          <p className="mb-6 text-navy-400">
            {searchQuery
              ? 'No guides found matching your search.'
              : 'No study guides purchased with this account email yet. Sign in with the same email you used at checkout.'}
          </p>
          <Link href="/services">
            <Button>Browse Study Guides</Button>
          </Link>
        </Card>
      )}
    </div>
  );
}
