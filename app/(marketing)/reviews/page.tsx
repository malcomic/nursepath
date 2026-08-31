import type { Metadata } from 'next';
import { CheckCircle2, Star } from 'lucide-react';
import { reviewService } from '@/lib/services/reviewService';
import ReviewCard from '@/components/reviews/ReviewCard';
import ReviewSubmitForm from '@/components/reviews/ReviewSubmitForm';

export const metadata: Metadata = {
  title: 'Student Reviews',
  description:
    'Read verified reviews from nursing students who used NursePath study guides for NCLEX, ATI, HESI, and TEAS exam prep.',
};

export default async function ReviewsPage() {
  const reviews = await reviewService.getApprovedReviews();
  const avg =
    reviews.length === 0
      ? null
      : reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <main className="bg-slate-50">
      <section className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 text-emerald-300 px-3 py-1 text-xs font-semibold tracking-wide mb-4">
              <CheckCircle2 className="w-3.5 h-3.5" />
              VERIFIED SUCCESS
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4">
              Real Student Conversations
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-slate-200/90 max-w-2xl mx-auto">
              Direct feedback from nursing students who used our ATI, NCLEX, HESI, and TEAS study
              guides to prepare with confidence.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm">
            {avg !== null && (
              <div className="inline-flex items-center gap-2 rounded-2xl bg-white/5 border border-white/10 px-5 py-3">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <span className="font-semibold text-white">{avg.toFixed(1)} average rating</span>
              </div>
            )}
            <div className="inline-flex items-center gap-2 rounded-2xl bg-white/5 border border-white/10 px-5 py-3">
              <span className="font-semibold text-white">
                {reviews.length} approved {reviews.length === 1 ? 'review' : 'reviews'}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Student Reviews</h2>
            <p className="mt-1 text-sm sm:text-base text-slate-600">
              Real stories from nursing students on their way to RN and LPN licensure.
            </p>
          </div>

          {reviews.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-500">
              No reviews have been approved yet. Be the first to share your story.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section
        id="submit"
        className="bg-slate-100/80 border-t border-slate-200/60 py-14 sm:py-16 scroll-mt-24"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <ReviewSubmitForm />
        </div>
      </section>
    </main>
  );
}
