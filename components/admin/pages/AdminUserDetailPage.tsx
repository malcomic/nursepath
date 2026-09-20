'use client';

import { Fragment, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { useToast } from '@/components/admin/ToastProvider';
import { adminJson } from '@/lib/admin/api-client';

type SubscriptionStatus = 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
type PaymentStatus = 'PAID' | 'PENDING' | 'FAILED' | 'REFUNDED';

interface AdminUserDetail {
  user: {
    id: string;
    name: string | null;
    email: string;
    emailVerified: string | null;
    createdAt: string;
  };
  subscriptions: Array<{
    id: string;
    status: SubscriptionStatus;
    startsAt: string | null;
    endsAt: string | null;
    amountUsd: number;
    paymentReference: string | null;
    createdAt: string;
    plan: { name: string; code: string };
    downloads: Array<{
      downloadedAt: string;
      contentDocument: { title: string; type: string };
    }>;
  }>;
  orders: Array<{
    id: string;
    price: number;
    paymentStatus: PaymentStatus;
    createdAt: string;
    downloadCount: number;
    maxDownloads: number;
    downloadExpiresAt: string;
    guide: { title: string };
  }>;
}

function formatDate(value: string | null) {
  if (!value) return '—';
  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function subscriptionVariant(status: SubscriptionStatus) {
  switch (status) {
    case 'ACTIVE':
      return 'success' as const;
    case 'PENDING':
      return 'warning' as const;
    case 'EXPIRED':
    case 'CANCELLED':
      return 'danger' as const;
    default:
      return 'neutral' as const;
  }
}

function paymentVariant(status: PaymentStatus) {
  switch (status) {
    case 'PAID':
      return 'success' as const;
    case 'PENDING':
      return 'warning' as const;
    case 'FAILED':
    case 'REFUNDED':
      return 'danger' as const;
    default:
      return 'neutral' as const;
  }
}

export default function AdminUserDetailPage({ userId }: { userId: string }) {
  const { showToast } = useToast();
  const [data, setData] = useState<AdminUserDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDetail = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminJson<{ success: boolean; data: AdminUserDetail }>(
        `/api/admin/users/${userId}`
      );
      setData(res.data);
    } catch (err) {
      setData(null);
      showToast(err instanceof Error ? err.message : 'Failed to load user', 'error');
    } finally {
      setLoading(false);
    }
  }, [userId, showToast]);

  useEffect(() => {
    void fetchDetail();
  }, [fetchDetail]);

  if (loading) {
    return <p className="text-sm text-navy-400">Loading user…</p>;
  }

  if (!data) {
    return (
      <div className="space-y-4">
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-600 hover:text-navy-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to users
        </Link>
        <p className="text-sm text-navy-400">User not found.</p>
      </div>
    );
  }

  const { user, subscriptions, orders } = data;

  return (
    <div className="space-y-8">
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-600 hover:text-navy-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to users
      </Link>

      <section className="rounded-2xl border border-border bg-white p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-navy-400">
          Profile
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="text-xs text-navy-400">Name</div>
            <div className="mt-1 font-semibold text-navy-800">{user.name || '—'}</div>
          </div>
          <div>
            <div className="text-xs text-navy-400">Email</div>
            <div className="mt-1 font-semibold text-navy-800">{user.email}</div>
          </div>
          <div>
            <div className="text-xs text-navy-400">Joined</div>
            <div className="mt-1 text-navy-700">{formatDate(user.createdAt)}</div>
          </div>
          <div>
            <div className="text-xs text-navy-400">Email verified</div>
            <div className="mt-1">
              {user.emailVerified ? (
                <StatusBadge label="Verified" variant="success" />
              ) : (
                <StatusBadge label="Unverified" variant="neutral" />
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-navy-400">
          Subscription history
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-border bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-border bg-soft/60 text-xs uppercase tracking-wide text-navy-400">
              <tr>
                <th className="px-4 py-3 font-semibold">Plan</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Starts</th>
                <th className="px-4 py-3 font-semibold">Ends</th>
                <th className="px-4 py-3 font-semibold">Amount</th>
                <th className="px-4 py-3 font-semibold">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-navy-400">
                    No subscriptions yet.
                  </td>
                </tr>
              ) : (
                subscriptions.map((s) => (
                  <Fragment key={s.id}>
                    <tr className="hover:bg-soft/40">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-navy-800">{s.plan.name}</div>
                        <div className="text-xs text-navy-400">{s.plan.code}</div>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge
                          label={s.status}
                          variant={subscriptionVariant(s.status)}
                        />
                      </td>
                      <td className="px-4 py-3 text-navy-500">
                        {formatDate(s.startsAt)}
                      </td>
                      <td className="px-4 py-3 text-navy-500">{formatDate(s.endsAt)}</td>
                      <td className="px-4 py-3 font-semibold text-navy-800">
                        ${Number(s.amountUsd).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-navy-500">
                        {formatDate(s.createdAt)}
                      </td>
                    </tr>
                    {s.downloads.length > 0 && (
                      <tr className="bg-soft/30">
                        <td colSpan={6} className="px-4 py-3">
                          <div className="text-xs font-semibold uppercase tracking-wide text-navy-400">
                            Downloads ({s.downloads.length})
                          </div>
                          <ul className="mt-2 space-y-1.5">
                            {s.downloads.map((d, idx) => (
                              <li
                                key={`${s.id}-dl-${idx}`}
                                className="flex flex-wrap items-baseline justify-between gap-2 text-sm text-navy-700"
                              >
                                <span>
                                  {d.contentDocument.title}{' '}
                                  <span className="text-xs text-navy-400">
                                    ({d.contentDocument.type})
                                  </span>
                                </span>
                                <span className="text-xs text-navy-400">
                                  {formatDate(d.downloadedAt)}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-navy-400">
          Purchase history
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-border bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-border bg-soft/60 text-xs uppercase tracking-wide text-navy-400">
              <tr>
                <th className="px-4 py-3 font-semibold">Guide</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 font-semibold">Payment</th>
                <th className="px-4 py-3 font-semibold">Downloads</th>
                <th className="px-4 py-3 font-semibold">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-navy-400">
                    No guide purchases yet.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className="hover:bg-soft/40">
                    <td className="px-4 py-3 font-semibold text-navy-800">
                      {o.guide.title}
                    </td>
                    <td className="px-4 py-3 text-navy-700">
                      ${Number(o.price).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge
                        label={o.paymentStatus}
                        variant={paymentVariant(o.paymentStatus)}
                      />
                    </td>
                    <td className="px-4 py-3 text-navy-500">
                      {o.downloadCount}/{o.maxDownloads}
                    </td>
                    <td className="px-4 py-3 text-navy-500">
                      {formatDate(o.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
