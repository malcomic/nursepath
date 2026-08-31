'use client';

import { type ChangeEvent, type FormEvent, useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, ExternalLink, Download } from 'lucide-react';
import Modal from '@/components/admin/Modal';
import { adminFetch, adminJson } from '@/lib/admin/api-client';

interface Category {
  id: string;
  name: string;
  description?: string;
}

interface Guide {
  id: string;
  title: string;
  slug: string;
  description?: string;
  price: number;
  stripePriceId?: string | null;
  categoryId: string;
  pdfUrl: string;
  thumbnailUrl?: string | null;
}

interface GuideFormState {
  title: string;
  slug: string;
  description: string;
  price: string;
  stripePriceId: string;
  categoryId: string;
  pdfUrl: string;
  thumbnailUrl: string;
}

const emptyForm: GuideFormState = {
  title: '',
  slug: '',
  description: '',
  price: '',
  stripePriceId: '',
  categoryId: '',
  pdfUrl: '',
  thumbnailUrl: '',
};

export default function AdminGuidesPage() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingGuideId, setEditingGuideId] = useState<string | null>(null);
  const [form, setForm] = useState<GuideFormState>(emptyForm);
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
  const [previewGuide, setPreviewGuide] = useState<Guide | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setStatusMessage(null);
        const [guidesRes, categoriesRes] = await Promise.all([
          adminJson<{ success: boolean; data: Guide[] }>('/api/guides'),
          adminJson<{ success: boolean; data: Category[] }>('/api/categories'),
        ]);
        setGuides(guidesRes.data || []);
        setCategories(categoriesRes.data || []);
      } catch (error) {
        setStatusMessage({
          type: 'error',
          text: error instanceof Error ? error.message : 'Failed to load guides and categories.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  const resetForm = () => {
    setForm(emptyForm);
    setPdfMode('url');
    setPdfFile(null);
    setThumbnailMode('url');
    setThumbnailFile(null);
    setThumbnailPreview('');
    setEditingGuideId(null);
    setFormError(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (guide: Guide) => {
    setEditingGuideId(guide.id);
    setForm({
      title: guide.title,
      slug: guide.slug || '',
      description: guide.description || '',
      price: guide.price.toString(),
      stripePriceId: guide.stripePriceId || '',
      categoryId: guide.categoryId,
      pdfUrl: guide.pdfUrl,
      thumbnailUrl: guide.thumbnailUrl || '',
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

  const handleDeleteGuide = async (id: string) => {
    if (!window.confirm('Delete this guide permanently?')) return;
    try {
      setStatusMessage(null);
      await adminJson(`/api/guides/${id}`, { method: 'DELETE' });
      setGuides((prev) => prev.filter((g) => g.id !== id));
      setStatusMessage({ type: 'success', text: 'Guide deleted successfully.' });
    } catch (error) {
      setStatusMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to delete guide.',
      });
    }
  };

  const handleFieldChange =
    (field: keyof GuideFormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const uploadThumbnail = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('thumbnail', file);
    const response = await adminFetch('/api/guides/upload-thumbnail', {
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

  const uploadPdf = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('pdf', file);
    const response = await adminFetch('/api/guides/upload-pdf', {
      method: 'POST',
      body: formData,
    });
    const result = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(result?.error || 'Failed to upload PDF');
    }
    if (!result?.data?.pdfUrl) {
      throw new Error('Upload succeeded but no PDF URL was returned');
    }
    return result.data.pdfUrl;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError(null);

    const parsedPrice = Number(form.price);
    if (!form.title.trim()) {
      setFormError('Title is required.');
      return;
    }
    if (!form.categoryId) {
      setFormError('Category is required.');
      return;
    }
    if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      setFormError('Price must be a valid number greater than 0.');
      return;
    }
    if (pdfMode === 'url' && !form.pdfUrl.trim()) {
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

      let pdfUrl = form.pdfUrl.trim();
      if (pdfMode === 'upload' && pdfFile) {
        pdfUrl = await uploadPdf(pdfFile);
      }

      let thumbnailUrl = form.thumbnailUrl.trim();
      if (thumbnailMode === 'upload' && thumbnailFile) {
        thumbnailUrl = await uploadThumbnail(thumbnailFile);
      }

      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim() || undefined,
        description: form.description.trim() || undefined,
        price: parsedPrice,
        stripePriceId: form.stripePriceId.trim() || undefined,
        categoryId: form.categoryId,
        pdfUrl,
        thumbnailUrl: thumbnailUrl || undefined,
      };

      if (editingGuideId) {
        const res = await adminJson<{ success: boolean; data: Guide }>(
          `/api/guides/${editingGuideId}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          }
        );
        setGuides((prev) =>
          prev.map((guide) =>
            guide.id === editingGuideId ? { ...guide, ...res.data } : guide
          )
        );
        setStatusMessage({ type: 'success', text: 'Guide updated successfully.' });
      } else {
        const res = await adminJson<{ success: boolean; data: Guide }>('/api/guides', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        setGuides((prev) => [res.data, ...prev]);
        setStatusMessage({ type: 'success', text: 'Guide created successfully.' });
      }

      setShowModal(false);
      resetForm();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Failed to save guide');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
      <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Study Guides</h2>
          <p className="text-sm text-slate-500">Manage your digital study guides.</p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="bg-blue-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 hover:bg-blue-700 transition shadow-sm"
        >
          <Plus size={18} />
          Add Guide
        </button>
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
          <div className="py-12 text-center text-slate-500">Loading guides...</div>
        ) : guides.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            No guides yet. Click &quot;Add Guide&quot; to create one.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">PDF</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {guides.map((guide) => (
                <tr
                  key={guide.id}
                  className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-slate-900">{guide.title}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {categories.find((c) => c.id === guide.categoryId)?.name || 'N/A'}
                  </td>
                  <td className="px-4 py-3 font-semibold text-blue-600">
                    ${guide.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setPreviewGuide(guide)}
                        className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-xs font-semibold"
                      >
                        <ExternalLink size={14} />
                        Preview
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          setIsDownloadingId(guide.id);
                          try {
                            const link = document.createElement('a');
                            link.href = guide.pdfUrl;
                            link.download = `${guide.title}.pdf`;
                            link.target = '_blank';
                            link.click();
                          } finally {
                            setIsDownloadingId(null);
                          }
                        }}
                        disabled={isDownloadingId === guide.id}
                        className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 text-xs font-semibold disabled:opacity-60"
                      >
                        <Download size={14} />
                        {isDownloadingId === guide.id ? 'Downloading...' : 'Download'}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(guide)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg transition"
                        aria-label={`Edit ${guide.title}`}
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteGuide(guide.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition"
                        aria-label={`Delete ${guide.title}`}
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
        title={editingGuideId ? 'Edit Guide' : 'Add Guide'}
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
              <label className="block text-sm font-semibold text-slate-700 mb-1">Title</label>
              <input
                value={form.title}
                onChange={handleFieldChange('title')}
                className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Slug (optional)
              </label>
              <input
                value={form.slug}
                onChange={handleFieldChange('slug')}
                className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm"
                placeholder="auto from title"
              />
              <p className="text-xs text-slate-500 mt-1">
                Public URL: /guides/your-slug. Leave blank to generate from title.
              </p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={handleFieldChange('description')}
                className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm min-h-24"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={form.categoryId}
                onChange={handleFieldChange('categoryId')}
                className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm"
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
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Price (USD)</label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={form.price}
                onChange={handleFieldChange('price')}
                className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Stripe Price ID (optional)
              </label>
              <input
                value={form.stripePriceId}
                onChange={handleFieldChange('stripePriceId')}
                className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm"
                placeholder="price_..."
              />
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl p-4 space-y-3">
            <p className="text-sm font-semibold text-slate-800">PDF File</p>
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
                value={form.pdfUrl}
                onChange={handleFieldChange('pdfUrl')}
                className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm"
                placeholder="https://example.com/guide.pdf"
              />
            ) : (
              <input
                type="file"
                accept="application/pdf,.pdf"
                onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm"
              />
            )}
          </div>

          <div className="border border-slate-200 rounded-xl p-4 space-y-3">
            <p className="text-sm font-semibold text-slate-800">Thumbnail</p>
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
                className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm"
              />
            ) : (
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm"
              />
            )}
            {(thumbnailPreview || (thumbnailMode === 'url' && form.thumbnailUrl.trim())) && (
              <img
                src={thumbnailPreview || form.thumbnailUrl.trim()}
                alt="Thumbnail preview"
                className="h-32 w-32 object-cover rounded-lg border border-slate-200"
              />
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 disabled:opacity-60"
            >
              {isSaving ? 'Saving...' : editingGuideId ? 'Update Guide' : 'Create Guide'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={Boolean(previewGuide)}
        onClose={() => setPreviewGuide(null)}
        title={previewGuide ? `${previewGuide.title} - PDF Preview` : 'PDF Preview'}
        size="xl"
      >
        {previewGuide && (
          <iframe
            src={previewGuide.pdfUrl}
            title={`${previewGuide.title} PDF preview`}
            className="w-full h-[70vh] rounded-xl border border-slate-200"
          />
        )}
      </Modal>
    </div>
  );
}
