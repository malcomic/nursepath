import { BookOpen, Award, Clock, Users, Shield, TrendingUp } from 'lucide-react';
import Card from '../ui/Card';

const features = [
  {
    icon: BookOpen,
    title: 'Comprehensive Content',
    description: 'Detailed study guides covering all essential topics for your nursing exams.',
  },
  {
    icon: Award,
    title: 'Expert-Curated',
    description: 'Created by experienced nursing professionals and educators.',
  },
  {
    icon: Clock,
    title: 'Updated Regularly',
    description: 'All materials are kept up-to-date with the latest exam requirements.',
  },
  {
    icon: Users,
    title: 'Trusted by Thousands',
    description: 'Join over 10,000 students who have successfully passed their exams.',
  },
  {
    icon: Shield,
    title: 'Money-Back Guarantee',
    description: '100% satisfaction guarantee or your money back.',
  },
  {
    icon: TrendingUp,
    title: 'Proven Results',
    description: 'Students report significant improvement in their exam scores.',
  },
];

export default function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-4">
            Why Choose ScholarWriters?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to succeed in your nursing career, all in one place.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} hover className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center">
                    <Icon className="w-8 h-8 text-primary-600" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
