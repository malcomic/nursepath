import type { Metadata } from 'next';
import { Suspense } from 'react';
import RegisterForm from '@/components/auth/RegisterForm';

export const metadata: Metadata = {
  title: 'Create account',
  description: 'Create a NursePath account to manage purchases and library access.',
};

export default function RegisterPage() {
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
          <RegisterForm />
        </Suspense>
      </div>
    </main>
  );
}
