import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronRight, TrendingUp, Award, Star, ShoppingBag, Eye, FileText, CheckCircle, BookCheck } from 'lucide-react';
import { api } from '../api';
import Navigation from '../components/Navigation';

interface Guide {
  id: string;
  title: string;
  description: string | null;
  price: number;
  categoryId: string;
  pdfUrl: string;
  thumbnailUrl: string | null;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    name: string;
    description: string | null;
    icon: string | null;
  };
}

interface Category {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
}

export default function HomePage() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  /**
   * Fetch guides and categories from API
   */
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
      setGuides((guidesRes.data || []).slice(0, 8)); // Show first 8 guides
      setCategories(categoriesRes.data || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Filter guides based on search query
   */
  const filteredGuides = guides.filter(
    (guide) =>
      guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (guide.description && guide.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  /**
   * Get category name by ID
   */
  const getCategoryName = (categoryId: string): string => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || 'Uncategorized';
  };

  return (
    <div className="bg-white">
      <Navigation />

      {/* Search & Header Section */}
      <section className="pt-12 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-100">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-blue-600 font-bold text-xs uppercase mb-2 tracking-widest">
              <TrendingUp className="w-4 h-4" />
              Verified Nursing Resources
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">Master Your Exams</h1>
            <p className="text-slate-500 mt-2 max-w-2xl">High-yield study guides designed by nurses to help you ace your exams.</p>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition shadow-sm"
            />
          </div>
        </div>
      </section>

      {/* 4-Column Study Guide Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
            <p className="text-slate-600 mt-4">Loading guides...</p>
          </div>
        ) : (
          <>
            {filteredGuides.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredGuides.map((guide) => (
                  <div
                    key={guide.id}
                    className="group bg-white border border-slate-200 rounded-[2rem] p-6 hover:shadow-2xl hover:border-blue-500 transition-all duration-300 flex flex-col h-full relative overflow-hidden"
                  >
                    {/* Background Decoration */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-slate-50 rounded-full group-hover:bg-blue-50 transition-colors duration-500 opacity-50"></div>

                    <div className="relative z-10 flex-grow">
                      <div className="flex justify-between items-start mb-4">
                        <span className="bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg">
                          {getCategoryName(guide.categoryId)}
                        </span>
                        <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="text-[10px] font-bold">4.8</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition line-clamp-2 min-h-[3.5rem] leading-tight mb-2">
                          {guide.title}
                        </h3>
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                          <FileText className="w-3.5 h-3.5" />
                          <span>Study Guide</span>
                          <span className="mx-1">•</span>
                          <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                          <span>2024 Updated</span>
                        </div>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                          <span className="flex items-center gap-1">
                            <ShoppingBag className="w-3.5 h-3.5" /> Premium Guide
                          </span>
                          <span className="text-blue-600">(Reviews)</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <div className="flex text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-current" />
                            ))}
                          </div>
                        </div>
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

                      <div className="grid grid-cols-1 gap-2">
                        <Link
                          to={`/guides/${guide.id}`}
                          className="w-full bg-blue-50 text-blue-600 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition shadow-sm border border-blue-100"
                        >
                          <Eye className="w-4 h-4" /> View Details
                        </Link>
                        <Link
                          to={`/purchase/${guide.id}`}
                          className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-500/20"
                        >
                          Buy Now
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-600 text-lg">No guides found matching your search.</p>
              </div>
            )}
          </>
        )}
      </section>

      {/* Exam Categories Quick Jump */}
      <section className="py-12 bg-slate-50 border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Browse by Category</h2>
            <Link to="/catalog" className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:underline">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.length > 0 ? (
              categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/catalog?category=${cat.id}`}
                  className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center justify-between hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/5 transition group"
                >
                  <span className="font-bold text-slate-900 group-hover:text-blue-600 transition">{cat.name}</span>
                  <div className="bg-slate-50 p-2 rounded-lg group-hover:bg-blue-50 transition">
                    <BookCheck className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition" />
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center text-slate-500">
                Loading categories...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Trust & Review CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>

          <Award className="text-blue-500 w-16 h-16 mx-auto mb-8 opacity-40" />
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Join Successful Students</h2>
          <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Our study guides are the most trusted resources for nursing exam preparation. Start your study journey today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/catalog"
              className="bg-white text-slate-900 px-10 py-5 rounded-2xl font-black text-lg hover:bg-slate-100 transition shadow-2xl"
            >
              Browse All Guides
            </Link>
            <Link
              to="/catalog"
              className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-blue-700 transition shadow-2xl shadow-blue-500/20"
            >
              Start Learning Today
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

