'use client';

import { type ReactNode } from 'react';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'danger' | 'default';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'default',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null;

  const confirmClasses =
    tone === 'danger'
      ? 'bg-rose-600 hover:bg-rose-700 focus:ring-rose-500'
      : 'bg-accent-500 hover:bg-accent-600 focus:ring-accent-500';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/40 px-4">
      <div className="bg-white rounded-2xl shadow-soft max-w-md w-full border border-border">
        <div className="px-6 pt-5 pb-4">
          <h2 className="font-display text-base font-bold text-navy-800 mb-2">{title}</h2>
          <div className="text-sm text-navy-400">{description}</div>
        </div>
        <div className="px-6 py-4 border-t border-border flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-navy-700 hover:bg-soft border border-border"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 rounded-full text-sm font-semibold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 ${confirmClasses}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
