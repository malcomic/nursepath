import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
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
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const guide = await guideService.getGuide(id);
    return {
      title: guide.title,
      description: guide.description ?? `Study guide: ${guide.title}`,
      openGraph: {
        title: guide.title,
        description: guide.description ?? undefined,
        images: guide.thumbnailUrl ? [{ url: guide.thumbnailUrl }] : undefined,
      },
    };
  } catch {
    return { title: 'Guide Not Found' };
  }
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { id } = await params;

  let guide;
  try {
    guide = await guideService.getGuide(id);
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) {
      notFound();
    }
    throw error;
  }

  const baseUrl = process.env.PUBLIC_APP_URL ?? 'http://localhost:3000';
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
      url: `${baseUrl}/guides/${guide.id}`,
    },
  };

  return (
    <main className="bg-gray-50">
      <JsonLd data={productJsonLd} />

      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/services"
            className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Back to Services</span>
          </Link>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-primary-100 text-primary-700 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg">
                    {guide.category?.name || 'Uncategorized'}
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6 leading-tight">
                  {guide.title}
                </h1>

                {guide.description && (
                  <p className="text-xl text-gray-600 leading-relaxed">{guide.description}</p>
                )}
              </Card>

              <Card>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Award className="w-6 h-6 text-primary-600" />
                  What&apos;s Included
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-secondary-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">About This Guide</h2>
                <div className="space-y-4 text-gray-700">
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
              <Card className="sticky top-24">
                {guide.thumbnailUrl ? (
                  <div className="w-full h-48 bg-gray-100 rounded-xl mb-6 overflow-hidden relative">
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
                  <div className="w-full h-48 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl mb-6 flex items-center justify-center">
                    <FileText className="w-16 h-16 text-primary-600" />
                  </div>
                )}

                <div className="mb-6">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-4xl font-black text-gray-900">
                      {guide.price === 0 ? 'FREE' : `$${guide.price.toFixed(2)}`}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">One-time payment, lifetime access</p>
                </div>

                <GuidePurchaseButton guideId={guide.id} price={guide.price} />

                <div className="space-y-3 pt-6 mt-6 border-t border-gray-200">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <CheckCircle className="w-5 h-5 text-secondary-600" />
                    <span>Instant download</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Clock className="w-5 h-5 text-secondary-600" />
                    <span>Lifetime access</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <FileText className="w-5 h-5 text-secondary-600" />
                    <span>PDF format</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Award className="w-5 h-5 text-secondary-600" />
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
