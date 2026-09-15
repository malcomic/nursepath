import type { Metadata } from 'next';
import { Suspense } from 'react';
import LoginForm from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to your NursePath account to view purchases and library access.',
};

export default function LoginPage() {
  return (
    <main className="flex-grow bg-soft py-12">
      <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8">
        <Suspense
          fallback={
            <div className="rounded-2xl border border-border bg-white p-8 text-center text-navy-400">
              Loading…
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
