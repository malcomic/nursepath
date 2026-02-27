import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Card from '../components/ui/Card';

const blogPosts = [
  {
    id: 1,
    title: '10 Tips for Passing Your NCLEX Exam',
    excerpt: 'Discover proven strategies and study techniques that will help you pass the NCLEX on your first attempt.',
    date: '2024-01-15',
    readTime: '5 min read',
    category: 'Exam Tips',
  },
  {
    id: 2,
    title: 'How to Create an Effective Study Schedule',
    excerpt: 'Learn how to organize your study time effectively and maximize your learning potential.',
    date: '2024-01-10',
    readTime: '7 min read',
    category: 'Study Strategies',
  },
  {
    id: 3,
    title: 'Understanding Nursing Specializations',
    excerpt: 'Explore different nursing career paths and find the specialization that fits your interests.',
    date: '2024-01-05',
    readTime: '6 min read',
    category: 'Career Guide',
  },
  {
    id: 4,
    title: 'Top Resources for Nursing Students',
    excerpt: 'A comprehensive guide to the best study materials, apps, and tools for nursing students.',
    date: '2024-01-01',
    readTime: '8 min read',
    category: 'Resources',
  },
  {
    id: 5,
    title: 'Managing Stress During Exam Season',
    excerpt: 'Practical tips for maintaining your mental health and staying focused during exam preparation.',
    date: '2023-12-28',
    readTime: '5 min read',
    category: 'Wellness',
  },
  {
    id: 6,
    title: 'NCLEX Question Types Explained',
    excerpt: 'Break down the different types of questions you\'ll encounter on the NCLEX and how to approach them.',
    date: '2023-12-25',
    readTime: '6 min read',
    category: 'Exam Tips',
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6">
              Blog & Resources
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Expert tips, study strategies, and insights to help you succeed in your nursing career.
            </p>
          </div>
        </section>

        {/* Blog Posts */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <Card key={post.id} hover className="flex flex-col">
                  <div className="mb-4">
                    <span className="bg-primary-100 text-primary-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg inline-block">
                      {post.category}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 mb-6 flex-grow line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  <Link
                    to={`/blog/${post.id}`}
                    className="flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors group"
                  >
                    Read More
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
