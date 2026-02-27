import { Users, Target, Award, Heart } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Card from '../components/ui/Card';
import CTA from '../components/sections/CTA';

const values = [
  {
    icon: Target,
    title: 'Our Mission',
    description: 'To empower nursing students with high-quality study materials that help them succeed in their exams and advance their careers.',
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'We maintain the highest standards in content quality, ensuring all materials are accurate, up-to-date, and comprehensive.',
  },
  {
    icon: Heart,
    title: 'Student-Focused',
    description: 'Every decision we make is centered around helping students achieve their academic and professional goals.',
  },
  {
    icon: Users,
    title: 'Expert Team',
    description: 'Our content is created by experienced nursing professionals and educators who understand what students need.',
  },
];

const stats = [
  { number: '10,000+', label: 'Happy Students' },
  { number: '100+', label: 'Study Guides' },
  { number: '4.9/5', label: 'Average Rating' },
  { number: '98%', label: 'Pass Rate' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6">
              About ScholarWriters
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              We're dedicated to helping nursing students excel in their exams through comprehensive,
              expertly-crafted study materials.
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl md:text-5xl font-black text-primary-600 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-8 text-center">
              Our Story
            </h2>
            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
              <p>
                ScholarWriters was founded with a simple mission: to make high-quality exam preparation
                materials accessible to all nursing students. We recognized that many students struggle
                to find comprehensive, reliable study resources that truly prepare them for their exams.
              </p>
              <p>
                Our team of experienced nursing professionals and educators came together to create study
                guides that are not only comprehensive but also practical and easy to use. We understand
                the challenges students face because we've been there ourselves.
              </p>
              <p>
                Today, we're proud to have helped thousands of students achieve their academic goals. Our
                commitment to excellence and student success drives everything we do.
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-12 text-center">
              Our Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <Card key={index} hover className="text-center">
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center">
                        <Icon className="w-8 h-8 text-primary-600" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <CTA />
      </main>

      <Footer />
    </div>
  );
}
