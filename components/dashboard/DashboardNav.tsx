'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, FileText, LayoutDashboard, User } from 'lucide-react';

const tabs = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/guides', label: 'My Guides', icon: FileText },
  { href: '/dashboard/library', label: 'Library', icon: BookOpen },
  { href: '/dashboard/account', label: 'Account', icon: User },
];

export default function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav
      className="flex gap-1 overflow-x-auto rounded-2xl border border-border bg-white p-1.5"
      aria-label="Dashboard"
    >
      {tabs.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 font-display text-sm font-semibold transition-colors ${
              active
                ? 'bg-primary-50 text-primary-700'
                : 'text-navy-400 hover:bg-soft hover:text-navy-800'
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
