import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import Navigation from '../components/Navigation';

interface Category {
  id: string;
  name: string;
}

interface Guide {
  id: string;
  title: string;
  description?: string;
  price: number;
  category: Category;
}

export default function CatalogPage() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [guidesRes, categoriesRes] = await Promise.all([
        api.get('/guides'),
        api.get('/categories'),
      ]);
      let guides = guidesRes.data || [];

      if (selectedCategory) {
        guides = guides.filter((g: Guide) => g.category.id === selectedCategory);
      }

      if (searchQuery) {
        guides = guides.filter((g: Guide) =>
          g.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setGuides(guides);
      setCategories(categoriesRes.data || []);
    } catch (error) {
      console.error('Failed to fetch guides:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 500);
    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Header Section */}
      <section className="pt-12 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-100">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-8">Study Guides Catalog</h1>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-slate-700 mb-3">Search Guides</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 transition"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

      </section>

      {/* Guides Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
            <p className="text-slate-600 mt-4">Loading guides...</p>
          </div>
        ) : guides.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide) => (
              <div
                key={guide.id}
                className="group bg-white border border-slate-200 rounded-[2rem] p-6 hover:shadow-2xl hover:border-blue-500 transition-all duration-300 flex flex-col h-full relative overflow-hidden"
              >
                {/* Background Decoration */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-slate-50 rounded-full group-hover:bg-blue-50 transition-colors duration-500 opacity-50"></div>

                <div className="relative z-10 flex-grow">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg">
                      {guide.category.name}
                    </span>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition line-clamp-2 min-h-[3.5rem] leading-tight mb-2">
                      {guide.title}
                    </h3>
                    <p className="text-slate-500 text-sm line-clamp-2 text-slate-400">
                      {guide.description}
                    </p>
                  </div>
                </div>

                <div className="relative z-10 space-y-3 mt-auto">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-slate-900">
                      {guide.price === 0 ? 'FREE' : `$${guide.price.toFixed(2)}`}
                    </span>
                    {guide.price > 0 && (
                      <span className="text-xs font-bold text-slate-400 line-through">
                        ${(guide.price * 1.5).toFixed(0)}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to={`/guides/${guide.id}`}
                      className="w-full bg-blue-50 text-blue-600 py-2 rounded-xl font-bold text-sm flex items-center justify-center gap-1 hover:bg-blue-600 hover:text-white transition border border-blue-100"
                    >
                      View
                    </Link>
                    <Link
                      to={`/purchase/${guide.id}`}
                      className="w-full bg-blue-600 text-white py-2 rounded-xl font-bold text-sm flex items-center justify-center hover:bg-blue-700 transition shadow-lg shadow-blue-500/20"
                    >
                      Buy
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-slate-600 text-lg">No guides found. Try adjusting your filters.</p>
          </div>
        )}
      </section>
    </div>
  );
}
