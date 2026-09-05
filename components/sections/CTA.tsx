import Link from 'next/link';
import Button from '../ui/Button';

interface CTAProps {
  title?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
}

export default function CTA({
  title = 'Ready to pass your nursing exams with confidence?',
  description = 'Browse expert-written PDF study guides and start studying in minutes — no account required.',
  primaryButtonText = 'Browse Study Guides',
  primaryButtonLink = '/services',
}: CTAProps) {
  return (
    <section className="bg-soft py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-navy-800 px-8 py-16 text-center sm:px-12">
          <h2 className="mx-auto mb-4 max-w-2xl font-display text-3xl font-extrabold text-white sm:text-4xl">
            {title}
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-navy-300">{description}</p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href={primaryButtonLink}>
              <Button size="lg">{primaryButtonText}</Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="!border-white !text-white hover:!bg-white/10"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
