'use client';

import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import StarRatingInput from './StarRatingInput';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const examOptions = ['ATI', 'NCLEX', 'HESI', 'TEAS', 'Other'];
const verificationOptions = ['None', 'WhatsApp Verified', 'Message Verified', 'Exam Verified'];

interface FormState {
  name: string;
  school: string;
  examType: string;
  rating: number;
  message: string;
  verificationType: string;
}

const initialFormState: FormState = {
  name: '',
  school: '',
  examType: '',
  rating: 0,
  message: '',
  verificationType: 'None',
};

export default function ReviewSubmitForm() {
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof FormState, string>> = {};

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
    setIsSuccess(false);

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      const body = {
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

      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || 'We could not submit your review. Please try again.');
      }

      setFormState(initialFormState);
      setFormErrors({});
      setIsSuccess(true);
      setSubmitMessage('Thank you! Your review will appear after moderation.');
    } catch (err) {
      setIsSuccess(false);
      setSubmitMessage(
        err instanceof Error ? err.message : 'We could not submit your review. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const remainingChars = 500 - formState.message.length;

  return (
    <div className="bg-white rounded-3xl shadow-soft border border-slate-200/80 p-6 sm:p-8">
      <div className="flex items-start gap-3 mb-6">
        <div className="mt-1 rounded-2xl bg-primary-50 p-2.5">
          <MessageCircle className="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-slate-900">Share your experience</h3>
          <p className="mt-1 text-sm text-slate-600">
            Tell future nursing students how this platform helped you prepare for your ATI, NCLEX,
            HESI, or TEAS exam. Your review appears after admin verification.
          </p>
        </div>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Input
              label="Full Name"
              name="name"
              value={formState.name}
              onChange={handleInputChange}
              placeholder="Jessica R."
              required
              error={formErrors.name}
            />
          </div>
          <div>
            <Input
              label="School / University (optional)"
              name="school"
              value={formState.school}
              onChange={handleInputChange}
              placeholder="University of Miami"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="examType" className="block text-sm font-medium text-gray-700 mb-2">
              Exam Type
            </label>
            <select
              id="examType"
              name="examType"
              value={formState.examType}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating <span className="text-red-500">*</span>
            </label>
            <StarRatingInput
              value={formState.rating}
              onChange={(value) => {
                setFormState((prev) => ({ ...prev, rating: value }));
                setFormErrors((prev) => ({ ...prev, rating: undefined }));
              }}
            />
            {formErrors.rating && (
              <p className="mt-1 text-sm text-red-600">{formErrors.rating}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Review Message <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formState.message}
            onChange={handleInputChange}
            maxLength={500}
            rows={4}
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
              formErrors.message ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Tell future nursing students how this platform helped you pass your exam."
            required
          />
          <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
            <span>Max 500 characters</span>
            <span>{remainingChars} characters left</span>
          </div>
          {formErrors.message && (
            <p className="mt-1 text-sm text-red-600">{formErrors.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="verificationType"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Verification Type (optional)
          </label>
          <select
            id="verificationType"
            name="verificationType"
            value={formState.verificationType}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
          >
            {verificationOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {submitMessage && (
          <div
            className={`text-sm rounded-lg px-3 py-2 ${
              isSuccess
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                : 'bg-red-50 text-red-700 border border-red-100'
            }`}
          >
            {submitMessage}
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
          <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting…' : 'Submit Review'}
          </Button>
          <p className="text-[11px] text-slate-500">
            Reviews are moderated to protect student privacy. Only approved reviews appear publicly.
          </p>
        </div>
      </form>
    </div>
  );
}
