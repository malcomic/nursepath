import { useEffect, useMemo, useState } from 'react';
import { Search, Filter, ChevronDown, Eye, Mail, RefreshCw, Trash2, MoreVertical } from 'lucide-react';
import { api } from '../../api';
import AdminLayout from '../../components/layout/AdminLayout';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { ConfirmModal } from '../../components/admin/ConfirmModal';
import { useToast } from '../../components/admin/ToastProvider';

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
  guide?: {
    title: string;
  };
}

interface OrdersResponse {
  items: Order[];
  total: number;
  page: number;
  limit: number;
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

      const res = await api.get(`/orders?${params.toString()}`, true);
      const data = res.data as OrdersResponse;
      setOrders(data.items || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Failed to load orders:', error);
      showToast('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sort]);

  const totalPages = useMemo(
    () => (total ? Math.ceil(total / pageSize) : 1),
    [total]
  );

  const handleApplyFilters = () => {
    setPage(1);
    fetchOrders();
  };

  const handleClearFilters = () => {
    setSearch('');
    setStatusFilter('');
    setDateFrom('');
    setDateTo('');
    setSort('newest');
    setPage(1);
    fetchOrders();
  };

  const handleResendLink = async (orderId: string) => {
    try {
      await api.post(`/orders/${orderId}/resend-link`, {}, true);
      showToast('Download link resent', 'success');
    } catch (error) {
      console.error('Failed to resend link:', error);
      showToast('Failed to resend link', 'error');
    }
  };

  const handleDeleteOrder = async () => {
    if (!confirmDeleteId) return;
    try {
      await api.delete(`/orders/${confirmDeleteId}`, true);
      setOrders((prev) => prev.filter((o) => o.id !== confirmDeleteId));
      showToast('Order deleted', 'success');
    } catch (error) {
      console.error('Failed to delete order:', error);
      showToast('Failed to delete order', 'error');
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const handleRefundOrder = async () => {
    if (!confirmRefundId) return;
    try {
      const res = await api.post(`/orders/${confirmRefundId}/refund`, {}, true);
      const updated = res.data;
      setOrders((prev) =>
        prev.map((o) => (o.id === confirmRefundId ? { ...o, ...updated } : o))
      );
      showToast('Order marked as refunded', 'success');
    } catch (error) {
      console.error('Failed to mark refund:', error);
      showToast('Failed to mark refund', 'error');
    } finally {
      setConfirmRefundId(null);
    }
  };

  const renderDesktopTable = () => (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wide">
            <th className="px-4 py-3 text-left">Order ID</th>
            <th className="px-4 py-3 text-left">Customer</th>
            <th className="px-4 py-3 text-left">Guide</th>
            <th className="px-4 py-3 text-right">Price</th>
            <th className="px-4 py-3 text-left">Payment</th>
            <th className="px-4 py-3 text-left">Download</th>
            <th className="px-4 py-3 text-left">Purchase Date</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const dStatus = downloadStatusFor(order);
            return (
              <tr
                key={order.id}
                className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors"
              >
                <td className="px-4 py-3 font-mono text-xs text-slate-500">
                  {order.id.slice(0, 8)}…
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm font-semibold text-slate-900">
                    {order.customerName}
                  </div>
                  <div className="text-xs text-slate-500">{order.customerEmail}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm text-slate-900">
                    {order.guide?.title || 'Guide'}
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-semibold text-slate-900">
                  ${order.price.toFixed(2)}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge
                    label={order.paymentStatus}
                    variant={paymentBadgeVariant(order.paymentStatus)}
                  />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge
                    label={dStatus}
                    variant={downloadBadgeVariant(dStatus)}
                  />
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">
                  {new Date(order.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 rounded-lg text-slate-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleResendLink(order.id)}
                      className="p-2 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50"
                    >
                      <Mail size={16} />
                    </button>
                    <button
                      onClick={() => setConfirmRefundId(order.id)}
                      className="p-2 rounded-lg text-slate-600 hover:text-amber-700 hover:bg-amber-50"
                    >
                      <RefreshCw size={16} />
                    </button>
                    <button
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
    </div>
  );

  const renderMobileList = () => (
    <div className="md:hidden space-y-3">
      {orders.map((order) => {
        const dStatus = downloadStatusFor(order);
        return (
          <div
            key={order.id}
            className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-mono text-slate-400 mb-1">
                  {order.id.slice(0, 10)}…
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  {order.customerName}
                </p>
                <p className="text-xs text-slate-500">{order.customerEmail}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-900">
                  ${order.price.toFixed(2)}
                </p>
                <p className="text-[11px] text-slate-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-col gap-1">
                <StatusBadge
                  label={order.paymentStatus}
                  variant={paymentBadgeVariant(order.paymentStatus)}
                />
                <StatusBadge
                  label={dStatus}
                  variant={downloadBadgeVariant(dStatus)}
                />
              </div>
              <div className="relative">
                <button className="p-2 rounded-lg border border-slate-200 text-slate-600">
                  <MoreVertical size={16} />
                </button>
                {/* For brevity: actions use full buttons below instead of dropdown content */}
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setSelectedOrder(order)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 border border-slate-200"
              >
                View
              </button>
              <button
                onClick={() => handleResendLink(order.id)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-700 border border-emerald-200"
              >
                Resend
              </button>
              <button
                onClick={() => setConfirmRefundId(order.id)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-amber-700 border border-amber-200"
              >
                Refund
              </button>
              <button
                onClick={() => setConfirmDeleteId(order.id)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-700 border border-rose-200"
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <AdminLayout title="Orders">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm mb-5">
        <div className="px-6 py-4 border-b border-slate-200 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="font-semibold text-slate-900">Orders</span>
            <span className="text-slate-400">•</span>
            <span>{total} total</span>
          </div>
        </div>

        {/* Filters */}
        <div className="px-6 py-4 border-b border-slate-100 space-y-3 md:space-y-0 md:flex md:items-center md:gap-3">
          <div className="flex-1 flex items-center gap-2">
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
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as PaymentStatus | '')}
                className="appearance-none pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
              >
                <option value="">All payments</option>
                <option value="PAID">Paid</option>
                <option value="PENDING">Pending</option>
                <option value="FAILED">Failed</option>
                <option value="REFUNDED">Refunded</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <Filter className="w-3 h-3" />
              <span>Date range</span>
            </div>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-2 py-2 rounded-xl border border-slate-200 text-xs"
            />
            <span className="text-xs text-slate-400">–</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-2 py-2 rounded-xl border border-slate-200 text-xs"
            />
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="appearance-none pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="highest_price">Highest price</option>
                <option value="lowest_price">Lowest price</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <button
              onClick={handleApplyFilters}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700"
            >
              Apply
            </button>
            <button
              onClick={handleClearFilters}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Table / Cards */}
        <div className="p-4">
          {loading ? (
            <div className="py-12 text-center text-sm text-slate-500">
              Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-500">
              No orders found for the current filters.
            </div>
          ) : (
            <>
              {renderDesktopTable()}
              {renderMobileList()}
            </>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div>
              Page {page} of {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40"
              >
                Prev
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order detail modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="bg-white max-w-2xl w-full rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Order Details</h2>
                <p className="text-xs text-slate-500">
                  Order ID: <span className="font-mono">{selectedOrder.id}</span>
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-slate-500 hover:text-slate-900 text-sm font-semibold"
              >
                Close
              </button>
            </div>
            <div className="px-6 py-5 space-y-5 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-xs font-semibold text-slate-500 uppercase mb-1">
                    Customer
                  </h3>
                  <p className="font-semibold text-slate-900">
                    {selectedOrder.customerName}
                  </p>
                  <p className="text-slate-600">{selectedOrder.customerEmail}</p>
                  {selectedOrder.customerPhone && (
                    <p className="text-slate-600">{selectedOrder.customerPhone}</p>
                  )}
                  {selectedOrder.ipAddress && (
                    <p className="text-xs text-slate-400 mt-1">
                      IP: {selectedOrder.ipAddress}
                    </p>
                  )}
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-slate-500 uppercase mb-1">
                    Purchase
                  </h3>
                  <p className="font-semibold text-slate-900">
                    {selectedOrder.guide?.title || 'Guide'}
                  </p>
                  <p className="text-slate-600">
                    Price: ${selectedOrder.price.toFixed(2)}
                  </p>
                  <p className="text-slate-600">
                    Date:{' '}
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                  {selectedOrder.paymentReference && (
                    <p className="text-xs text-slate-500 mt-1">
                      Ref: {selectedOrder.paymentReference}
                    </p>
                  )}
                  {selectedOrder.paymentProvider && (
                    <p className="text-xs text-slate-500">
                      Provider: {selectedOrder.paymentProvider}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase mb-1">
                  Download
                </h3>
                <p className="text-slate-600">
                  Token: <span className="font-mono text-xs">{selectedOrder.downloadToken}</span>
                </p>
                <p className="text-slate-600">
                  Expires:{' '}
                  {new Date(selectedOrder.downloadExpiresAt).toLocaleString()}
                </p>
                <p className="text-slate-600">
                  Downloads:{' '}
                  <span className="font-semibold">
                    {selectedOrder.downloadCount} / {selectedOrder.maxDownloads}
                  </span>
                </p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex flex-wrap gap-2 justify-end">
              <button
                onClick={() => handleResendLink(selectedOrder.id)}
                className="px-3 py-2 rounded-xl text-xs font-semibold border border-emerald-200 text-emerald-700 hover:bg-emerald-50"
              >
                Resend Link
              </button>
              <button
                onClick={() => setConfirmRefundId(selectedOrder.id)}
                className="px-3 py-2 rounded-xl text-xs font-semibold border border-amber-200 text-amber-700 hover:bg-amber-50"
              >
                Mark Refunded
              </button>
              <button
                onClick={() => setConfirmDeleteId(selectedOrder.id)}
                className="px-3 py-2 rounded-xl text-xs font-semibold border border-rose-200 text-rose-700 hover:bg-rose-50"
              >
                Delete Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm delete */}
      <ConfirmModal
        open={!!confirmDeleteId}
        tone="danger"
        title="Delete order?"
        description={
          <p>
            This will permanently delete order{' '}
            <span className="font-mono text-xs">{confirmDeleteId}</span>. This
            action cannot be undone.
          </p>
        }
        confirmLabel="Delete order"
        onConfirm={handleDeleteOrder}
        onCancel={() => setConfirmDeleteId(null)}
      />

      {/* Confirm refund */}
      <ConfirmModal
        open={!!confirmRefundId}
        tone="default"
        title="Mark order as refunded?"
        description={
          <p>
            Order{' '}
            <span className="font-mono text-xs">{confirmRefundId}</span> will
            have its payment status set to REFUNDED.
          </p>
        }
        confirmLabel="Mark as refunded"
        onConfirm={handleRefundOrder}
        onCancel={() => setConfirmRefundId(null)}
      />
    </AdminLayout>
  );
}

