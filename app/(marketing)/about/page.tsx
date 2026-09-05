import type { Metadata } from 'next';
import { Users, Target, Award, Heart } from 'lucide-react';
import Card from '@/components/ui/Card';
import CTA from '@/components/sections/CTA';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about NursePath — our mission to help nursing students succeed with expert study guides and exam prep resources.',
};

const values = [
  {
    icon: Target,
    title: 'Our Mission',
    description:
      'To empower nursing students with high-quality study materials that help them succeed in their exams and advance their careers.',
  },
  {
    icon: Award,
    title: 'Excellence',
    description:
      'We maintain the highest standards in content quality, ensuring all materials are accurate, up-to-date, and comprehensive.',
  },
  {
    icon: Heart,
    title: 'Student-Focused',
    description:
      'Every decision we make is centered around helping students achieve their academic and professional goals.',
  },
  {
    icon: Users,
    title: 'Expert Team',
    description:
      'Our content is created by experienced nursing professionals and educators who understand what students need.',
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
    <main>
      <section className="bg-navy-800 py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-6 font-display text-4xl font-extrabold sm:text-5xl lg:text-6xl">
            About NursePath
          </h1>
          <p className="text-xl leading-relaxed text-navy-200">
            We&apos;re dedicated to helping nursing students excel in their exams through
            comprehensive, expertly-crafted study materials.
          </p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="mb-2 font-display text-4xl font-extrabold text-primary-600 md:text-5xl">
                  {stat.number}
                </div>
                <div className="font-medium text-navy-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-soft py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-center font-display text-3xl font-extrabold text-navy-800 sm:text-4xl">
            Our Story
          </h2>
          <div className="space-y-6 text-lg leading-relaxed text-navy-400">
            <p>
              NursePath was founded with a simple mission: to make high-quality exam preparation
              materials accessible to all nursing students. We recognized that many students struggle
              to find comprehensive, reliable study resources that truly prepare them for their exams.
            </p>
            <p>
              Our team of experienced nursing professionals and educators came together to create
              study guides that are not only comprehensive but also practical and easy to use. We
              understand the challenges students face because we&apos;ve been there ourselves.
            </p>
            <p>
              Today, we&apos;re proud to have helped thousands of students achieve their academic
              goals. Our commitment to excellence and student success drives everything we do.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center font-display text-3xl font-extrabold text-navy-800 sm:text-4xl">
            Our Values
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} hover className="text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100">
                      <Icon className="h-8 w-8 text-primary-600" />
                    </div>
                  </div>
                  <h3 className="mb-3 font-display text-xl font-bold text-navy-800">{value.title}</h3>
                  <p className="leading-relaxed text-navy-400">{value.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <CTA />
    </main>
  );
}
