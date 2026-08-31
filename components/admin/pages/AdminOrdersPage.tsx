'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, Filter, Eye, Mail, RefreshCw, Trash2 } from 'lucide-react';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { ConfirmModal } from '@/components/admin/ConfirmModal';
import { useToast } from '@/components/admin/ToastProvider';
import { adminJson } from '@/lib/admin/api-client';

type PaymentStatus = 'PAID' | 'PENDING' | 'FAILED' | 'REFUNDED';
type DownloadStatus = 'NOT_DOWNLOADED' | 'DOWNLOADED' | 'EXPIRED';

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  guideId: string;
  price: number;
  paymentStatus: PaymentStatus;
  paymentReference?: string | null;
  paymentProvider?: string | null;
  downloadToken: string;
  downloadExpiresAt: string;
  downloadCount: number;
  maxDownloads: number;
  ipAddress?: string | null;
  createdAt: string;
  updatedAt: string;
  guide?: { title: string };
}

interface OrdersResponse {
  success: boolean;
  data: { items: Order[]; total: number; page: number; limit: number };
}

type SortOption = 'newest' | 'oldest' | 'highest_price' | 'lowest_price';

export default function AdminOrdersPage() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | ''>('');
  const [sort, setSort] = useState<SortOption>('newest');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmRefundId, setConfirmRefundId] = useState<string | null>(null);

  const pageSize = 20;

  const downloadStatusFor = (order: Order): DownloadStatus => {
    const expires = new Date(order.downloadExpiresAt);
    const now = new Date();
    if (expires <= now || order.downloadCount >= order.maxDownloads) return 'EXPIRED';
    if (order.downloadCount === 0) return 'NOT_DOWNLOADED';
    return 'DOWNLOADED';
  };

  const paymentBadgeVariant = (status: PaymentStatus) => {
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
  };

  const downloadBadgeVariant = (status: DownloadStatus) => {
    switch (status) {
      case 'NOT_DOWNLOADED':
        return 'warning' as const;
      case 'DOWNLOADED':
        return 'success' as const;
      case 'EXPIRED':
        return 'danger' as const;
      default:
        return 'neutral' as const;
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('sort', sort);
      if (search.trim()) params.set('search', search.trim());
      if (statusFilter) params.set('status', statusFilter);
      if (dateFrom) params.set('dateFrom', dateFrom);
      if (dateTo) params.set('dateTo', dateTo);

      const res = await adminJson<OrdersResponse>(`/api/admin/orders?${params.toString()}`);
      setOrders(res.data.items || []);
      setTotal(res.data.total || 0);
    } catch {
      showToast('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sort]);

  const totalPages = useMemo(() => (total ? Math.ceil(total / pageSize) : 1), [total]);

  const handleResendLink = async (orderId: string) => {
    try {
      await adminJson(`/api/admin/orders/${orderId}/resend-link`, { method: 'POST' });
      showToast('Download link resent', 'success');
    } catch {
      showToast('Failed to resend link', 'error');
    }
  };

  const handleRegenerateLink = async (orderId: string) => {
    try {
      const res = await adminJson<{ success: boolean; data: Order }>(
        `/api/admin/orders/${orderId}/regenerate-link`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' }
      );
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, ...res.data } : o)));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((o) => (o ? { ...o, ...res.data } : o));
      }
      showToast('Download link regenerated', 'success');
    } catch {
      showToast('Failed to regenerate link', 'error');
    }
  };

  const handleDeleteOrder = async () => {
    if (!confirmDeleteId) return;
    try {
      await adminJson(`/api/admin/orders/${confirmDeleteId}`, { method: 'DELETE' });
      setOrders((prev) => prev.filter((o) => o.id !== confirmDeleteId));
      showToast('Order deleted', 'success');
    } catch {
      showToast('Failed to delete order', 'error');
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const handleRefundOrder = async () => {
    if (!confirmRefundId) return;
    try {
      const res = await adminJson<{ success: boolean; data: Order }>(
        `/api/admin/orders/${confirmRefundId}/refund`,
        { method: 'POST' }
      );
      setOrders((prev) =>
        prev.map((o) => (o.id === confirmRefundId ? { ...o, ...res.data } : o))
      );
      showToast('Order marked as refunded', 'success');
    } catch {
      showToast('Failed to mark refund', 'error');
    } finally {
      setConfirmRefundId(null);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm mb-5">
      <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-2 text-sm text-slate-600">
        <span className="font-semibold text-slate-900">Orders</span>
        <span className="text-slate-400">•</span>
        <span>{total} total</span>
      </div>

      <div className="px-6 py-4 border-b border-slate-100 space-y-3 md:space-y-0 md:flex md:items-center md:gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID, customer name, or email"
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as PaymentStatus | '')}
            className="pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="">All payments</option>
            <option value="PAID">Paid</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
            <option value="REFUNDED">Refunded</option>
          </select>
          <Filter className="w-3 h-3 text-slate-500" />
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="px-2 py-2 rounded-xl border border-slate-200 text-xs"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="px-2 py-2 rounded-xl border border-slate-200 text-xs"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="highest_price">Highest price</option>
            <option value="lowest_price">Lowest price</option>
          </select>
          <button
            type="button"
            onClick={() => {
              setPage(1);
              fetchOrders();
            }}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700"
          >
            Apply
          </button>
        </div>
      </div>

      <div className="p-4 overflow-x-auto">
        {loading ? (
          <div className="py-12 text-center text-sm text-slate-500">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-500">No orders found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
                <th className="px-4 py-3 text-left">Order</th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Guide</th>
                <th className="px-4 py-3 text-right">Price</th>
                <th className="px-4 py-3 text-left">Payment</th>
                <th className="px-4 py-3 text-left">Download</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const dStatus = downloadStatusFor(order);
                return (
                  <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50/80">
                    <td className="px-4 py-3 font-mono text-xs">{order.id.slice(0, 8)}…</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold">{order.customerName}</div>
                      <div className="text-xs text-slate-500">{order.customerEmail}</div>
                    </td>
                    <td className="px-4 py-3">{order.guide?.title || 'Guide'}</td>
                    <td className="px-4 py-3 text-right font-semibold">${order.price.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge
                        label={order.paymentStatus}
                        variant={paymentBadgeVariant(order.paymentStatus)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge label={dStatus} variant={downloadBadgeVariant(dStatus)} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 rounded-lg text-slate-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleResendLink(order.id)}
                          className="p-2 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50"
                        >
                          <Mail size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmRefundId(order.id)}
                          className="p-2 rounded-lg text-slate-600 hover:text-amber-700 hover:bg-amber-50"
                        >
                          <RefreshCw size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(order.id)}
                          className="p-2 rounded-lg text-slate-600 hover:text-rose-700 hover:bg-rose-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40"
            >
              Prev
            </button>
            <button
              type="button"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="bg-white max-w-2xl w-full rounded-2xl shadow-xl border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Order Details</h2>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="text-slate-500 hover:text-slate-900 text-sm font-semibold"
              >
                Close
              </button>
            </div>
            <div className="px-6 py-5 space-y-4 text-sm">
              <p>
                <strong>Customer:</strong> {selectedOrder.customerName} ({selectedOrder.customerEmail})
              </p>
              <p>
                <strong>Guide:</strong> {selectedOrder.guide?.title || 'Guide'}
              </p>
              <p>
                <strong>Downloads:</strong> {selectedOrder.downloadCount} / {selectedOrder.maxDownloads}
              </p>
              <p className="font-mono text-xs break-all">
                Token: {selectedOrder.downloadToken}
              </p>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex flex-wrap gap-2 justify-end">
              <button
                type="button"
                onClick={() => handleResendLink(selectedOrder.id)}
                className="px-3 py-2 rounded-xl text-xs font-semibold border border-emerald-200 text-emerald-700"
              >
                Resend Link
              </button>
              <button
                type="button"
                onClick={() => handleRegenerateLink(selectedOrder.id)}
                className="px-3 py-2 rounded-xl text-xs font-semibold border border-blue-200 text-blue-700"
              >
                Regenerate Link
              </button>
              <button
                type="button"
                onClick={() => setConfirmRefundId(selectedOrder.id)}
                className="px-3 py-2 rounded-xl text-xs font-semibold border border-amber-200 text-amber-700"
              >
                Mark Refunded
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!confirmDeleteId}
        tone="danger"
        title="Delete order?"
        description={<p>This will permanently delete the order.</p>}
        confirmLabel="Delete order"
        onConfirm={handleDeleteOrder}
        onCancel={() => setConfirmDeleteId(null)}
      />

      <ConfirmModal
        open={!!confirmRefundId}
        title="Mark order as refunded?"
        description={<p>Payment status will be set to REFUNDED.</p>}
        confirmLabel="Mark as refunded"
        onConfirm={handleRefundOrder}
        onCancel={() => setConfirmRefundId(null)}
      />
    </div>
  );
}
