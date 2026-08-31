'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Search,
  Eye,
  CheckCircle2,
  XCircle,
  Trash2,
  Star,
  StarOff,
  X,
  ZoomIn,
} from 'lucide-react';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { ConfirmModal } from '@/components/admin/ConfirmModal';
import { useToast } from '@/components/admin/ToastProvider';
import { adminJson } from '@/lib/admin/api-client';

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
}

type StatusTab = 'all' | 'pending' | 'approved' | 'rejected';

const EXAM_OPTIONS = ['ATI', 'NCLEX', 'HESI', 'TEAS', 'Other'];

function formatRelativeTime(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  if (Number.isNaN(diffMs)) return '';
  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function StarRatingDisplay({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
      ))}
      {Array.from({ length: 5 - fullStars }).map((_, i) => (
        <StarOff key={i} className="w-4 h-4 text-slate-300" />
      ))}
    </div>
  );
}

export default function AdminReviewsPage() {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusTab, setStatusTab] = useState<StatusTab>('pending');
  const [search, setSearch] = useState('');
  const [examFilter, setExamFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [screenshotLightbox, setScreenshotLightbox] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await adminJson<{ success: boolean; data: Review[] }>('/api/admin/reviews');
      setReviews(res.data || []);
    } catch {
      showToast('Failed to load reviews', 'error');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredReviews = useMemo(() => {
    let list = [...reviews];
    if (statusTab !== 'all') list = list.filter((r) => r.status === statusTab);
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

  const handleApprove = async (id: string) => {
    try {
      setActionLoadingId(id);
      await adminJson(`/api/admin/reviews/${id}/approve`, { method: 'PATCH' });
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'approved' as const } : r))
      );
      showToast('Review approved', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to approve', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (id: string) => {
    try {
      setActionLoadingId(id);
      await adminJson(`/api/admin/reviews/${id}/reject`, { method: 'PATCH' });
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'rejected' as const } : r))
      );
      showToast('Review rejected', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to reject', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      setActionLoadingId(confirmDeleteId);
      await adminJson(`/api/admin/reviews/${confirmDeleteId}`, { method: 'DELETE' });
      setReviews((prev) => prev.filter((r) => r.id !== confirmDeleteId));
      if (selectedReview?.id === confirmDeleteId) setSelectedReview(null);
      showToast('Review deleted', 'success');
    } catch (err) {
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
    <div className="space-y-6">
      <div className="flex items-center gap-1 border-b border-slate-200">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setStatusTab(key)}
            className={`px-4 py-2.5 text-sm font-semibold rounded-t-lg border-b-2 -mb-px ${
              statusTab === key
                ? 'border-blue-600 text-blue-700 bg-blue-50/50'
                : 'border-transparent text-slate-600 hover:bg-slate-50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name"
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm"
          />
        </div>
        <select
          value={examFilter}
          onChange={(e) => setExamFilter(e.target.value)}
          className="pl-3 pr-8 py-2 rounded-lg border border-slate-200 text-sm"
        >
          <option value="">All exam types</option>
          {EXAM_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
          className="pl-3 pr-8 py-2 rounded-lg border border-slate-200 text-sm"
        >
          <option value="">All ratings</option>
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={String(r)}>
              {r} stars
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-sm text-slate-500">Loading reviews...</div>
        ) : filteredReviews.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-500">No reviews found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-600 uppercase">
                <th className="px-4 py-3 text-left">Student</th>
                <th className="px-4 py-3 text-left">Exam</th>
                <th className="px-4 py-3 text-left">Rating</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Submitted</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.map((review) => (
                <tr key={review.id} className="border-b border-slate-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{review.name}</td>
                  <td className="px-4 py-3">{review.exam_type}</td>
                  <td className="px-4 py-3">
                    <StarRatingDisplay rating={review.rating} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      label={review.status}
                      variant={
                        review.status === 'approved'
                          ? 'success'
                          : review.status === 'pending'
                            ? 'warning'
                            : 'danger'
                      }
                    />
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {formatRelativeTime(review.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => setSelectedReview(review)}
                        className="p-2 rounded-lg hover:bg-blue-50 text-slate-600"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApprove(review.id)}
                        disabled={actionLoadingId === review.id || review.status === 'approved'}
                        className="p-2 rounded-lg hover:bg-green-50 disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReject(review.id)}
                        disabled={actionLoadingId === review.id || review.status === 'rejected'}
                        className="p-2 rounded-lg hover:bg-red-50 disabled:opacity-50"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(review.id)}
                        className="p-2 rounded-lg hover:bg-gray-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedReview && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="bg-white max-w-2xl w-full rounded-2xl shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h2 className="font-bold">Review Details</h2>
              <button type="button" onClick={() => setSelectedReview(null)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4 text-sm">
              <p>
                <strong>{selectedReview.name}</strong> — {selectedReview.exam_type}
              </p>
              <StarRatingDisplay rating={selectedReview.rating} />
              <div className="bg-slate-50 rounded-xl p-4 border">{selectedReview.message}</div>
              {selectedReview.screenshot_url && (
                <div>
                  <button
                    type="button"
                    onClick={() => setScreenshotLightbox(selectedReview.screenshot_url!)}
                    className="text-blue-600 text-xs font-medium flex items-center gap-1"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                    View screenshot
                  </button>
                  <img
                    src={selectedReview.screenshot_url}
                    alt="Review screenshot"
                    className="mt-2 max-h-48 rounded-lg border object-contain"
                  />
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => handleApprove(selectedReview.id)}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-green-500 text-white"
              >
                Approve
              </button>
              <button
                type="button"
                onClick={() => handleReject(selectedReview.id)}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-500 text-white"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {screenshotLightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-4"
          onClick={() => setScreenshotLightbox(null)}
        >
          <img
            src={screenshotLightbox}
            alt="Screenshot"
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        </div>
      )}

      <ConfirmModal
        open={!!confirmDeleteId}
        tone="danger"
        title="Delete review?"
        description={<p>This will permanently delete this review.</p>}
        confirmLabel="Delete review"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
}
