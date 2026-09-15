import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { planService } from '@/lib/services/planService';
import LibraryCheckoutForm from '@/components/checkout/LibraryCheckoutForm';

export const metadata: Metadata = {
  title: 'Library checkout',
  description: 'Purchase prepaid library access on NursePath.',
};

type SearchParams = Promise<{ plan?: string }>;

export default async function LibraryCheckoutPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await auth();
  if (!session?.user?.email || !session.user.id) {
    const params = await searchParams;
    const plan = params.plan || 'week-1';
    redirect(`/login?callbackUrl=${encodeURIComponent(`/checkout/library?plan=${plan}`)}`);
  }

  const params = await searchParams;
  const planCode = params.plan?.trim() || 'week-1';

  let plan;
  try {
    plan = await planService.getByCode(planCode);
  } catch {
    redirect('/pricing');
  }

  return (
    <LibraryCheckoutForm
      plan={{
        code: plan.code,
        name: plan.name,
        description: plan.description,
        durationDays: plan.durationDays,
        priceUsd: plan.priceUsd,
      }}
      userEmail={session.user.email}
      userName={session.user.name}
    />
  );
}
