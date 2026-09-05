'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageCircle, Phone, MessageSquare, X, Menu, ShoppingCart } from 'lucide-react';
import MobileMenu from './MobileMenu';
import Logo from './Logo';
import { adminFetch } from '@/lib/admin/api-client';
import { useCart } from '@/components/cart/CartProvider';

const PHONE_NUMBER = '+12135744133';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();
  const { count, hydrated } = useCart();

  useEffect(() => {
    let cancelled = false;
    adminFetch('/api/admin/me')
      .then((res) => {
        if (!cancelled) setIsAdmin(res.ok);
      })
      .catch(() => {
        if (!cancelled) setIsAdmin(false);
      });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  const handleLogout = async () => {
    await adminFetch('/api/admin/logout', { method: 'POST' });
    setIsAdmin(false);
    window.location.href = '/';
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/services', label: 'Study Guides' },
    { path: '/reviews', label: 'Student Reviews' },
    { path: '/contact', label: 'Contact' },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-[88px] items-center justify-between">
            <Logo />

            <nav className="hidden flex-1 items-center justify-center lg:flex">
              <div className="flex items-center gap-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={`font-display text-[15px] font-medium transition-colors duration-150 ${
                      isActive(link.path)
                        ? 'text-navy-800'
                        : 'text-navy-400 hover:text-navy-800'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </nav>

            <div className="hidden items-center gap-5 lg:flex">
              <Link
                href="/cart"
                className="relative rounded-lg p-2 text-navy-400 transition-colors hover:bg-primary-50 hover:text-primary-600"
                aria-label="Cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {hydrated && count > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-500 px-1 text-[11px] font-bold text-white">
                    {count}
                  </span>
                )}
              </Link>

              {isAdmin ? (
                <>
                  <Link
                    href="/admin/dashboard"
                    className="font-display text-[15px] font-semibold text-primary-600 hover:text-primary-700"
                  >
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="font-display text-[15px] font-semibold text-navy-400 hover:text-navy-800"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/admin/login"
                  className="font-display text-[15px] font-semibold text-primary-600 hover:text-primary-700"
                >
                  Log In
                </Link>
              )}

              <button
                type="button"
                onClick={() => setShowHelpModal(true)}
                className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-4 py-2 font-display text-sm font-semibold text-white transition-colors hover:bg-primary-700"
              >
                Get Exam Help
              </button>
            </div>

            <div className="flex items-center gap-2 lg:hidden">
              <Link
                href="/cart"
                className="relative rounded-lg p-2 text-navy-400"
                aria-label="Cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {hydrated && count > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-500 px-1 text-[11px] font-bold text-white">
                    {count}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="rounded-lg p-2 text-navy-400 transition-colors hover:bg-primary-50 hover:text-navy-800"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          navLinks={navLinks}
          isActive={isActive}
          onHelpClick={() => setShowHelpModal(true)}
          isAdmin={isAdmin}
          onLogout={handleLogout}
        />
      </header>

      {showHelpModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-800/50 p-4 backdrop-blur-sm"
          onClick={() => setShowHelpModal(false)}
        >
          <div
            className="relative w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowHelpModal(false)}
              className="absolute right-5 top-5 rounded-full p-1.5 text-navy-400 transition-colors hover:bg-soft hover:text-navy-800"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-8 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50">
                <MessageCircle className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="font-display text-2xl font-bold tracking-tight text-navy-800">
                Need Exam Help?
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-400">
                Our nursing experts are standing by to help you ace your next assessment.
              </p>
            </div>

            <div className="space-y-3">
              <a
                href={`https://wa.me/${PHONE_NUMBER.replace('+', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-xl bg-secondary-500 px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-secondary-100 transition-colors hover:bg-secondary-600"
              >
                WhatsApp Us
                <Phone className="h-5 w-5" />
              </a>
              <a
                href={`sms:${PHONE_NUMBER}`}
                className="flex items-center justify-between rounded-xl bg-primary-600 px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-primary-100 transition-colors hover:bg-primary-700"
              >
                Text (SMS)
                <MessageSquare className="h-5 w-5" />
              </a>

              <button
                onClick={() => setShowHelpModal(false)}
                className="w-full pt-2 text-sm font-medium text-navy-400 transition-colors hover:text-navy-800"
              >
                Not now, thanks
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
