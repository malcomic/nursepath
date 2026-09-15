'use client';

import { type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  Library,
  Tags,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  CreditCard,
  CalendarClock,
} from 'lucide-react';
import { ToastProvider } from '@/components/admin/ToastProvider';
import { adminFetch } from '@/lib/admin/api-client';
import Logo from '@/components/layout/Logo';

const PAGE_TITLES: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin/guides': 'Study Guides',
  '/admin/library': 'Library',
  '/admin/plans': 'Plans',
  '/admin/subscriptions': 'Subscriptions',
  '/admin/categories': 'Categories',
  '/admin/orders': 'Orders',
  '/admin/reviews': 'Review Moderation',
  '/admin/settings': 'Settings',
};

interface AdminShellProps {
  children: ReactNode;
}

export default function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const title = PAGE_TITLES[pathname] || 'Admin';

  const handleLogout = async () => {
    await adminFetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/guides', label: 'Guides', icon: BookOpen },
    { href: '/admin/library', label: 'Library', icon: Library },
    { href: '/admin/plans', label: 'Plans', icon: CreditCard },
    { href: '/admin/subscriptions', label: 'Subscriptions', icon: CalendarClock },
    { href: '/admin/categories', label: 'Categories', icon: Tags },
    { href: '/admin/orders', label: 'Orders', icon: FileText },
    { href: '/admin/reviews', label: 'Reviews', icon: MessageSquare },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <ToastProvider>
      <div className="min-h-screen bg-soft flex">
        <aside className="hidden md:flex w-64 flex-col border-r border-border bg-white">
          <div className="h-16 flex items-center gap-2.5 px-5 border-b border-border">
            <Logo href="/admin/dashboard" mark size={40} />
            <div className="flex flex-col min-w-0">
              <span className="font-display text-sm font-bold text-navy-800 tracking-tight truncate">
                NursePath
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-widest text-primary-600">
                Admin
              </span>
            </div>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-navy-400 hover:bg-primary-50/60 hover:text-navy-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-3 border-t border-border">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-navy-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 border-b border-border bg-white flex items-center justify-between px-4 md:px-8">
            <div>
              <h1 className="font-display text-lg md:text-xl font-bold text-navy-800">{title}</h1>
              <p className="text-xs md:text-sm text-navy-400">
                Secure admin tools for NursePath.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-xs font-semibold text-navy-700">Admin</span>
                <span className="text-[11px] text-navy-300">Signed in</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center text-xs font-bold font-display">
                A
              </div>
            </div>
          </header>

          {/* Mobile nav */}
          <nav className="md:hidden flex gap-1 overflow-x-auto border-b border-border bg-white px-3 py-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-primary-600 text-white'
                      : 'bg-soft text-navy-400 hover:text-navy-800'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <main className="flex-1 px-4 md:px-8 py-6 md:py-10">
            <div className="max-w-6xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
