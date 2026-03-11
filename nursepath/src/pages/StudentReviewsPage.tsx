import { useEffect, useMemo, useState } from 'react';
import { Star, StarHalf, StarOff, ShieldCheck, MessageCircle, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { api } from '../api';

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

interface ReviewFormState {
  name: string;
  school: string;
  examType: string;
  rating: number;
  message: string;
  verificationType: string;
  screenshotFile: File | null;
}

const initialFormState: ReviewFormState = {
  name: '',
  school: '',
  examType: '',
  rating: 0,
  message: '',
  verificationType: 'None',
  screenshotFile: null,
};

const examOptions = ['ATI', 'NCLEX', 'HESI', 'TEAS', 'Other'];

const verificationOptions = ['None', 'WhatsApp Verified', 'Message Verified', 'Exam Verified'];

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

function getInitials(name: string): string {
  if (!name) return '';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0]?.[0]?.toUpperCase() ?? '';
  return `${parts[0]?.[0] ?? ''}${parts[parts.length - 1]?.[0] ?? ''}`.toUpperCase();
}

function StarRatingDisplay({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-1" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: fullStars }).map((_, idx) => (
        <Star key={`full-${idx}`} className="w-4 h-4 text-amber-400 fill-amber-400" />
      ))}
      {hasHalf && <StarHalf className="w-4 h-4 text-amber-400 fill-amber-400" />}
      {Array.from({ length: emptyStars }).map((_, idx) => (
        <StarOff key={`empty-${idx}`} className="w-4 h-4 text-slate-300" />
      ))}
    </div>
  );
}

function StarRatingInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex items-center gap-1" aria-label="Rating from 1 to 5 stars">
      {Array.from({ length: 5 }).map((_, index) => {
        const starValue = index + 1;
        const active = starValue <= value;
        return (
          <button
            key={starValue}
            type="button"
            onClick={() => onChange(starValue)}
            className="focus:outline-none"
            aria-label={`${starValue} star${starValue === 1 ? '' : 's'}`}
          >
            <Star
              className={`w-6 h-6 transition-colors ${
                active ? 'text-amber-400 fill-amber-400' : 'text-slate-300 hover:text-amber-200'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}

function VerificationBadge({ type }: { type: string | null }) {
  if (!type || type === 'None') return null;

  let colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-100';
  if (type === 'WhatsApp Verified') {
    colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-100';
  } else if (type === 'Message Verified') {
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

function ReviewCard({ review }: { review: Review }) {
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
        <div className="flex items-center gap-2">
          <VerificationBadge type={review.verification_type} />
          {review.screenshot_url && (
            <span className="inline-flex items-center gap-1 text-xs text-slate-500">
              <ImageIcon className="w-3.5 h-3.5" />
              Proof attached
            </span>
          )}
        </div>
        <span className="text-xs text-slate-400">{formatRelativeTime(review.created_at)}</span>
      </div>
    </article>
  );
}

export default function StudentReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formState, setFormState] = useState<ReviewFormState>(initialFormState);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof ReviewFormState, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await api.get('/reviews');
        const data: Review[] = response.data || response || [];

        const approved = data.filter((review) => review.status === 'approved');
        approved.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setReviews(approved);
      } catch (err) {
        console.error('Failed to load reviews', err);
        setError('Unable to load student reviews right now.');
      } finally {
        setIsLoading(false);
      }
    };

    loadReviews();
  }, []);

  const passRateStats = useMemo(
    () => [
      {
        label: 'Pass Success',
        primary: '98% Pass Rate',
        description: 'Among students who completed at least 3 predictors.',
      },
      {
        label: 'Happy Students',
        primary: '10K+ Nursing Students',
        description: 'Across ATI, NCLEX, HESI, and more.',
      },
      {
        label: 'Live Support',
        primary: '24/7 Study Support',
        description: 'Real-time chat with nurse tutors.',
      },
    ],
    []
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file && !['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
      setFormErrors((prev) => ({
        ...prev,
        screenshotFile: 'Supported formats: PNG, JPG, JPEG.',
      }));
      setFormState((prev) => ({ ...prev, screenshotFile: null }));
      return;
    }
    setFormState((prev) => ({ ...prev, screenshotFile: file }));
    setFormErrors((prev) => ({ ...prev, screenshotFile: undefined }));
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof ReviewFormState, string>> = {};

    if (!formState.name.trim()) {
      errors.name = 'Full name is required.';
    }
    if (!formState.rating || formState.rating < 1) {
      errors.rating = 'Please select a rating.';
    }
    if (!formState.message.trim()) {
      errors.message = 'Review message is required.';
    } else if (formState.message.length > 500) {
      errors.message = 'Review message must be under 500 characters.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitMessage(null);

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      const body: Record<string, unknown> = {
        name: formState.name.trim(),
        school: formState.school.trim() || null,
        exam_type: formState.examType || 'Other',
        rating: formState.rating,
        message: formState.message.trim(),
        verification_type:
          formState.verificationType && formState.verificationType !== 'None'
            ? formState.verificationType
            : null,
      };

      // If your backend expects multipart for screenshots, update api helper to support FormData.
      // For now, we send JSON only and assume screenshot uploads are a later enhancement.

      await api.post('/reviews', body, true);

      setFormState(initialFormState);
      setFormErrors({});
      setSubmitMessage('Thank you! Your review will appear after moderation.');
    } catch (err: unknown) {
      console.error('Failed to submit review', err);
      const message =
        err instanceof Error
          ? err.message
          : 'We could not submit your review. Please try again.';
      setSubmitMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const remainingChars = 500 - formState.message.length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-grow">
        {/* Hero / Trust Header */}
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
                Direct feedback from nursing students who used our ATI, NCLEX, HESI, and TEAS
                predictors to pass with confidence.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {passRateStats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl bg-white/5 border border-white/10 px-4 py-4 sm:px-5 sm:py-5 flex flex-col gap-1"
                >
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-200/80">
                    {item.label}
                  </div>
                  <div className="text-base sm:text-lg font-semibold text-white">
                    {item.primary}
                  </div>
                  <div className="text-xs text-slate-300/90">{item.description}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Reviews Grid */}
        <section className="py-12 sm:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  Student Reviews
                </h2>
                <p className="mt-1 text-sm sm:text-base text-slate-600">
                  Screenshots, messages, and real stories from nursing students on their way to
                  RN and LPN licensure.
                </p>
              </div>
              {reviews.length > 0 && (
                <div className="hidden sm:flex items-center gap-1 text-sm text-slate-500">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>
                    {(
                      reviews.reduce((acc, r) => acc + (r.rating || 0), 0) /
                      reviews.length
                    ).toFixed(1)}{' '}
                    average rating
                  </span>
                </div>
              )}
            </div>

            {isLoading ? (
              <div className="py-12 flex justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
                  <p className="text-sm text-slate-500">Loading verified reviews…</p>
                </div>
              </div>
            ) : error ? (
              <div className="py-8 text-center text-sm text-red-600">{error}</div>
            ) : reviews.length === 0 ? (
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

        {/* Submit Review Form */}
        <section className="bg-slate-100/80 border-t border-slate-200/60 py-14 sm:py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl shadow-soft border border-slate-200/80 p-6 sm:p-8">
              <div className="flex items-start gap-3 mb-6">
                <div className="mt-1 rounded-2xl bg-primary-50 p-2.5">
                  <MessageCircle className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-900">
                    Share your experience
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Tell future nursing students how this platform helped you prepare for your ATI,
                    NCLEX, HESI, or TEAS exam. Your review appears after admin verification.
                  </p>
                </div>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-xs font-medium text-slate-700 mb-1.5"
                    >
                      Full Name<span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formState.name}
                      onChange={handleInputChange}
                      className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      placeholder="Jessica R."
                      required
                    />
                    {formErrors.name && (
                      <p className="mt-1 text-xs text-red-600">{formErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="school"
                      className="block text-xs font-medium text-slate-700 mb-1.5"
                    >
                      School / University (optional)
                    </label>
                    <input
                      id="school"
                      name="school"
                      type="text"
                      value={formState.school}
                      onChange={handleInputChange}
                      className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      placeholder="University of Miami"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="examType"
                      className="block text-xs font-medium text-slate-700 mb-1.5"
                    >
                      Exam Type
                    </label>
                    <select
                      id="examType"
                      name="examType"
                      value={formState.examType}
                      onChange={handleInputChange}
                      className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm shadow-sm bg-white focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    >
                      <option value="">Select exam type</option>
                      {examOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      Rating<span className="text-red-500">*</span>
                    </label>
                    <StarRatingInput
                      value={formState.rating}
                      onChange={(value) =>
                        setFormState((prev) => ({ ...prev, rating: value }))
                      }
                    />
                    {formErrors.rating && (
                      <p className="mt-1 text-xs text-red-600">{formErrors.rating}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-xs font-medium text-slate-700 mb-1.5"
                  >
                    Review Message<span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formState.message}
                    onChange={handleInputChange}
                    maxLength={500}
                    rows={4}
                    className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    placeholder="Tell future nursing students how this platform helped you pass your exam."
                    required
                  />
                  <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
                    <span>Max 500 characters</span>
                    <span>{remainingChars} characters left</span>
                  </div>
                  {formErrors.message && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.message}</p>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="verificationType"
                      className="block text-xs font-medium text-slate-700 mb-1.5"
                    >
                      Verification Type (optional)
                    </label>
                    <select
                      id="verificationType"
                      name="verificationType"
                      value={formState.verificationType}
                      onChange={handleInputChange}
                      className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm shadow-sm bg-white focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    >
                      {verificationOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="screenshotFile"
                      className="block text-xs font-medium text-slate-700 mb-1.5"
                    >
                      Screenshot Upload (optional)
                    </label>
                    <input
                      id="screenshotFile"
                      name="screenshotFile"
                      type="file"
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={handleFileChange}
                      className="block w-full text-xs text-slate-600 file:mr-2 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-slate-700 hover:file:bg-slate-200"
                    />
                    <p className="mt-1 text-[11px] text-slate-500">
                      Upload a score report, chat screenshot, or exam result (PNG, JPG, JPEG).
                    </p>
                    {formErrors.screenshotFile && (
                      <p className="mt-1 text-xs text-red-600">
                        {formErrors.screenshotFile}
                      </p>
                    )}
                  </div>
                </div>

                {submitMessage && (
                  <div
                    className={`text-xs rounded-lg px-3 py-2 ${
                      submitMessage.startsWith('Thank you')
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        : 'bg-red-50 text-red-700 border border-red-100'
                    }`}
                  >
                    {submitMessage}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center rounded-full bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? 'Submitting…' : 'Submit Review'}
                  </button>
                  <p className="text-[11px] text-slate-500">
                    Reviews are moderated to protect student privacy. Only approved reviews appear
                    publicly.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

