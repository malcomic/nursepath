import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Button from '../ui/Button';

interface CTAProps {
  title?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  variant?: 'primary' | 'secondary';
}

export default function CTA({
  title = 'Ready to Ace Your Exams?',
  description = 'Join successful nursing students and start your journey to exam success today.',
  primaryButtonText = 'Browse Study Guides',
  primaryButtonLink = '/services',
  secondaryButtonText = 'View Pricing',
  secondaryButtonLink = '/pricing',
  variant = 'primary',
}: CTAProps) {
  const bgClass =
    variant === 'primary'
      ? 'bg-gradient-to-r from-primary-600 to-secondary-600'
      : 'bg-gray-900';

  return (
    <section className={`${bgClass} py-20 relative overflow-hidden`}>
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-6">{title}</h2>
        <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">{description}</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href={primaryButtonLink}>
            <Button size="lg" variant="secondary" className="group">
              {primaryButtonText}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          {secondaryButtonText && secondaryButtonLink && (
            <Link href={secondaryButtonLink}>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                {secondaryButtonText}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
