'use client';

import { type ChangeEvent, type FormEvent, useEffect, useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import Modal from '@/components/admin/Modal';
import { adminJson } from '@/lib/admin/api-client';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string | null;
}

interface CategoryFormState {
  name: string;
  slug: string;
  description: string;
  icon: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'error' | 'success';
    text: string;
  } | null>(null);
  const [form, setForm] = useState<CategoryFormState>({
    name: '',
    slug: '',
    description: '',
    icon: '',
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await adminJson<{ success: boolean; data: Category[] }>('/api/categories');
        setCategories(res.data || []);
      } catch (error) {
        setStatusMessage({
          type: 'error',
          text: error instanceof Error ? error.message : 'Failed to fetch categories.',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const resetForm = () => {
    setForm({ name: '', slug: '', description: '', icon: '' });
    setEditingCategoryId(null);
    setFormError(null);
  };

  const closeModal = () => {
    if (isSaving) return;
    setShowModal(false);
    resetForm();
  };

  const handleFieldChange =
    (field: keyof CategoryFormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError(null);
    if (!form.name.trim()) {
      setFormError('Category name is required.');
      return;
    }

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim() || undefined,
      description: form.description.trim() || undefined,
      icon: form.icon.trim() || undefined,
    };

    try {
      setIsSaving(true);
      if (editingCategoryId) {
        const res = await adminJson<{ success: boolean; data: Category }>(
          `/api/categories/${editingCategoryId}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          }
        );
        setCategories((prev) =>
          prev.map((c) => (c.id === editingCategoryId ? { ...c, ...res.data } : c))
        );
        setStatusMessage({ type: 'success', text: 'Category updated successfully.' });
      } else {
        const res = await adminJson<{ success: boolean; data: Category }>('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        setCategories((prev) => [res.data, ...prev]);
        setStatusMessage({ type: 'success', text: 'Category created successfully.' });
      }
      setShowModal(false);
      resetForm();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Failed to save category.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('Delete this category permanently?')) return;
    try {
      await adminJson(`/api/categories/${id}`, { method: 'DELETE' });
      setCategories((prev) => prev.filter((c) => c.id !== id));
      setStatusMessage({ type: 'success', text: 'Category deleted successfully.' });
    } catch (error) {
      setStatusMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to delete category.',
      });
    }
  };

  return (
    <div className="bg-white border border-border rounded-2xl shadow-soft">
      <div className="px-6 py-5 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-navy-800">Categories</h2>
          <p className="text-sm text-navy-400">Organize your guides into clear categories.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-accent-500 text-white px-4 py-2.5 rounded-full font-display font-semibold text-sm flex items-center gap-2 hover:bg-accent-600 transition shadow-soft"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      <div className="p-6">
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
          <div className="py-12 text-center text-navy-400">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="py-12 text-center text-navy-400">No categories yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {categories.map((category) => (
              <div
                key={category.id}
                className="bg-white border border-border rounded-2xl p-5 hover:border-primary-500 hover:shadow-md transition-all"
              >
                {category.icon && <div className="text-xl mb-2">{category.icon}</div>}
                <h3 className="text-base font-semibold text-navy-800 mb-1">{category.name}</h3>
                {category.slug && (
                  <p className="text-xs text-navy-300 mb-1">/{category.slug}</p>
                )}
                <p className="text-sm text-navy-400 mb-4">
                  {category.description || 'No description provided.'}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCategoryId(category.id);
                      setForm({
                        name: category.name,
                        slug: category.slug || '',
                        description: category.description || '',
                        icon: category.icon || '',
                      });
                      setShowModal(true);
                    }}
                    className="flex-1 bg-primary-50 text-primary-600 hover:bg-primary-600 hover:text-white py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition"
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(category.id)}
                    className="flex-1 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editingCategoryId ? 'Edit Category' : 'Add Category'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="rounded-lg bg-red-50 text-red-700 text-sm px-3 py-2 border border-red-200">
              {formError}
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-navy-700 mb-1">Category Name</label>
            <input
              value={form.name}
              onChange={handleFieldChange('name')}
              className="w-full border border-border rounded-xl px-3 py-2.5 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-navy-700 mb-1">
              Slug (optional)
            </label>
            <input
              value={form.slug}
              onChange={handleFieldChange('slug')}
              placeholder="auto from name"
              className="w-full border border-border rounded-xl px-3 py-2.5 text-sm"
            />
            <p className="mt-1 text-xs text-navy-400">
              Public URL: /categories/your-slug. Leave blank to generate from name.
            </p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-navy-700 mb-1">Icon (optional)</label>
            <input
              value={form.icon}
              onChange={handleFieldChange('icon')}
              className="w-full border border-border rounded-xl px-3 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-navy-700 mb-1">
              Description (optional)
            </label>
            <textarea
              value={form.description}
              onChange={handleFieldChange('description')}
              className="w-full border border-border rounded-xl px-3 py-2.5 text-sm min-h-24"
            />
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
              {isSaving ? 'Saving...' : editingCategoryId ? 'Update Category' : 'Create Category'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
