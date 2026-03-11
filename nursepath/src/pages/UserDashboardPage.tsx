import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Calendar, Search, ExternalLink } from 'lucide-react';
import { api } from '../api';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

interface Order {
  id: string;
  paymentStatus: 'PAID' | 'PENDING' | 'FAILED' | 'REFUNDED';
  createdAt: string;
  guide?: {
    id: string;
    title: string;
    description?: string | null;
    price: number;
    thumbnailUrl?: string | null;
  };
}

export default function UserDashboardPage() {
  const [purchases, setPurchases] = useState<Order[]>([]);
  const [filteredPurchases, setFilteredPurchases] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPurchases();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = purchases.filter((purchase) =>
        purchase.guide?.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPurchases(filtered);
    } else {
      setFilteredPurchases(purchases);
    }
  }, [searchQuery, purchases]);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      // In a real app, you'd fetch user-specific purchases
      // For now, we'll use a mock or empty array
      const email = localStorage.getItem('userEmail');
      if (email) {
        // Fetch paid orders for this user (download link is shown on the success page).
        const res = await api.get(`/orders/by-email?email=${encodeURIComponent(email)}`);
        setPurchases(res.data || []);
        setFilteredPurchases(res.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch purchases:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
              My Dashboard
            </h1>
            <p className="text-xl text-gray-600">
              Manage your purchased study guides and track your progress.
            </p>
          </div>

          {/* Search */}
          <div className="mb-8">
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search your guides..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12"
              />
            </div>
          </div>

          {/* Purchases List */}
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your purchases...</p>
            </div>
          ) : filteredPurchases.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPurchases.map((purchase) => (
                <Card key={purchase.id} hover className="flex flex-col">
                  {purchase.guide?.thumbnailUrl ? (
                    <div className="w-full h-48 bg-gray-100 rounded-xl mb-4 overflow-hidden">
                      <img
                        src={purchase.guide.thumbnailUrl}
                        alt={purchase.guide.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl mb-4 flex items-center justify-center">
                      <FileText className="w-16 h-16 text-primary-600" />
                    </div>
                  )}

                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {purchase.guide?.title || 'Study Guide'}
                  </h3>

                  {purchase.guide?.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                      {purchase.guide.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Purchased {new Date(purchase.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  <Link to={`/payment-success?order_id=${encodeURIComponent(purchase.id)}`}>
                    <Button fullWidth className="group">
                      <ExternalLink className="w-5 h-5 mr-2" />
                      View download link
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-16">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Purchases Yet</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery
                  ? 'No guides found matching your search.'
                  : "You haven't purchased any study guides yet."}
              </p>
              <Link to="/services">
                <Button>Browse Study Guides</Button>
              </Link>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
