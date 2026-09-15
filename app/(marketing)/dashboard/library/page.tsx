import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { auth } from '@/lib/auth';
import { getLibraryAccess } from '@/lib/subscriptions/access';
import { subscriptionService } from '@/lib/services/subscriptionService';
import LibraryBrowser from '@/components/dashboard/LibraryBrowser';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Library',
  description: 'Browse and download NursePath study documents and Q&A.',
};

export default async function LibraryPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const access = userId
    ? await getLibraryAccess(userId)
    : { hasAccess: false, endsAt: null, planName: null, planCode: null };

  const summary = userId ? await subscriptionService.getAccessSummary(userId) : null;

  if (access.hasAccess) {
    return <LibraryBrowser />;
  }

  return (
    <div className="space-y-6">
      <Card className="py-12 text-center sm:py-16">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-navy-50">
          <BookOpen className="h-8 w-8 text-navy-500" />
        </div>
        <h2 className="mb-2 font-display text-2xl font-bold text-navy-800">
          No active library pass
        </h2>
        <p className="mx-auto mb-6 max-w-md text-navy-400">
          {summary?.recent?.[0]
            ? `Your last pass was ${summary.recent[0].plan.name}. Renew or get a new prepaid pass to unlock study documents and Q&A again.`
            : 'Choose a 1-day, 1-week, or 1-month prepaid pass to unlock study documents and Q&A. View online unlimited; download up to 3 unique files per pass.'}
        </p>
        <Link href="/pricing">
          <Button>Renew / Get a pass</Button>
        </Link>
      </Card>

      {summary && summary.recent.length > 0 && (
        <Card>
          <h3 className="mb-4 font-display text-lg font-bold text-navy-800">Recent passes</h3>
          <ul className="divide-y divide-border">
            {summary.recent.map((s) => (
              <li
                key={s.id}
                className="flex flex-col gap-1 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-navy-800">{s.plan.name}</p>
                  <p className="text-navy-400">
                    {s.status}
                    {s.endsAt
                      ? ` · until ${new Date(s.endsAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}`
                      : ''}
                  </p>
                </div>
                <p className="text-navy-400">${Number(s.amountUsd).toFixed(2)}</p>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
