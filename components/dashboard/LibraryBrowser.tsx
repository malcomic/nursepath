'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  BookOpen,
  Download,
  Eye,
  FileText,
  Search,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/admin/Modal';

type ContentType = 'STUDY_DOC' | 'QA_DOC';
type TypeFilter = 'ALL' | ContentType;

interface LibraryDoc {
  id: string;
  type: ContentType;
  title: string;
  slug: string;
  description?: string | null;
  categoryId: string;
  previewPdfUrl?: string | null;
  thumbnailUrl?: string | null;
  alreadyDownloaded: boolean;
  category?: { id: string; name: string } | null;
}

interface LibraryPayload {
  documents: LibraryDoc[];
  downloadsUsed: number;
  downloadsRemaining: number;
  downloadsMax: number;
  endsAt: string | null;
  planName: string | null;
}

function typeLabel(type: ContentType) {
  return type === 'STUDY_DOC' ? 'Study' : 'Q&A';
}

export default function LibraryBrowser() {
  const [data, setData] = useState<LibraryPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewDoc, setPreviewDoc] = useState<LibraryDoc | null>(null);
  const [downloadMessage, setDownloadMessage] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const fetchLibrary = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/dashboard/library/documents');
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Unable to load library.');
      }
      setData(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load library.');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchLibrary();
  }, [fetchLibrary]);

  const filtered = useMemo(() => {
    if (!data) return [];
    let docs = data.documents;
    if (typeFilter !== 'ALL') {
      docs = docs.filter((d) => d.type === typeFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      docs = docs.filter((d) => d.title.toLowerCase().includes(q));
    }
    return docs;
  }, [data, typeFilter, searchQuery]);

  const handleDownload = async (doc: LibraryDoc) => {
    setDownloadMessage(null);
    setDownloadingId(doc.id);
    try {
      const res = await fetch(`/api/dashboard/library/documents/${doc.id}/download`);
      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.error || 'Download failed.');
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${doc.slug || doc.title}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      await fetchLibrary();
    } catch (err) {
      setDownloadMessage(err instanceof Error ? err.message : 'Download failed.');
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary-600" />
        <p className="text-navy-400">Loading library…</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <Card className="py-12 text-center">
        <p className="mb-4 text-red-600">{error || 'Unable to load library.'}</p>
        <Button variant="outline" onClick={() => void fetchLibrary()}>
          Try again
        </Button>
      </Card>
    );
  }

  const endsAtLabel = data.endsAt
    ? new Date(data.endsAt).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    : null;

  const remainingDays = data.endsAt
    ? Math.max(
        0,
        Math.ceil((new Date(data.endsAt).getTime() - Date.now()) / (24 * 60 * 60 * 1000))
      )
    : null;

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-navy-800">Your library</h2>
            <p className="mt-1 text-sm text-navy-400">
              {data.planName ? `${data.planName} · ` : ''}
              {endsAtLabel ? `Access until ${endsAtLabel}` : 'Active access'}
              {remainingDays !== null
                ? ` · ${remainingDays} day${remainingDays === 1 ? '' : 's'} left`
                : ''}
            </p>
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <div className="text-sm text-navy-600">
              <span className="font-semibold text-navy-800">
                {data.downloadsUsed} / {data.downloadsMax}
              </span>{' '}
              downloads used
            </div>
            <Link
              href="/pricing"
              className="text-sm font-semibold text-primary-600 hover:underline"
            >
              Extend access
            </Link>
          </div>
        </div>
      </Card>

      {downloadMessage && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {downloadMessage}{' '}
          <Link href="/pricing" className="font-semibold underline">
            Get another pass
          </Link>
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {(
            [
              { id: 'ALL', label: 'All' },
              { id: 'STUDY_DOC', label: 'Study docs' },
              { id: 'QA_DOC', label: 'Q&A' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setTypeFilter(tab.id)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
                typeFilter === tab.id
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-navy-400 hover:bg-soft hover:text-navy-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-navy-300" />
          <Input
            placeholder="Search documents…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card className="py-16 text-center">
          <FileText className="mx-auto mb-4 h-12 w-12 text-navy-300" />
          <p className="text-navy-400">
            {searchQuery || typeFilter !== 'ALL'
              ? 'No documents match your filters.'
              : 'No library documents yet. Check back soon.'}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((doc) => {
            const canDownload =
              doc.alreadyDownloaded || data.downloadsRemaining > 0;
            return (
              <Card key={doc.id} hover className="flex flex-col">
                {doc.thumbnailUrl ? (
                  <div className="relative mb-4 h-40 w-full overflow-hidden rounded-xl bg-navy-50">
                    <Image
                      src={doc.thumbnailUrl}
                      alt={doc.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                ) : (
                  <div className="mb-4 flex h-40 w-full items-center justify-center rounded-xl bg-gradient-to-br from-primary-100 to-primary-50">
                    <BookOpen className="h-12 w-12 text-primary-600" />
                  </div>
                )}

                <div className="mb-2">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      doc.type === 'STUDY_DOC'
                        ? 'bg-primary-50 text-primary-700'
                        : 'bg-navy-50 text-navy-700'
                    }`}
                  >
                    {typeLabel(doc.type)}
                  </span>
                </div>

                <h3 className="mb-2 line-clamp-2 font-display text-lg font-bold text-navy-800">
                  {doc.title}
                </h3>
                {doc.description && (
                  <p className="mb-4 line-clamp-2 flex-grow text-sm text-navy-400">
                    {doc.description}
                  </p>
                )}
                {doc.category?.name && (
                  <p className="mb-4 text-xs text-navy-400">{doc.category.name}</p>
                )}

                <div className="mt-auto flex flex-col gap-2">
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => setPreviewDoc(doc)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Button>
                  <Button
                    fullWidth
                    disabled={!canDownload || downloadingId === doc.id}
                    isLoading={downloadingId === doc.id}
                    onClick={() => void handleDownload(doc)}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {doc.alreadyDownloaded ? 'Download again' : 'Download'}
                  </Button>
                  {!canDownload && (
                    <p className="text-center text-xs text-navy-400">
                      Download limit reached. View online or{' '}
                      <Link href="/pricing" className="text-primary-600 hover:underline">
                        renew
                      </Link>
                      .
                    </p>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={Boolean(previewDoc)}
        onClose={() => setPreviewDoc(null)}
        title={previewDoc ? previewDoc.title : 'Preview'}
        size="xl"
      >
        {previewDoc && (
          <iframe
            src={`/api/dashboard/library/documents/${previewDoc.id}/view`}
            title={`${previewDoc.title} preview`}
            className="h-[70vh] w-full rounded-xl border border-border"
          />
        )}
      </Modal>
    </div>
  );
}
