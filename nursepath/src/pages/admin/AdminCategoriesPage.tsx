import { type ChangeEvent, type FormEvent, useEffect, useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { api } from '../../api';
import AdminLayout from '../../components/layout/AdminLayout';
import Modal from '../../components/ui/Modal';

interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string | null;
}

interface CategoryFormState {
  name: string;
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
    description: '',
    icon: '',
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setStatusMessage(null);
        const res = await api.get('/categories', true);
        setCategories(res.data || []);
      } catch (error) {
        setStatusMessage({
          type: 'error',
          text: error instanceof Error ? error.message : 'Failed to fetch categories.',
        });
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      icon: '',
    });
    setEditingCategoryId(null);
    setFormError(null);
  };

  const closeModal = () => {
    if (isSaving) return;
    setShowModal(false);
    resetForm();
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategoryId(category.id);
    setForm({
      name: category.name,
      description: category.description || '',
      icon: category.icon || '',
    });
    setFormError(null);
    setShowModal(true);
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
      description: form.description.trim() || undefined,
      icon: form.icon.trim() || undefined,
    };

    try {
      setIsSaving(true);
      setStatusMessage(null);

      if (editingCategoryId) {
        const res = await api.put(`/categories/${editingCategoryId}`, payload, true);
        setCategories((prev) =>
          prev.map((category) =>
            category.id === editingCategoryId ? { ...category, ...(res.data as Category) } : category
          )
        );
        setStatusMessage({ type: 'success', text: 'Category updated successfully.' });
      } else {
        const res = await api.post('/categories', payload, true);
        setCategories((prev) => [res.data as Category, ...prev]);
        setStatusMessage({ type: 'success', text: 'Category created successfully.' });
      }

      setShowModal(false);
      resetForm();
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : 'Failed to save category.'
      );
      console.error('Failed to save category:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    const confirmed = window.confirm('Delete this category permanently?');
    if (!confirmed) return;

    try {
      setStatusMessage(null);
      await api.delete(`/categories/${id}`, true);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      setStatusMessage({ type: 'success', text: 'Category deleted successfully.' });
    } catch (error) {
      setStatusMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to delete category.',
      });
      console.error('Failed to delete category:', error);
    }
  };

  return (
    <AdminLayout title="Categories">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Categories</h2>
            <p className="text-sm text-slate-500">
              Organize your guides into clear, searchable categories.
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="bg-blue-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 hover:bg-blue-700 transition shadow-sm"
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
            <div className="py-12 text-center text-slate-500">Loading categories...</div>
          ) : categories.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              No categories yet. Click &quot;Add Category&quot; to create one.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-500 hover:shadow-md transition-all group"
                >
                  {category.icon && (
                    <div className="text-xl mb-2" aria-hidden="true">
                      {category.icon}
                    </div>
                  )}
                  <h3 className="text-base font-semibold text-slate-900 mb-1 group-hover:text-blue-600">
                    {category.name}
                  </h3>
                  <p className="text-sm text-slate-500 mb-4">
                    {category.description || 'No description provided.'}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(category)}
                      className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition"
                    >
                      <Edit2 size={16} />
                      Edit
                    </button>
                    <button
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
      </div>

      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editingCategoryId ? 'Edit Category' : 'Add Category'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="rounded-lg bg-red-50 text-red-700 text-sm px-3 py-2 border border-red-200">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Category Name
            </label>
            <input
              value={form.name}
              onChange={handleFieldChange('name')}
              className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm"
              placeholder="e.g. NCLEX-RN"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Icon (optional)
            </label>
            <input
              value={form.icon}
              onChange={handleFieldChange('icon')}
              className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm"
              placeholder="e.g. 📚"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Description (optional)
            </label>
            <textarea
              value={form.description}
              onChange={handleFieldChange('description')}
              className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm min-h-24"
              placeholder="Short description of the category"
            />
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
              {isSaving ? 'Saving...' : editingCategoryId ? 'Update Category' : 'Create Category'}
            </button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
}

