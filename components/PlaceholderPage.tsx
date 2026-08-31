import Link from 'next/link';

interface PlaceholderPageProps {
  title: string;
  description?: string;
}

export function PlaceholderPage({ title, description = 'Migration in progress.' }: PlaceholderPageProps) {
  return (
    <main className="mx-auto max-w-7xl px-4 py-20">
      <h1 className="text-4xl font-black text-gray-900">{title}</h1>
      <p className="mt-4 text-gray-600">{description}</p>
    </main>
  );
}

interface LegalStubProps {
  title: string;
}

export function LegalStub({ title }: LegalStubProps) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-20">
      <h1 className="text-4xl font-black text-gray-900">{title}</h1>
      <p className="mt-6 text-gray-600 leading-relaxed">
        Content coming soon. This page will be updated with our official policy information.
      </p>
      <p className="mt-4">
        <Link href="/" className="text-primary-600 font-semibold hover:text-primary-700">
          Return to home
        </Link>
      </p>
    </main>
  );
}
