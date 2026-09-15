'use client';

import { useCallback, useEffect, useState } from 'react';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { useToast } from '@/components/admin/ToastProvider';
import { adminJson } from '@/lib/admin/api-client';

type SubscriptionStatus = 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'CANCELLED';

interface AdminSubscription {
  id: string;
  status: SubscriptionStatus;
  startsAt: string | null;
  endsAt: string | null;
  amountUsd: number;
  createdAt: string;
  paymentReference?: string | null;
  user: { id: string; email: string; name: string | null };
  plan: { id: string; name: string; code: string };
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

function statusVariant(status: SubscriptionStatus) {
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

export default function AdminSubscriptionsPage() {
  const { showToast } = useToast();
  const [items, setItems] = useState<AdminSubscription[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<SubscriptionStatus | ''>('');

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      const res = await adminJson<{
        success: boolean;
        data: { items: AdminSubscription[] };
      }>(`/api/admin/subscriptions?${params.toString()}`);
      setItems(res.data.items);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to load subscriptions', 'error');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, showToast]);

  useEffect(() => {
    void fetchItems();
  }, [fetchItems]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-navy-400">
          Prepaid library passes — {items.length} shown
        </p>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as SubscriptionStatus | '')}
          className="rounded-xl border border-border bg-white px-3 py-2 text-sm font-semibold text-navy-700"
        >
          <option value="">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="PENDING">Pending</option>
          <option value="EXPIRED">Expired</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-border bg-soft/60 text-xs uppercase tracking-wide text-navy-400">
            <tr>
              <th className="px-4 py-3 font-semibold">User</th>
              <th className="px-4 py-3 font-semibold">Plan</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Starts</th>
              <th className="px-4 py-3 font-semibold">Ends</th>
              <th className="px-4 py-3 font-semibold">Amount</th>
              <th className="px-4 py-3 font-semibold">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-navy-400">
                  Loading…
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-navy-400">
                  No subscriptions found.
                </td>
              </tr>
            ) : (
              items.map((s) => (
                <tr key={s.id} className="hover:bg-soft/40">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-navy-800">{s.user.email}</div>
                    {s.user.name && (
                      <div className="text-xs text-navy-400">{s.user.name}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-navy-700">{s.plan.name}</td>
                  <td className="px-4 py-3">
                    <StatusBadge label={s.status} variant={statusVariant(s.status)} />
                  </td>
                  <td className="px-4 py-3 text-navy-500">{formatDate(s.startsAt)}</td>
                  <td className="px-4 py-3 text-navy-500">{formatDate(s.endsAt)}</td>
                  <td className="px-4 py-3 font-semibold text-navy-800">
                    ${Number(s.amountUsd).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-navy-500">{formatDate(s.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
