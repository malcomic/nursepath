import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';
import Navigation from '../components/Navigation';

interface Guide {
  id: string;
  title: string;
  price: number;
  pdfUrl: string;
}

export default function PurchasePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [guide, setGuide] = useState<Guide | null>(null);
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      setSubmitting(true);
      const res = await api.post('/purchases', {
        guideId: id,
        buyerName,
        buyerEmail,
      });

      if (res.success && res.data?.downloadUrl) {
        setDownloadUrl(res.data.downloadUrl);
      }
    } catch (error) {
      console.error('Purchase failed:', error);
      alert('Purchase failed. Please try again.');
    } finally {
      setSubmitting(false);
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

  if (downloadUrl) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white border border-slate-200 rounded-[2rem] p-12 text-center">
            <div className="text-8xl mb-6">✓</div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Purchase Successful!</h1>
            <p className="text-slate-600 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Your purchase of <span className="font-bold text-slate-900">"{guide.title}"</span> is complete. Your download link is ready below.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={downloadUrl}
                download
                className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-500/20"
              >
                ↓ Download PDF
              </a>
              <button
                onClick={() => navigate('/catalog')}
                className="bg-slate-100 text-slate-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-200 transition border border-slate-200"
              >
                Back to Catalog
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => navigate('/catalog')}
          className="text-blue-600 font-bold text-sm mb-8 flex items-center gap-1 hover:text-blue-700"
        >
          ← Back to Catalog
        </button>

        <div className="bg-white border border-slate-200 rounded-[2rem] p-8 md:p-12">
          <h1 className="text-4xl font-black text-slate-900 mb-8">Complete Your Purchase</h1>

          {/* Guide Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-1">Guide</p>
                <p className="text-lg font-black text-slate-900">{guide.title}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-1">Total Price</p>
                <p className="text-3xl font-black text-blue-600">${guide.price.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">Full Name *</label>
              <input
                type="text"
                required
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 transition"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">Email Address *</label>
              <input
                type="email"
                required
                value={buyerEmail}
                onChange={(e) => setBuyerEmail(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 transition"
                placeholder="john@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || !buyerName || !buyerEmail}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-black text-lg hover:bg-blue-700 transition disabled:bg-slate-300 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
            >
              {submitting ? 'Processing...' : '💳 Complete Purchase'}
            </button>
          </form>

          <p className="text-sm text-slate-600 mt-8 text-center leading-relaxed">
            <span className="font-bold text-slate-700">No account needed.</span> Your PDF will be ready for download immediately after purchase.
          </p>
        </div>
      </div>
    </div>
  );
}
