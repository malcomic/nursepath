import { ShieldCheck } from 'lucide-react';
import StarRatingDisplay from './StarRatingDisplay';
import { formatRelativeTime, getInitials, type PublicReview } from '@/lib/reviews/format';

function VerificationBadge({ type }: { type: string | null }) {
  if (!type || type === 'None') return null;

  let colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-100';
  if (type === 'Message Verified') {
    colorClasses = 'bg-sky-50 text-sky-700 border-sky-100';
  } else if (type === 'Exam Verified') {
    colorClasses = 'bg-violet-50 text-violet-700 border-violet-100';
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${colorClasses}`}
    >
      <ShieldCheck className="w-3.5 h-3.5" />
      {type.toUpperCase()}
    </span>
  );
}

export default function ReviewCard({ review }: { review: PublicReview }) {
  const initials = getInitials(review.name);
  const displaySchool = review.school?.trim() || 'Verified Nursing Student';

  return (
    <article className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-sm font-semibold text-primary-700">
            {initials}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">{review.name}</h3>
            <p className="text-xs text-slate-500">{displaySchool}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-2">
          <StarRatingDisplay rating={review.rating} />
          <span className="text-xs text-slate-500 uppercase tracking-wide">
            {review.exam_type || 'Exam'}
          </span>
        </div>

        <div className="mt-4">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-sm leading-relaxed text-slate-800">
            {review.message}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <VerificationBadge type={review.verification_type} />
        <span className="text-xs text-slate-400" suppressHydrationWarning>
          {formatRelativeTime(review.created_at)}
        </span>
      </div>
    </article>
  );
}
