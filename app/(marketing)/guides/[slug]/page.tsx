import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound, permanentRedirect } from 'next/navigation';
import { ArrowLeft, CheckCircle, FileText, Clock, Award } from 'lucide-react';
import { guideService } from '@/lib/services/guideService';
import { ApiError } from '@/lib/errors/api-error';
import Card from '@/components/ui/Card';
import GuidePurchaseButton from '@/components/guides/GuidePurchaseButton';
import JsonLd from '@/components/seo/JsonLd';

const features = [
  'Comprehensive nursing exam preparation material',
  'PDF format for easy access and offline viewing',
  'Instant download after purchase',
  'Updated for current exam standards',
  'Mobile-friendly format',
  'Lifetime access to purchased content',
];

interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const guide = await guideService.getGuideByParam(slug);
    const baseUrl = process.env.PUBLIC_APP_URL ?? 'http://localhost:3000';
    const canonical = `${baseUrl}/guides/${guide.slug}`;
    return {
      title: guide.title,
      description: guide.description ?? `Study guide: ${guide.title}`,
      alternates: { canonical },
      openGraph: {
        title: guide.title,
        description: guide.description ?? undefined,
        url: canonical,
        images: guide.thumbnailUrl ? [{ url: guide.thumbnailUrl }] : undefined,
      },
    };
  } catch {
    return { title: 'Guide Not Found' };
  }
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug: param } = await params;

  let guide;
  try {
    guide = await guideService.getGuideByParam(param);
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) {
      notFound();
    }
    throw error;
  }

  if (param === guide.id && guide.slug) {
    permanentRedirect(`/guides/${guide.slug}`);
  }

  const baseUrl = process.env.PUBLIC_APP_URL ?? 'http://localhost:3000';
  const guideUrl = `${baseUrl}/guides/${guide.slug}`;
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: guide.title,
    description: guide.description ?? guide.title,
    image: guide.thumbnailUrl ?? undefined,
    offers: {
      '@type': 'Offer',
      price: guide.price.toString(),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: guideUrl,
    },
  };

  return (
    <main className="bg-soft">
      <JsonLd data={productJsonLd} />

      <section className="border-b border-border bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/services"
            className="flex w-fit items-center gap-2 text-navy-400 transition-colors hover:text-primary-600"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-medium">Back to Catalog</span>
          </Link>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-8 lg:col-span-2">
              <Card>
                <div className="mb-4 flex items-center gap-3">
                  <span className="rounded-full bg-primary-100 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary-700">
                    {guide.category?.name || 'Uncategorized'}
                  </span>
                </div>

                <h1 className="mb-6 font-display text-4xl font-extrabold leading-tight text-navy-800 sm:text-5xl">
                  {guide.title}
                </h1>

                {guide.description && (
                  <p className="text-xl leading-relaxed text-navy-400">{guide.description}</p>
                )}
              </Card>

              <Card>
                <h2 className="mb-6 flex items-center gap-2 font-display text-2xl font-bold text-navy-800">
                  <Award className="h-6 w-6 text-primary-600" />
                  What&apos;s Included
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-secondary-600" />
                      <span className="text-navy-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <h2 className="mb-6 font-display text-2xl font-bold text-navy-800">About This Guide</h2>
                <div className="space-y-4 text-navy-400">
                  <p>
                    This comprehensive study guide has been carefully crafted by experienced nursing
                    professionals to help you succeed in your exams. It covers all essential topics
                    and includes practice questions, detailed explanations, and exam-taking
                    strategies.
                  </p>
                  <p>
                    Whether you&apos;re preparing for the NCLEX, nursing school exams, or continuing
                    education requirements, this guide provides the knowledge and confidence you need
                    to excel.
                  </p>
                </div>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-28">
                {guide.thumbnailUrl ? (
                  <div className="relative mb-6 h-48 w-full overflow-hidden rounded-xl bg-navy-50">
                    <Image
                      src={guide.thumbnailUrl}
                      alt={guide.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      priority
                    />
                  </div>
                ) : (
                  <div className="mb-6 flex h-48 w-full items-center justify-center rounded-xl bg-primary-50">
                    <FileText className="h-16 w-16 text-primary-600" />
                  </div>
                )}

                <div className="mb-6">
                  <div className="mb-2 flex items-baseline gap-3">
                    <span className="font-display text-4xl font-extrabold text-navy-800">
                      {Number(guide.price) === 0 ? 'FREE' : `$${Number(guide.price).toFixed(2)}`}
                    </span>
                  </div>
                  <p className="text-sm text-navy-400">One-time payment · Instant PDF download</p>
                </div>

                <GuidePurchaseButton
                  guideId={guide.id}
                  price={Number(guide.price)}
                  title={guide.title}
                  slug={guide.slug}
                  thumbnailUrl={guide.thumbnailUrl}
                />

                <div className="mt-6 space-y-3 border-t border-border pt-6">
                  <div className="flex items-center gap-3 text-sm text-navy-400">
                    <CheckCircle className="h-5 w-5 text-secondary-600" />
                    <span>Instant download</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-navy-400">
                    <Clock className="h-5 w-5 text-secondary-600" />
                    <span>No account required</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-navy-400">
                    <FileText className="h-5 w-5 text-secondary-600" />
                    <span>PDF format</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-navy-400">
                    <Award className="h-5 w-5 text-secondary-600" />
                    <span>30-day money-back guarantee</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
