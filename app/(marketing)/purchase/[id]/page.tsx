import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { guideService } from '@/lib/services/guideService';
import { ApiError } from '@/lib/errors/api-error';
import CheckoutForm from '@/components/checkout/CheckoutForm';

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
    };
  } catch {
    return { title: 'Checkout' };
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
    <CheckoutForm
      guide={{
        id: guide.id,
        title: guide.title,
        description: guide.description,
        price: guide.price,
        thumbnailUrl: guide.thumbnailUrl,
        stripePriceId: guide.stripePriceId,
      }}
    />
  );
}
