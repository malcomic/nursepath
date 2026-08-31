import { Check } from 'lucide-react';
import Link from 'next/link';
import Card from '../ui/Card';
import Button from '../ui/Button';

const plans = [
  {
    name: 'Basic',
    price: 29,
    description: 'Perfect for individual exam preparation',
    features: [
      '1 Study Guide',
      'PDF Download',
      'Lifetime Access',
      'Email Support',
      'Mobile Friendly',
    ],
    popular: false,
  },
  {
    name: 'Professional',
    price: 79,
    description: 'Best for comprehensive exam coverage',
    features: [
      '5 Study Guides',
      'PDF Downloads',
      'Lifetime Access',
      'Priority Support',
      'Mobile Friendly',
      'Practice Questions',
      'Study Planner',
    ],
    popular: true,
  },
  {
    name: 'Premium',
    price: 149,
    description: 'Complete package for serious students',
    features: [
      'Unlimited Study Guides',
      'PDF Downloads',
      'Lifetime Access',
      '24/7 Priority Support',
      'Mobile Friendly',
      'Practice Questions',
      'Study Planner',
      'Video Tutorials',
      'Exam Simulator',
    ],
    popular: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that works best for you. All plans include our money-back guarantee.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-6">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative ${plan.popular ? 'ring-2 ring-primary-600 scale-105' : ''}`}
              hover
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-5xl font-black text-gray-900">${plan.price}</span>
                  <span className="text-gray-600">/one-time</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-secondary-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/services">
                <Button variant={plan.popular ? 'primary' : 'outline'} fullWidth size="lg">
                  Get Started
                </Button>
              </Link>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600">
            All plans include a 30-day money-back guarantee. No questions asked.
          </p>
        </div>
      </div>
    </section>
  );
}
