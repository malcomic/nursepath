import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { api } from '../../api';
import AdminLayout from '../../components/layout/AdminLayout';

interface Category {
  id: string;
  name: string;
  description?: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await api.get('/categories', true);
        setCategories(res.data || []);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleDeleteCategory = async (id: string) => {
    try {
      await api.delete(`/categories/${id}`, true);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
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
          <button className="bg-blue-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 hover:bg-blue-700 transition shadow-sm">
            <Plus size={18} />
            Add Category
          </button>
        </div>

        <div className="p-6">
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
                  <h3 className="text-base font-semibold text-slate-900 mb-1 group-hover:text-blue-600">
                    {category.name}
                  </h3>
                  <p className="text-sm text-slate-500 mb-4">
                    {category.description || 'No description provided.'}
                  </p>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition">
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
    </AdminLayout>
  );
}

