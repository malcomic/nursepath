'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { LogOut, User } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

type LibraryStatus = {
  hasAccess: boolean;
  endsAt: string | null;
  planName: string | null;
} | null;

export default function AccountClient() {
  const { data: session, status } = useSession();
  const [library, setLibrary] = useState<LibraryStatus>(null);

  useEffect(() => {
    if (status !== 'authenticated') return;
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch('/api/dashboard/subscription');
        const json = await res.json();
        if (!res.ok || !json.success || cancelled) return;
        const access = json.data;
        setLibrary({
          hasAccess: Boolean(access?.hasAccess),
          endsAt: access?.endsAt ?? null,
          planName: access?.planName ?? null,
        });
      } catch {
        // ignore — account page still works without library status
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [status]);

  if (status === 'loading') {
    return (
      <div className="py-16 text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary-600" />
        <p className="text-navy-400">Loading account…</p>
      </div>
    );
  }

  const user = session?.user;

  const libraryLine = (() => {
    if (!library) return null;
    if (!library.hasAccess) {
      return (
        <>
          No active library pass.{' '}
          <Link href="/pricing" className="font-semibold text-primary-600 hover:underline">
            Get a pass
          </Link>
        </>
      );
    }
    const ends = library.endsAt
      ? new Date(library.endsAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : null;
    return (
      <>
        Library {library.planName ? `(${library.planName})` : 'pass'} active
        {ends ? ` until ${ends}` : ''}.{' '}
        <Link href="/pricing" className="font-semibold text-primary-600 hover:underline">
          Extend
        </Link>
      </>
    );
  })();

  return (
    <Card className="max-w-lg">
      <div className="flex items-start gap-4">
        {user?.image ? (
          <Image
            src={user.image}
            alt={user.name || 'Profile'}
            width={64}
            height={64}
            className="rounded-2xl object-cover"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100">
            <User className="h-8 w-8 text-primary-600" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-xl font-bold text-navy-800">
            {user?.name || 'Your account'}
          </h2>
          <p className="mt-1 truncate text-sm text-navy-400">{user?.email}</p>
        </div>
      </div>

      {libraryLine && (
        <p className="mt-6 text-sm text-navy-600">{libraryLine}</p>
      )}

      <p className="mt-4 text-sm text-navy-400">
        Purchased guides are linked to your account when you check out signed in, and also
        matched by email for guest purchases.
      </p>

      <div className="mt-8">
        <Button
          variant="outline"
          onClick={() => void signOut({ callbackUrl: '/' })}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </div>
    </Card>
  );
}
