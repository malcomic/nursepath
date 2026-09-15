import { Check } from 'lucide-react';
import Link from 'next/link';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { auth } from '@/lib/auth';
import { planService } from '@/lib/services/planService';

function formatDuration(days: number) {
  if (days === 1) return '1 day';
  if (days === 7) return '1 week';
  if (days === 30) return '1 month';
  return `${days} days`;
}

export default async function Pricing() {
  const session = await auth();
  const plans = await planService.listActive();
  const isLoggedIn = !!session?.user;

  const featuresByCode: Record<string, string[]> = {
    'day-1': [
      'Full study docs + Q&A library',
      'View online in your browser',
      'Up to 3 unique downloads',
      'Access for 24 hours',
    ],
    'week-1': [
      'Full study docs + Q&A library',
      'View online in your browser',
      'Up to 3 unique downloads',
      'Access for 7 days',
      'Best for exam week',
    ],
    'month-1': [
      'Full study docs + Q&A library',
      'View online in your browser',
      'Up to 3 unique downloads',
      'Access for 30 days',
      'Best value for long prep',
    ],
  };

  return (
    <section id="pricing" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-display text-3xl font-extrabold text-navy-800 sm:text-4xl lg:text-5xl">
            Library access passes
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-navy-400">
            Prepaid access to study documents and questions with answers. No auto-renew — buy
            another pass anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-6">
          {plans.map((plan) => {
            const popular = plan.code === 'week-1';
            const checkoutPath = `/checkout/library?plan=${encodeURIComponent(plan.code)}`;
            const href = isLoggedIn
              ? checkoutPath
              : `/login?callbackUrl=${encodeURIComponent(checkoutPath)}`;
            const features =
              featuresByCode[plan.code] ??
              [
                'Full library access',
                `Access for ${formatDuration(plan.durationDays)}`,
                'Up to 3 unique downloads',
              ];

            return (
              <Card
                key={plan.id}
                className={`relative ${popular ? 'ring-2 ring-primary-600 scale-105' : ''}`}
                hover
              >
                {popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform">
                    <span className="rounded-full bg-primary-600 px-4 py-1 text-sm font-semibold text-white">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-8 text-center">
                  <h3 className="mb-2 text-2xl font-bold text-navy-800">{plan.name}</h3>
                  <p className="mb-6 text-navy-400">
                    {plan.description || `Prepaid access for ${formatDuration(plan.durationDays)}`}
                  </p>
                  <div className="mb-2">
                    <span className="text-5xl font-black text-navy-800">
                      ${plan.priceUsd.toFixed(0)}
                    </span>
                    <span className="text-navy-400"> / {formatDuration(plan.durationDays)}</span>
                  </div>
                </div>

                <ul className="mb-8 space-y-4">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-secondary-600" />
                      <span className="text-navy-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href={href}>
                  <Button variant={popular ? 'primary' : 'outline'} fullWidth size="lg">
                    Get access
                  </Button>
                </Link>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-navy-400">
            One-time study guides remain available separately.{' '}
            <Link href="/services" className="font-semibold text-primary-600 hover:text-primary-700">
              Browse guides
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
