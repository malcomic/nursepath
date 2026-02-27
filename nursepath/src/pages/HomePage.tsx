import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, BookCheck } from 'lucide-react';
import { api } from '../api';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Hero from '../components/sections/Hero';
import Features from '../components/sections/Features';
import HowItWorks from '../components/sections/HowItWorks';
import Pricing from '../components/sections/Pricing';
import Testimonials from '../components/sections/Testimonials';
import FAQ from '../components/sections/FAQ';
import CTA from '../components/sections/CTA';
import GuideGrid from '../components/guides/GuideGrid';
import type { Guide } from '../types';

interface Category {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
}

export default function HomePage() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
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
      setGuides((guidesRes.data || []).slice(0, 8));
      setCategories(categoriesRes.data || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <Hero />

        {/* Featured Study Guides */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-4">
                  Featured Study Guides
                </h2>
                <p className="text-xl text-gray-600">
                  Handpicked resources to help you excel in your exams
                </p>
              </div>
              <Link
                to="/services"
                className="hidden md:flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors"
              >
                View All
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
            <GuideGrid guides={guides} loading={loading} />
            <div className="text-center mt-8 md:hidden">
              <Link
                to="/services"
                className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors"
              >
                View All Guides
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        {categories.length > 0 && (
          <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-4">
                    Browse by Category
                  </h2>
                  <p className="text-xl text-gray-600">
                    Find study guides for your specific exam type
                  </p>
                </div>
                <Link
                  to="/services"
                  className="hidden md:flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors"
                >
                  View All
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/services?category=${cat.id}`}
                    className="bg-white p-6 rounded-2xl border border-gray-200 flex items-center justify-between hover:border-primary-500 hover:shadow-xl hover:shadow-primary-500/5 transition-all group"
                  >
                    <span className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {cat.name}
                    </span>
                    <div className="bg-gray-50 p-2 rounded-lg group-hover:bg-primary-50 transition-colors">
                      <BookCheck className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Features Section */}
        <Features />

        {/* How It Works Section */}
        <HowItWorks />

        {/* Pricing Preview Section */}
        <Pricing />

        {/* Testimonials Section */}
        <Testimonials />

        {/* FAQ Section */}
        <FAQ />

        {/* Final CTA Section */}
        <CTA />
      </main>

      <Footer />
    </div>
  );
}
