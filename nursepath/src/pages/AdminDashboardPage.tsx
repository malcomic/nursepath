import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { api } from '../api';
import Navigation from '../components/Navigation';

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

type TabType = 'guides' | 'categories';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('guides');
  const [guides, setGuides] = useState<Guide[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = api.getAuthToken();
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [guidesRes, categoriesRes] = await Promise.all([
        api.get('/guides'),
        api.get('/categories'),
      ]);
      setGuides(guidesRes.data || []);
      setCategories(categoriesRes.data || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGuide = async (id: string) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await api.delete(`/guides/${id}`, true);
      setGuides(guides.filter((g) => g.id !== id));
    } catch (error) {
      console.error('Failed to delete guide:', error);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await api.delete(`/categories/${id}`, true);
      setCategories(categories.filter((c) => c.id !== id));
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <div className="inline-block bg-blue-600 text-white rounded-2xl p-3 mb-4">
            <span className="text-2xl font-black">⚙️</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-600 mt-2">Manage your study guides and categories</p>
        </div>

        {/* Tabs */}
        <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-xl mb-8">
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab('guides')}
              className={`flex-1 px-6 py-5 font-bold text-lg transition ${
                activeTab === 'guides'
                  ? 'border-b-4 border-blue-600 text-blue-600 bg-blue-50'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📚 Study Guides
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`flex-1 px-6 py-5 font-bold text-lg transition ${
                activeTab === 'categories'
                  ? 'border-b-4 border-blue-600 text-blue-600 bg-blue-50'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🏷️ Categories
            </button>
          </div>

          {/* Content */}
          <div className="p-8 md:p-12">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
                <p className="text-slate-600 mt-4">Loading...</p>
              </div>
            ) : activeTab === 'guides' ? (
              <div>
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-black text-slate-900">Study Guides</h2>
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-500/20">
                    <Plus size={20} />
                    Add Guide
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {guides.length > 0 ? (
                        guides.map((guide) => (
                          <tr key={guide.id} className="border-b border-slate-100 hover:bg-blue-50 transition">
                            <td className="px-6 py-4 text-slate-900 font-medium">{guide.title}</td>
                            <td className="px-6 py-4 text-slate-700">
                              {categories.find((c) => c.id === guide.categoryId)?.name || 'N/A'}
                            </td>
                            <td className="px-6 py-4 font-bold text-blue-600">${guide.price.toFixed(2)}</td>
                            <td className="px-6 py-4 flex gap-2">
                              <button className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg transition">
                                <Edit2 size={20} />
                              </button>
                              <button
                                onClick={() => handleDeleteGuide(guide.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition"
                              >
                                <Trash2 size={20} />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-6 py-8 text-center text-slate-600">
                            No guides yet. Click "Add Guide" to create one.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-black text-slate-900">Categories</h2>
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-500/20">
                    <Plus size={20} />
                    Add Category
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <div
                        key={category.id}
                        className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-blue-500 transition-all duration-300 group"
                      >
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition mb-2">
                          {category.name}
                        </h3>
                        <p className="text-slate-600 text-sm mb-6 line-clamp-2">{category.description || 'No description'}</p>
                        <div className="flex gap-3">
                          <button className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition">
                            <Edit2 size={18} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="flex-1 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition"
                          >
                            <Trash2 size={18} />
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12 text-slate-600">
                      No categories yet. Click "Add Category" to create one.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
