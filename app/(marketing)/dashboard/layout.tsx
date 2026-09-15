import Link from 'next/link';
import { auth } from '@/lib/auth';
import DashboardNav from '@/components/dashboard/DashboardNav';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const name = session?.user?.name?.split(' ')[0] || 'there';

  return (
    <main className="flex-grow bg-soft py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-medium text-primary-600">Dashboard</p>
          <h1 className="mt-1 font-display text-3xl font-extrabold text-navy-800 sm:text-4xl">
            Hello, {name}
          </h1>
          <p className="mt-2 text-navy-400">
            Manage your purchases and account.{' '}
            <Link href="/services" className="font-medium text-primary-600 hover:text-primary-700">
              Browse guides
            </Link>
          </p>
        </div>

        <DashboardNav />

        <div className="mt-8">{children}</div>
      </div>
    </main>
  );
}
