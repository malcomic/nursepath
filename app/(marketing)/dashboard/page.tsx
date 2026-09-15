import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, FileText } from 'lucide-react';
import { auth } from '@/lib/auth';
import { buyerAuthService } from '@/lib/services/buyerAuthService';
import { getLibraryAccess } from '@/lib/subscriptions/access';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Your NursePath account overview.',
};

function daysLeft(endsAt: Date, now = new Date()) {
  return Math.max(0, Math.ceil((endsAt.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)));
}

export default async function DashboardOverviewPage() {
  const session = await auth();
  const email = session?.user?.email ?? '';
  const userId = session?.user?.id;
  const orders = email && userId
    ? await buyerAuthService.listSessionOrders(email, userId)
    : email
      ? await buyerAuthService.listSessionOrders(email)
      : [];
  const guideCount = orders.length;

  const access = userId
    ? await getLibraryAccess(userId)
    : { hasAccess: false, endsAt: null, planName: null, planCode: null };

  const remainingDays =
    access.hasAccess && access.endsAt ? daysLeft(access.endsAt) : null;
  const showExtend =
    access.hasAccess && remainingDays !== null && remainingDays <= 3;

  const endsAtLabel = access.endsAt
    ? access.endsAt.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <Card className="flex flex-col">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100">
          <FileText className="h-6 w-6 text-primary-600" />
        </div>
        <h2 className="font-display text-xl font-bold text-navy-800">My Guides</h2>
        <p className="mt-2 flex-grow text-sm text-navy-400">
          {guideCount === 0
            ? 'No purchased guides yet for this email.'
            : `You have ${guideCount} purchased guide${guideCount === 1 ? '' : 's'}.`}
        </p>
        <div className="mt-6">
          <Link href="/dashboard/guides">
            <Button variant="outline" fullWidth>
              View guides
            </Button>
          </Link>
        </div>
      </Card>

      <Card className="flex flex-col">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-navy-50">
          <BookOpen className="h-6 w-6 text-navy-500" />
        </div>
        <h2 className="font-display text-xl font-bold text-navy-800">Library access</h2>
        <p className="mt-2 flex-grow text-sm text-navy-400">
          {access.hasAccess && endsAtLabel
            ? `Active until ${endsAtLabel}${
                remainingDays !== null
                  ? ` · ${remainingDays} day${remainingDays === 1 ? '' : 's'} left`
                  : ''
              }${access.planName ? ` (${access.planName})` : ''}.`
            : 'No active library pass. Get a prepaid pass to unlock study docs and Q&A.'}
        </p>
        <div className="mt-6 space-y-2">
          {access.hasAccess ? (
            <>
              <Link href="/dashboard/library">
                <Button fullWidth>View library</Button>
              </Link>
              {showExtend && (
                <Link href="/pricing">
                  <Button variant="outline" fullWidth>
                    Extend pass
                  </Button>
                </Link>
              )}
            </>
          ) : (
            <Link href="/pricing">
              <Button fullWidth>Get a pass</Button>
            </Link>
          )}
        </div>
      </Card>
    </div>
  );
}
