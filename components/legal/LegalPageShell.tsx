import Link from 'next/link';
import type { ReactNode } from 'react';

const LEGAL_LINKS = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
  { href: '/refund', label: 'Refund Policy' },
  { href: '/help', label: 'Help Center' },
  { href: '/contact', label: 'Contact' },
] as const;

interface LegalPageShellProps {
  title: string;
  children: ReactNode;
  lastUpdated?: string;
}

export default function LegalPageShell({
  title,
  children,
  lastUpdated = 'March 2026',
}: LegalPageShellProps) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-20">
      <h1 className="text-4xl font-black text-gray-900">{title}</h1>
      <p className="mt-2 text-sm text-gray-500">Last updated: {lastUpdated}</p>

      <div className="mt-8 space-y-6 text-gray-700 leading-relaxed">{children}</div>

      <nav
        className="mt-10 pt-8 border-t border-gray-200"
        aria-label="Legal and support links"
      >
        <p className="text-sm font-semibold text-gray-900 mb-3">Related pages</p>
        <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {LEGAL_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-primary-600 hover:text-primary-700">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-6">
          <Link href="/" className="text-primary-600 font-semibold hover:text-primary-700">
            Return to home
          </Link>
        </p>
      </nav>
    </main>
  );
}
