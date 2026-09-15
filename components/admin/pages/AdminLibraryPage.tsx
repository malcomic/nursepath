'use client';

import { type ChangeEvent, type FormEvent, useEffect, useMemo, useState } from 'react';
import { Plus, Edit2, Trash2, ExternalLink, Download } from 'lucide-react';
import Modal from '@/components/admin/Modal';
import { adminFetch, adminJson } from '@/lib/admin/api-client';
import type { ContentType } from '@/lib/types';

interface Category {
  id: string;
  name: string;
  description?: string;
}

interface ContentDoc {
  id: string;
  type: ContentType;
  title: string;
  slug: string;
  description?: string | null;
  categoryId: string;
  fileUrl: string;
  previewPdfUrl?: string | null;
  thumbnailUrl?: string | null;
}

interface DocFormState {
  type: ContentType;
  title: string;
  slug: string;
  description: string;
  categoryId: string;
  fileUrl: string;
  thumbnailUrl: string;
}

type TypeFilter = 'ALL' | ContentType;

const emptyForm: DocFormState = {
  type: 'STUDY_DOC',
  title: '',
  slug: '',
  description: '',
  categoryId: '',
  fileUrl: '',
  thumbnailUrl: '',
};

function typeLabel(type: ContentType) {
  return type === 'STUDY_DOC' ? 'Study doc' : 'Q&A';
}

export default function AdminLibraryPage() {
  const [docs, setDocs] = useState<ContentDoc[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('ALL');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<DocFormState>(emptyForm);
  const [pdfMode, setPdfMode] = useState<'url' | 'upload'>('url');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [thumbnailMode, setThumbnailMode] = useState<'url' | 'upload'>('url');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloadingId, setIsDownloadingId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'error' | 'success';
    text: string;
  } | null>(null);
  const [previewDoc, setPreviewDoc] = useState<ContentDoc | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setStatusMessage(null);
        const [docsRes, categoriesRes] = await Promise.all([
          adminJson<{ success: boolean; data: ContentDoc[] }>('/api/content-documents'),
          adminJson<{ success: boolean; data: Category[] }>('/api/categories'),
        ]);
        setDocs(docsRes.data || []);
        setCategories(categoriesRes.data || []);
      } catch (error) {
        setStatusMessage({
          type: 'error',
          text:
            error instanceof Error
              ? error.message
              : 'Failed to load library documents and categories.',
        });
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, []);

  useEffect(() => {
    if (!thumbnailFile) {
      setThumbnailPreview('');
      return;
    }
    const objectUrl = URL.createObjectURL(thumbnailFile);
    setThumbnailPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [thumbnailFile]);

  const filteredDocs = useMemo(
    () => (typeFilter === 'ALL' ? docs : docs.filter((d) => d.type === typeFilter)),
    [docs, typeFilter]
  );

  const resetForm = () => {
    setForm(emptyForm);
    setPdfMode('url');
    setPdfFile(null);
    setThumbnailMode('url');
    setThumbnailFile(null);
    setThumbnailPreview('');
    setEditingId(null);
    setFormError(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (doc: ContentDoc) => {
    setEditingId(doc.id);
    setForm({
      type: doc.type,
      title: doc.title,
      slug: doc.slug || '',
      description: doc.description || '',
      categoryId: doc.categoryId,
      fileUrl: doc.fileUrl,
      thumbnailUrl: doc.thumbnailUrl || '',
    });
    setPdfMode('url');
    setPdfFile(null);
    setThumbnailMode('url');
    setThumbnailFile(null);
    setThumbnailPreview('');
    setFormError(null);
    setShowModal(true);
  };

  const closeModal = () => {
    if (isSaving) return;
    setShowModal(false);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this library document permanently?')) return;
    try {
      setStatusMessage(null);
      await adminJson(`/api/content-documents/${id}`, { method: 'DELETE' });
      setDocs((prev) => prev.filter((d) => d.id !== id));
      setStatusMessage({ type: 'success', text: 'Document deleted successfully.' });
    } catch (error) {
      setStatusMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to delete document.',
      });
    }
  };

  const handleFieldChange =
    (field: keyof DocFormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const uploadThumbnail = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('thumbnail', file);
    const response = await adminFetch('/api/content-documents/upload-thumbnail', {
      method: 'POST',
      body: formData,
    });
    const result = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(result?.error || 'Failed to upload thumbnail');
    }
    if (!result?.data?.thumbnailUrl) {
      throw new Error('Upload succeeded but no thumbnail URL was returned');
    }
    return result.data.thumbnailUrl;
  };

  const uploadPdf = async (
    file: File
  ): Promise<{ fileUrl: string; previewPdfUrl: string | null }> => {
    const formData = new FormData();
    formData.append('pdf', file);
    const response = await adminFetch('/api/content-documents/upload-pdf', {
      method: 'POST',
      body: formData,
    });
    const result = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(result?.error || 'Failed to upload PDF');
    }
    if (!result?.data?.fileUrl) {
      throw new Error('Upload succeeded but no file URL was returned');
    }
    return {
      fileUrl: result.data.fileUrl as string,
      previewPdfUrl: (result.data.previewPdfUrl as string | null | undefined) ?? null,
    };
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError(null);

    if (!form.title.trim()) {
      setFormError('Title is required.');
      return;
    }
    if (!form.categoryId) {
      setFormError('Category is required.');
      return;
    }
    if (pdfMode === 'url' && !form.fileUrl.trim()) {
      setFormError('PDF URL is required when using URL mode.');
      return;
    }
    if (pdfMode === 'upload' && !pdfFile) {
      setFormError('Please select a PDF file to upload.');
      return;
    }

    try {
      setIsSaving(true);
      setStatusMessage(null);

      let fileUrl = form.fileUrl.trim();
      let previewPdfUrl: string | null | undefined = undefined;
      if (pdfMode === 'upload' && pdfFile) {
        const uploaded = await uploadPdf(pdfFile);
        fileUrl = uploaded.fileUrl;
        previewPdfUrl = uploaded.previewPdfUrl;
      }

      let thumbnailUrl = form.thumbnailUrl.trim();
      if (thumbnailMode === 'upload' && thumbnailFile) {
        thumbnailUrl = await uploadThumbnail(thumbnailFile);
      }

      const payload = {
        type: form.type,
        title: form.title.trim(),
        slug: form.slug.trim() || undefined,
        description: form.description.trim() || undefined,
        categoryId: form.categoryId,
        fileUrl,
        ...(previewPdfUrl !== undefined ? { previewPdfUrl } : {}),
        thumbnailUrl: thumbnailUrl || undefined,
      };

      if (editingId) {
        const res = await adminJson<{ success: boolean; data: ContentDoc }>(
          `/api/content-documents/${editingId}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          }
        );
        setDocs((prev) =>
          prev.map((doc) => (doc.id === editingId ? { ...doc, ...res.data } : doc))
        );
        setStatusMessage({ type: 'success', text: 'Document updated successfully.' });
      } else {
        const res = await adminJson<{ success: boolean; data: ContentDoc }>(
          '/api/content-documents',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          }
        );
        setDocs((prev) => [res.data, ...prev]);
        setStatusMessage({ type: 'success', text: 'Document created successfully.' });
      }

      setShowModal(false);
      resetForm();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Failed to save document');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white border border-border rounded-2xl shadow-soft">
      <div className="px-6 py-5 border-b border-border flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-navy-800">Library</h2>
          <p className="text-sm text-navy-400">
            Manage study documents and Q&amp;A PDFs for prepaid library access.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="bg-accent-500 text-white px-4 py-2.5 rounded-full font-display font-semibold text-sm flex items-center gap-2 hover:bg-accent-600 transition shadow-soft self-start"
        >
          <Plus size={18} />
          Add document
        </button>
      </div>

      <div className="px-6 pt-4 flex flex-wrap gap-2">
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

      <div className="p-6 overflow-x-auto">
        {statusMessage && (
          <div
            className={`mb-4 rounded-lg border px-4 py-3 text-sm ${
              statusMessage.type === 'error'
                ? 'border-red-200 bg-red-50 text-red-700'
                : 'border-green-200 bg-green-50 text-green-700'
            }`}
          >
            {statusMessage.text}
          </div>
        )}

        {loading ? (
          <div className="py-12 text-center text-navy-400">Loading library…</div>
        ) : filteredDocs.length === 0 ? (
          <div className="py-12 text-center text-navy-400">
            No documents yet. Click &quot;Add document&quot; to create one.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs font-semibold text-navy-400 uppercase tracking-wide">
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">PDF</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.map((doc) => (
                <tr
                  key={doc.id}
                  className="border-b border-border hover:bg-soft/80 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-navy-800">{doc.title}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        doc.type === 'STUDY_DOC'
                          ? 'bg-primary-50 text-primary-700'
                          : 'bg-navy-50 text-navy-700'
                      }`}
                    >
                      {typeLabel(doc.type)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-navy-400">
                    {categories.find((c) => c.id === doc.categoryId)?.name || 'N/A'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setPreviewDoc(doc)}
                        className="inline-flex items-center gap-1.5 text-primary-600 hover:text-primary-700 text-xs font-semibold"
                      >
                        <ExternalLink size={14} />
                        Preview
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          setIsDownloadingId(doc.id);
                          try {
                            const res = await fetch(
                              `/api/admin/content-documents/${doc.id}/file?disposition=attachment`,
                              { credentials: 'include' }
                            );
                            if (!res.ok) {
                              throw new Error('Download failed');
                            }
                            const blob = await res.blob();
                            const url = URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = `${doc.title}.pdf`;
                            link.click();
                            URL.revokeObjectURL(url);
                          } catch {
                            setStatusMessage({
                              type: 'error',
                              text: 'Unable to download PDF',
                            });
                          } finally {
                            setIsDownloadingId(null);
                          }
                        }}
                        disabled={isDownloadingId === doc.id}
                        className="inline-flex items-center gap-1.5 text-navy-400 hover:text-navy-800 text-xs font-semibold disabled:opacity-60"
                      >
                        <Download size={14} />
                        {isDownloadingId === doc.id ? 'Downloading...' : 'Download'}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(doc)}
                        className="text-primary-600 hover:text-primary-700 hover:bg-primary-50 p-2 rounded-lg transition"
                        aria-label={`Edit ${doc.title}`}
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDelete(doc.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition"
                        aria-label={`Delete ${doc.title}`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editingId ? 'Edit document' : 'Add document'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="rounded-lg bg-red-50 text-red-700 text-sm px-3 py-2 border border-red-200">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-navy-700 mb-1">Title</label>
              <input
                value={form.title}
                onChange={handleFieldChange('title')}
                className="w-full border border-border rounded-xl px-3 py-2.5 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy-700 mb-1">Type</label>
              <select
                value={form.type}
                onChange={handleFieldChange('type')}
                className="w-full border border-border rounded-xl px-3 py-2.5 text-sm"
                required
              >
                <option value="STUDY_DOC">Study document</option>
                <option value="QA_DOC">Questions &amp; answers</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy-700 mb-1">Category</label>
              <select
                value={form.categoryId}
                onChange={handleFieldChange('categoryId')}
                className="w-full border border-border rounded-xl px-3 py-2.5 text-sm"
                required
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-navy-700 mb-1">
                Slug (optional)
              </label>
              <input
                value={form.slug}
                onChange={handleFieldChange('slug')}
                className="w-full border border-border rounded-xl px-3 py-2.5 text-sm"
                placeholder="auto from title"
              />
              <p className="text-xs text-navy-400 mt-1">
                Leave blank to generate from title.
              </p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-navy-700 mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={handleFieldChange('description')}
                className="w-full border border-border rounded-xl px-3 py-2.5 text-sm min-h-24"
              />
            </div>
          </div>

          <div className="border border-border rounded-xl p-4 space-y-3">
            <p className="text-sm font-semibold text-navy-800">PDF File</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={pdfMode === 'url'}
                  onChange={() => setPdfMode('url')}
                />
                Use URL
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={pdfMode === 'upload'}
                  onChange={() => setPdfMode('upload')}
                />
                Upload PDF
              </label>
            </div>
            {pdfMode === 'url' ? (
              <input
                type="url"
                value={form.fileUrl}
                onChange={handleFieldChange('fileUrl')}
                className="w-full border border-border rounded-xl px-3 py-2.5 text-sm"
                placeholder="https://example.com/document.pdf"
              />
            ) : (
              <input
                type="file"
                accept="application/pdf,.pdf"
                onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                className="w-full border border-border rounded-xl px-3 py-2.5 text-sm"
              />
            )}
          </div>

          <div className="border border-border rounded-xl p-4 space-y-3">
            <p className="text-sm font-semibold text-navy-800">Thumbnail</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={thumbnailMode === 'url'}
                  onChange={() => setThumbnailMode('url')}
                />
                Use URL
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={thumbnailMode === 'upload'}
                  onChange={() => setThumbnailMode('upload')}
                />
                Upload image file
              </label>
            </div>
            {thumbnailMode === 'url' ? (
              <input
                type="url"
                value={form.thumbnailUrl}
                onChange={handleFieldChange('thumbnailUrl')}
                className="w-full border border-border rounded-xl px-3 py-2.5 text-sm"
              />
            ) : (
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                className="w-full border border-border rounded-xl px-3 py-2.5 text-sm"
              />
            )}
            {(thumbnailPreview || (thumbnailMode === 'url' && form.thumbnailUrl.trim())) && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={thumbnailPreview || form.thumbnailUrl.trim()}
                alt="Thumbnail preview"
                className="h-32 w-32 object-cover rounded-lg border border-border"
              />
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2.5 rounded-xl border border-border text-navy-700 font-semibold text-sm"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2.5 rounded-full bg-accent-500 text-white font-display font-semibold text-sm hover:bg-accent-600 disabled:opacity-60"
            >
              {isSaving ? 'Saving...' : editingId ? 'Update document' : 'Create document'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={Boolean(previewDoc)}
        onClose={() => setPreviewDoc(null)}
        title={previewDoc ? `${previewDoc.title} - PDF Preview` : 'PDF Preview'}
        size="xl"
      >
        {previewDoc && (
          <iframe
            src={`/api/admin/content-documents/${previewDoc.id}/file?disposition=inline`}
            title={`${previewDoc.title} PDF preview`}
            className="w-full h-[70vh] rounded-xl border border-border"
          />
        )}
      </Modal>
    </div>
  );
}
