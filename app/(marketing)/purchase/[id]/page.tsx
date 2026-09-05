import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { guideService } from '@/lib/services/guideService';
import { ApiError } from '@/lib/errors/api-error';
import BuyNowRedirect from '@/components/checkout/BuyNowRedirect';

interface PurchasePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PurchasePageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const guide = await guideService.getGuide(id);
    return {
      title: `Checkout — ${guide.title}`,
      description: `Complete your purchase of ${guide.title}`,
      robots: { index: false, follow: false },
    };
  } catch {
    return { title: 'Checkout', robots: { index: false, follow: false } };
  }
}

export default async function PurchasePage({ params }: PurchasePageProps) {
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

  return (
    <BuyNowRedirect
      guide={{
        id: guide.id,
        slug: guide.slug,
        title: guide.title,
        description: guide.description,
        price: Number(guide.price),
        thumbnailUrl: guide.thumbnailUrl,
        stripePriceId: guide.stripePriceId,
      }}
    />
  );
}
