'use client';

import { useState } from 'react';
import { Eye } from 'lucide-react';
import Button from '@/components/ui/Button';
import GuidePreviewModal from '@/components/guides/GuidePreviewModal';

interface GuidePreviewButtonProps {
  title: string;
  previewPdfUrl: string | null | undefined;
}

export default function GuidePreviewButton({ title, previewPdfUrl }: GuidePreviewButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!previewPdfUrl) {
    return null;
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        fullWidth
        className="mb-3"
        onClick={() => setIsOpen(true)}
      >
        <Eye className="mr-2 h-4 w-4" />
        Preview sample
      </Button>
      <GuidePreviewModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={title}
        previewPdfUrl={previewPdfUrl}
      />
    </>
  );
}
