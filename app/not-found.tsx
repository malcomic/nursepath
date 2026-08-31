import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <h1 className="text-6xl font-black text-primary-600">404</h1>
      <h2 className="mt-4 text-2xl font-bold text-gray-900">Page not found</h2>
      <p className="mt-2 max-w-md text-gray-600">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white hover:bg-primary-700"
      >
        Back to home
      </Link>
    </main>
  );
}
