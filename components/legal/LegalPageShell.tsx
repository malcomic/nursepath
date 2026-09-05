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
      <h1 className="font-display text-4xl font-extrabold text-navy-800">{title}</h1>
      <p className="mt-2 text-sm text-navy-400">Last updated: {lastUpdated}</p>

      <div className="mt-8 space-y-6 leading-relaxed text-navy-400 [&_h2]:font-display [&_h2]:font-bold [&_h2]:text-navy-800">
        {children}
      </div>

      <nav className="mt-10 border-t border-border pt-8" aria-label="Legal and support links">
        <p className="mb-3 text-sm font-semibold text-navy-800">Related pages</p>
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
          <Link href="/" className="font-semibold text-primary-600 hover:text-primary-700">
            Return to home
          </Link>
        </p>
      </nav>
    </main>
  );
}
