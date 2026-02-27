import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Star, FileText, Download, ShoppingBag, Clock, Award } from 'lucide-react';
import { api } from '../api';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

interface Guide {
  id: string;
  title: string;
  description?: string | null;
  price: number;
  categoryId: string;
  pdfUrl: string;
  thumbnailUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    name: string;
  };
}

export default function GuideDetailPage() {
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
      setLoading(true);
      const res = await api.get(`/guides/${id}`);
      setGuide(res.data);
    } catch (error) {
      console.error('Failed to fetch guide:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-grow flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading guide...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-grow flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-gray-600 text-lg mb-4">Guide not found</p>
            <Link to="/services">
              <Button>Back to Services</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const features = [
    'Comprehensive nursing exam preparation material',
    'PDF format for easy access and offline viewing',
    'Instant download after purchase',
    'Updated for 2024 exam standards',
    'Mobile-friendly format',
    'Lifetime access to purchased content',
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow">
        {/* Breadcrumb */}
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
              onClick={() => navigate('/services')}
              className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium">Back to Services</span>
            </button>
          </div>
        </section>

        {/* Guide Details */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Header */}
                <Card>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-primary-100 text-primary-700 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg">
                      {guide.category?.name || 'Uncategorized'}
                    </span>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-bold">4.8</span>
                      <span className="text-sm text-gray-500">(127 reviews)</span>
                    </div>
                  </div>

                  <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6 leading-tight">
                    {guide.title}
                  </h1>

                  {guide.description && (
                    <p className="text-xl text-gray-600 leading-relaxed mb-8">
                      {guide.description}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                    <div className="text-center">
                      <div className="text-2xl font-black text-gray-900">10K+</div>
                      <div className="text-sm text-gray-600">Students</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-black text-gray-900">4.8/5</div>
                      <div className="text-sm text-gray-600">Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-black text-gray-900">2024</div>
                      <div className="text-sm text-gray-600">Updated</div>
                    </div>
                  </div>
                </Card>

                {/* Features */}
                <Card>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Award className="w-6 h-6 text-primary-600" />
                    What's Included
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-secondary-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Additional Info */}
                <Card>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">About This Guide</h2>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      This comprehensive study guide has been carefully crafted by experienced nursing professionals
                      to help you succeed in your exams. It covers all essential topics and includes practice questions,
                      detailed explanations, and exam-taking strategies.
                    </p>
                    <p>
                      Whether you're preparing for the NCLEX, nursing school exams, or continuing education requirements,
                      this guide provides the knowledge and confidence you need to excel.
                    </p>
                  </div>
                </Card>
              </div>

              {/* Sidebar - Purchase Card */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  {guide.thumbnailUrl ? (
                    <div className="w-full h-48 bg-gray-100 rounded-xl mb-6 overflow-hidden">
                      <img
                        src={guide.thumbnailUrl}
                        alt={guide.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl mb-6 flex items-center justify-center">
                      <FileText className="w-16 h-16 text-primary-600" />
                    </div>
                  )}

                  <div className="mb-6">
                    <div className="flex items-baseline gap-3 mb-2">
                      <span className="text-4xl font-black text-gray-900">
                        {guide.price === 0 ? 'FREE' : `$${guide.price.toFixed(2)}`}
                      </span>
                      {guide.price > 0 && (
                        <span className="text-lg font-bold text-gray-400 line-through">
                          ${(guide.price * 1.5).toFixed(0)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">One-time payment, lifetime access</p>
                  </div>

                  <div className="space-y-3 mb-6">
                    <Link to={`/purchase/${guide.id}`}>
                      <Button fullWidth size="lg" className="group">
                        <ShoppingBag className="w-5 h-5 mr-2" />
                        Purchase Now
                      </Button>
                    </Link>
                    <Button variant="outline" fullWidth size="lg">
                      <Download className="w-5 h-5 mr-2" />
                      Preview Sample
                    </Button>
                  </div>

                  <div className="space-y-3 pt-6 border-t border-gray-200">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <CheckCircle className="w-5 h-5 text-secondary-600" />
                      <span>Instant download</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Clock className="w-5 h-5 text-secondary-600" />
                      <span>Lifetime access</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <FileText className="w-5 h-5 text-secondary-600" />
                      <span>PDF format</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Award className="w-5 h-5 text-secondary-600" />
                      <span>30-day money-back guarantee</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
