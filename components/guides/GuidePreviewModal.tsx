'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import Button from '@/components/ui/Button';

interface GuidePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  previewPdfUrl: string;
}

export default function GuidePreviewModal({
  isOpen,
  onClose,
  title,
  previewPdfUrl,
}: GuidePreviewModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
          onContextMenu={(e) => e.preventDefault()}
        >
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <div>
              <h3 className="font-display text-lg font-bold text-navy-800">Sample preview</h3>
              <p className="text-sm text-navy-400">{title}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-navy-400 transition-colors hover:bg-navy-50 hover:text-navy-700"
              aria-label="Close preview"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="border-b border-border bg-primary-50 px-6 py-3">
            <p className="text-sm text-navy-600">
              Showing about 15% of this guide. Copying and downloading this sample are disabled.
              Purchase for the full PDF.
            </p>
          </div>

          <div
            className="relative h-[min(70vh,720px)] w-full select-none bg-navy-50"
            style={{ userSelect: 'none' }}
            onContextMenu={(e) => e.preventDefault()}
          >
            <iframe
              src={`${previewPdfUrl}#toolbar=0&navpanes=0`}
              title={`${title} sample preview`}
              className="h-full w-full border-0"
            />
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
