import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';
import Navigation from '../components/Navigation';

interface Guide {
  id: string;
  title: string;
  description?: string;
  price: number;
  category: { id: string; name: string };
  pdfUrl: string;
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [guide, setGuide] = useState<Guide | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchGuide();
  }, [id]);

  const fetchGuide = async () => {
    try {
      const res = await api.get(`/guides/${id}`);
      setGuide(res.data);
    } catch (error) {
      console.error('Failed to fetch guide:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  if (!guide)
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="text-center py-20 max-w-7xl mx-auto px-4">
          <p className="text-slate-600 text-lg">Guide not found</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => navigate('/catalog')}
          className="text-blue-600 font-bold text-sm mb-8 flex items-center gap-1 hover:text-blue-700"
        >
          ← Back to Catalog
        </button>

        <div className="bg-white border border-slate-200 rounded-[2rem] p-8 md:p-12">
          <div className="mb-8">
            <span className="bg-slate-100 text-slate-600 text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-lg inline-block">
              {guide.category.name}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
            {guide.title}
          </h1>

          <p className="text-slate-600 text-lg leading-relaxed mb-12 max-w-2xl">
            {guide.description}
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
                <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-4">Guide Highlights</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span className="text-slate-700">Comprehensive nursing exam preparation material</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span className="text-slate-700">PDF format for easy access and offline viewing</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span className="text-slate-700">Instant download after purchase</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span className="text-slate-700">Updated for 2024 exam standards</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-blue-50 rounded-2xl p-8 border border-blue-200 h-fit">
              <div className="mb-6">
                <p className="text-slate-600 text-sm font-bold uppercase tracking-wider mb-2">Price</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-slate-900">
                    {guide.price === 0 ? 'FREE' : `$${guide.price.toFixed(2)}`}
                  </span>
                  {guide.price > 0 && (
                    <span className="text-lg font-bold text-slate-400 line-through">
                      ${(guide.price * 1.5).toFixed(0)}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => navigate(`/purchase/${guide.id}`)}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-black text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-500/20"
              >
                Buy Now
              </button>
              <p className="text-xs text-slate-600 mt-4 text-center">
                No account needed. Download immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
