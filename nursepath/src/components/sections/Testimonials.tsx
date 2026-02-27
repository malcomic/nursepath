import { Star, Quote } from 'lucide-react';
import Card from '../ui/Card';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Nursing Student',
    image: '👩‍⚕️',
    rating: 5,
    text: 'These study guides were a game-changer for my NCLEX exam. The content is comprehensive and well-organized. I passed on my first try!',
  },
  {
    name: 'Michael Chen',
    role: 'RN Candidate',
    image: '👨‍⚕️',
    rating: 5,
    text: 'The quality of the materials exceeded my expectations. The practice questions were especially helpful in identifying my weak areas.',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Nursing Graduate',
    image: '👩‍🎓',
    rating: 5,
    text: 'I used ScholarWriters guides for multiple exams throughout my program. Consistent quality and always up-to-date. Highly recommend!',
  },
  {
    name: 'David Thompson',
    role: 'Nurse Practitioner Student',
    image: '👨‍🎓',
    rating: 5,
    text: 'The guides are detailed yet easy to follow. They helped me understand complex concepts that I struggled with in class.',
  },
  {
    name: 'Jessica Martinez',
    role: 'BSN Student',
    image: '👩‍⚕️',
    rating: 5,
    text: 'Worth every penny! The study guides are professionally written and cover everything you need to know. My grades improved significantly.',
  },
  {
    name: 'Robert Williams',
    role: 'Nursing Student',
    image: '👨‍⚕️',
    rating: 5,
    text: 'Excellent resource for exam preparation. The format is clean, the content is accurate, and the support team is responsive.',
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-4">
            What Our Students Say
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what thousands of successful students have to say.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} hover className="relative">
              {/* Quote Icon */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <Quote className="w-6 h-6 text-primary-600" />
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-700 mb-6 leading-relaxed">{testimonial.text}</p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center text-2xl">
                  {testimonial.image}
                </div>
                <div>
                  <div className="font-bold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
