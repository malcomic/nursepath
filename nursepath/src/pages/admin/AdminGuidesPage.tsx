import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { api } from '../../api';
import AdminLayout from '../../components/layout/AdminLayout';

interface Category {
  id: string;
  name: string;
  description?: string;
}

interface Guide {
  id: string;
  title: string;
  description?: string;
  price: number;
  categoryId: string;
  pdfUrl: string;
}

export default function AdminGuidesPage() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [guidesRes, categoriesRes] = await Promise.all([
          api.get('/guides', true),
          api.get('/categories', true),
        ]);
        setGuides(guidesRes.data || []);
        setCategories(categoriesRes.data || []);
      } catch (error) {
        console.error('Failed to fetch guides/categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteGuide = async (id: string) => {
    try {
      await api.delete(`/guides/${id}`, true);
      setGuides((prev) => prev.filter((g) => g.id !== id));
    } catch (error) {
      console.error('Failed to delete guide:', error);
    }
  };

  return (
    <AdminLayout title="Study Guides">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Study Guides</h2>
            <p className="text-sm text-slate-500">
              Manage your digital study guides.
            </p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 hover:bg-blue-700 transition shadow-sm">
            <Plus size={18} />
            Add Guide
          </button>
        </div>

        <div className="p-6 overflow-x-auto">
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
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {guides.map((guide) => (
                  <tr
                    key={guide.id}
                    className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {guide.title}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {categories.find((c) => c.id === guide.categoryId)?.name || 'N/A'}
                    </td>
                    <td className="px-4 py-3 font-semibold text-blue-600">
                      ${guide.price.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg transition">
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteGuide(guide.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition"
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
      </div>
    </AdminLayout>
  );
}

