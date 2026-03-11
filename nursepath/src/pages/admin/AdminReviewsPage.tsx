import { useEffect, useMemo, useState } from 'react';
import {
  Search,
  Eye,
  CheckCircle2,
  XCircle,
  Trash2,
  Star,
  StarOff,
  ChevronDown,
  X,
  ZoomIn,
} from 'lucide-react';
import { api } from '../../api';
import AdminLayout from '../../components/layout/AdminLayout';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { ConfirmModal } from '../../components/admin/ConfirmModal';
import { useToast } from '../../components/admin/ToastProvider';

type ReviewStatus = 'pending' | 'approved' | 'rejected';

interface Review {
  id: string;
  name: string;
  school: string | null;
  exam_type: string;
  rating: number;
  message: string;
  verification_type: string | null;
  screenshot_url: string | null;
  status: ReviewStatus;
  created_at: string;
  updated_at?: string;
}

type StatusTab = 'all' | 'pending' | 'approved' | 'rejected';

const EXAM_OPTIONS = ['ATI', 'NCLEX', 'HESI', 'TEAS', 'Other'];

function formatRelativeTime(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  if (Number.isNaN(diffMs)) return '';
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;
  if (weeks < 5) return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
  if (months < 12) return `${months} month${months === 1 ? '' : 's'} ago`;
  return `${years} year${years === 1 ? '' : 's'} ago`;
}

function previewText(text: string, maxLen: number = 80): string {
  if (!text || text.length <= maxLen) return text;
  return text.slice(0, maxLen).trim() + '...';
}

function StarRatingDisplay({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const emptyStars = 5 - fullStars;
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={`f-${i}`} className="w-4 h-4 text-amber-400 fill-amber-400" />
      ))}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <StarOff key={`e-${i}`} className="w-4 h-4 text-slate-300" />
      ))}
    </div>
  );
}

function VerificationLabel({ type }: { type: string | null }) {
  if (!type || type === 'None') return <span className="text-slate-400">—</span>;
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-slate-100 text-slate-700 border border-slate-200">
      {type.toUpperCase().replace(/\s+/g, ' ')}
    </span>
  );
}

function statusBadgeVariant(s: ReviewStatus): 'success' | 'warning' | 'danger' | 'neutral' {
  switch (s) {
    case 'approved':
      return 'success';
    case 'pending':
      return 'warning';
    case 'rejected':
      return 'danger';
    default:
      return 'neutral';
  }
}

export default function AdminReviewsPage() {
  const { showToast } = useToast();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusTab, setStatusTab] = useState<StatusTab>('pending');
  const [search, setSearch] = useState('');
  const [examFilter, setExamFilter] = useState<string>('');
  const [ratingFilter, setRatingFilter] = useState<string>('');

  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [screenshotLightbox, setScreenshotLightbox] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/reviews', true);
      const data = Array.isArray(res) ? res : res?.data ?? res?.items ?? [];
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load reviews', err);
      showToast('Failed to load reviews', 'error');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const filteredReviews = useMemo(() => {
    let list = [...reviews];
    if (statusTab !== 'all') {
      list = list.filter((r) => r.status === statusTab);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((r) => r.name.toLowerCase().includes(q));
    }
    if (examFilter) {
      list = list.filter((r) => (r.exam_type || '').toLowerCase() === examFilter.toLowerCase());
    }
    if (ratingFilter) {
      const r = parseInt(ratingFilter, 10);
      if (!Number.isNaN(r)) list = list.filter((rev) => rev.rating === r);
    }
    return list.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [reviews, statusTab, search, examFilter, ratingFilter]);

  const stats = useMemo(() => {
    const pending = reviews.filter((r) => r.status === 'pending').length;
    const approved = reviews.filter((r) => r.status === 'approved').length;
    const rejected = reviews.filter((r) => r.status === 'rejected').length;
    return { pending, approved, rejected };
  }, [reviews]);

  const handleApprove = async (id: string) => {
    try {
      setActionLoadingId(id);
      await api.patch(`/admin/reviews/${id}/approve`, {}, true);
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'approved' as const } : r))
      );
      if (selectedReview?.id === id) setSelectedReview((r) => (r?.id === id ? { ...r, status: 'approved' } : r));
      showToast('Review approved', 'success');
    } catch (err) {
      console.error('Approve failed', err);
      showToast(err instanceof Error ? err.message : 'Failed to approve', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (id: string) => {
    try {
      setActionLoadingId(id);
      await api.patch(`/admin/reviews/${id}/reject`, {}, true);
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'rejected' as const } : r))
      );
      if (selectedReview?.id === id) setSelectedReview((r) => (r?.id === id ? { ...r, status: 'rejected' } : r));
      showToast('Review rejected', 'success');
    } catch (err) {
      console.error('Reject failed', err);
      showToast(err instanceof Error ? err.message : 'Failed to reject', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      setActionLoadingId(confirmDeleteId);
      await api.delete(`/admin/reviews/${confirmDeleteId}`, true);
      setReviews((prev) => prev.filter((r) => r.id !== confirmDeleteId));
      if (selectedReview?.id === confirmDeleteId) setSelectedReview(null);
      showToast('Review deleted', 'success');
    } catch (err) {
      console.error('Delete failed', err);
      showToast(err instanceof Error ? err.message : 'Failed to delete', 'error');
    } finally {
      setConfirmDeleteId(null);
      setActionLoadingId(null);
    }
  };

  const tabs: { key: StatusTab; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'approved', label: 'Approved' },
    { key: 'rejected', label: 'Rejected' },
  ];

  return (
    <AdminLayout title="Review Moderation">
      <div className="space-y-6">
        {/* Page header */}
        <div>
          <h2 className="text-xl font-bold text-slate-900">Review Moderation</h2>
          <p className="text-sm text-slate-600 mt-0.5">
            Manage and approve student reviews before they appear publicly.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-3">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Pending
            </div>
            <div className="text-2xl font-bold text-amber-600 mt-0.5">{stats.pending}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-3">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Approved
            </div>
            <div className="text-2xl font-bold text-emerald-600 mt-0.5">{stats.approved}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-3">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Rejected
            </div>
            <div className="text-2xl font-bold text-rose-600 mt-0.5">{stats.rejected}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-slate-200">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setStatusTab(key)}
              className={`px-4 py-2.5 text-sm font-semibold rounded-t-lg border-b-2 -mb-px transition-colors ${
                statusTab === key
                  ? 'border-blue-600 text-blue-700 bg-blue-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name"
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
            />
          </div>
          <div className="relative">
            <select
              value={examFilter}
              onChange={(e) => setExamFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 bg-white"
            >
              <option value="">All exam types</option>
              {EXAM_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 bg-white"
            >
              <option value="">All ratings</option>
              {[1, 2, 3, 4, 5].map((r) => (
                <option key={r} value={String(r)}>
                  {r} star{r > 1 ? 's' : ''}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-12 text-center text-sm text-slate-500">Loading reviews...</div>
            ) : filteredReviews.length === 0 ? (
              <div className="py-12 text-center text-sm text-slate-500">
                No reviews found for the current filters.
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    <th className="px-4 py-3 text-left">Student Name</th>
                    <th className="px-4 py-3 text-left">School</th>
                    <th className="px-4 py-3 text-left">Exam Type</th>
                    <th className="px-4 py-3 text-left">Rating</th>
                    <th className="px-4 py-3 text-left">Review Preview</th>
                    <th className="px-4 py-3 text-left">Verification</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Submitted</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReviews.map((review) => {
                    const loadingRow = actionLoadingId === review.id;
                    return (
                      <tr
                        key={review.id}
                        className="border-b border-slate-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium text-slate-900">{review.name}</td>
                        <td className="px-4 py-3 text-slate-600">
                          {review.school?.trim() || '—'}
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          {review.exam_type || '—'}
                        </td>
                        <td className="px-4 py-3">
                          <StarRatingDisplay rating={review.rating} />
                        </td>
                        <td className="px-4 py-3 text-slate-600 max-w-[200px]">
                          {previewText(review.message)}
                        </td>
                        <td className="px-4 py-3">
                          <VerificationLabel type={review.verification_type} />
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge
                            label={review.status}
                            variant={statusBadgeVariant(review.status)}
                          />
                        </td>
                        <td className="px-4 py-3 text-slate-500 text-xs">
                          {formatRelativeTime(review.created_at)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => setSelectedReview(review)}
                              className="p-2 rounded-lg text-slate-600 hover:text-blue-700 hover:bg-blue-50"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleApprove(review.id)}
                              disabled={loadingRow || review.status === 'approved'}
                              className="p-2 rounded-lg text-slate-600 hover:text-green-700 hover:bg-green-50 disabled:opacity-50"
                              title="Approve"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReject(review.id)}
                              disabled={loadingRow || review.status === 'rejected'}
                              className="p-2 rounded-lg text-slate-600 hover:text-red-700 hover:bg-red-50 disabled:opacity-50"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(review.id)}
                              className="p-2 rounded-lg text-slate-600 hover:text-slate-800 hover:bg-gray-100"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
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
        </div>
      </div>

      {/* Review detail panel (modal) */}
      {selectedReview && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 px-4"
          onClick={() => setSelectedReview(null)}
        >
          <div
            className="bg-white max-w-2xl w-full rounded-2xl shadow-xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
              <h2 className="text-base font-bold text-slate-900">Review Details</h2>
              <button
                onClick={() => setSelectedReview(null)}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4 text-sm overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-xs font-semibold text-slate-500 uppercase mb-1">
                    Student
                  </h3>
                  <p className="font-semibold text-slate-900">{selectedReview.name}</p>
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-slate-500 uppercase mb-1">
                    School / University
                  </h3>
                  <p className="text-slate-700">
                    {selectedReview.school?.trim() || '—'}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-xs font-semibold text-slate-500 uppercase mb-1">
                    Exam Type
                  </h3>
                  <p className="text-slate-700">{selectedReview.exam_type || '—'}</p>
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-slate-500 uppercase mb-1">
                    Rating
                  </h3>
                  <StarRatingDisplay rating={selectedReview.rating} />
                </div>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase mb-1">
                  Review
                </h3>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-slate-800 leading-relaxed">
                  {selectedReview.message}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase mb-1">
                  Verification
                </h3>
                <VerificationLabel type={selectedReview.verification_type} />
              </div>
              {selectedReview.screenshot_url && (
                <div>
                  <h3 className="text-xs font-semibold text-slate-500 uppercase mb-1">
                    Screenshot
                  </h3>
                  <button
                    type="button"
                    onClick={() => setScreenshotLightbox(selectedReview.screenshot_url!)}
                    className="block text-left"
                  >
                    <img
                      src={selectedReview.screenshot_url}
                      alt="Review screenshot"
                      className="max-h-48 rounded-lg border border-slate-200 object-contain bg-slate-50"
                    />
                    <span className="inline-flex items-center gap-1 mt-1 text-xs text-blue-600 font-medium">
                      <ZoomIn className="w-3.5 h-3.5" />
                      Click to enlarge
                    </span>
                  </button>
                </div>
              )}
              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase mb-1">
                  Submitted
                </h3>
                <p className="text-slate-600">
                  {formatRelativeTime(selectedReview.created_at)}
                </p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex flex-wrap gap-2 justify-end shrink-0">
              <button
                onClick={() => handleApprove(selectedReview.id)}
                disabled={actionLoadingId === selectedReview.id || selectedReview.status === 'approved'}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-green-500 text-white hover:bg-green-600 disabled:opacity-50"
              >
                Approve Review
              </button>
              <button
                onClick={() => handleReject(selectedReview.id)}
                disabled={actionLoadingId === selectedReview.id || selectedReview.status === 'rejected'}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
              >
                Reject Review
              </button>
              <button
                onClick={() => setConfirmDeleteId(selectedReview.id)}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-gray-500 text-white hover:bg-gray-600"
              >
                Delete Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Screenshot lightbox */}
      {screenshotLightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-4"
          onClick={() => setScreenshotLightbox(null)}
        >
          <button
            type="button"
            onClick={() => setScreenshotLightbox(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/90 text-slate-700 hover:bg-white"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={screenshotLightbox}
            alt="Screenshot full size"
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Confirm delete */}
      <ConfirmModal
        open={!!confirmDeleteId}
        tone="danger"
        title="Delete review?"
        description={
          <p>
            This will permanently delete this review. This action cannot be undone.
          </p>
        }
        confirmLabel="Delete review"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </AdminLayout>
  );
}
