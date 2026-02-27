import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Lock, CheckCircle, FileText } from 'lucide-react';
import { api } from '../api';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

interface Guide {
  id: string;
  title: string;
  description?: string | null;
  price: number;
  pdfUrl: string;
  thumbnailUrl?: string | null;
}

export default function CheckoutPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [guide, setGuide] = useState<Guide | null>(null);
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [purchaseComplete, setPurchaseComplete] = useState(false);

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

      if (res.success) {
        setPurchaseComplete(true);
        // Store email for dashboard access
        localStorage.setItem('userEmail', buyerEmail);
      }
    } catch (error) {
      console.error('Purchase failed:', error);
      alert('Purchase failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-grow flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading checkout...</p>
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

  if (purchaseComplete) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-grow py-20">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="text-center">
              <div className="w-20 h-20 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-secondary-600" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
                Purchase Successful!
              </h1>
              <p className="text-xl text-gray-600 mb-10 max-w-xl mx-auto leading-relaxed">
                Thank you for your purchase of <span className="font-bold text-gray-900">"{guide.title}"</span>.
                You can now access your study guide from your dashboard.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/order-success">
                  <Button size="lg">View Order Details</Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="outline" size="lg">Go to Dashboard</Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Back</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <Card>
                <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-8">
                  Complete Your Purchase
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
                    <div className="space-y-4">
                      <Input
                        label="Full Name"
                        name="buyerName"
                        value={buyerName}
                        onChange={(e) => setBuyerName(e.target.value)}
                        required
                        placeholder="John Doe"
                      />
                      <Input
                        label="Email Address"
                        name="buyerEmail"
                        type="email"
                        value={buyerEmail}
                        onChange={(e) => setBuyerEmail(e.target.value)}
                        required
                        placeholder="john@example.com"
                        helperText="We'll send your download link to this email"
                      />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <Button
                      type="submit"
                      fullWidth
                      size="lg"
                      isLoading={submitting}
                      disabled={!buyerName || !buyerEmail}
                      className="group"
                    >
                      <Lock className="w-5 h-5 mr-2" />
                      Complete Purchase
                    </Button>
                    <p className="text-sm text-gray-500 mt-4 text-center">
                      Your payment is secure and encrypted
                    </p>
                  </div>
                </form>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                {/* Guide Info */}
                <div className="flex items-start gap-4 mb-6 pb-6 border-b border-gray-200">
                  {guide.thumbnailUrl ? (
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={guide.thumbnailUrl}
                        alt={guide.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-8 h-8 text-primary-600" />
                    </div>
                  )}
                  <div className="flex-grow min-w-0">
                    <h3 className="font-bold text-gray-900 line-clamp-2 mb-1">{guide.title}</h3>
                    <p className="text-sm text-gray-600">Study Guide - PDF</p>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${guide.price.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Tax</span>
                    <span>$0.00</span>
                  </div>
                  <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-black text-gray-900">
                      ${guide.price.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-secondary-600" />
                    <span>Instant download</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-secondary-600" />
                    <span>Lifetime access</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-secondary-600" />
                    <span>30-day money-back guarantee</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
