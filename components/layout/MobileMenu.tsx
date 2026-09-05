'use client';

import Link from 'next/link';
import { ShoppingCart, X } from 'lucide-react';
import { useCart } from '@/components/cart/CartProvider';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: Array<{ path: string; label: string }>;
  isActive: (path: string) => boolean;
  onHelpClick: () => void;
  isAdmin?: boolean;
  onLogout?: () => void;
}

export default function MobileMenu({
  isOpen,
  onClose,
  navLinks,
  isActive,
  onHelpClick,
  isAdmin = false,
  onLogout,
}: MobileMenuProps) {
  const { count, hydrated } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-navy-800/50 backdrop-blur-sm" onClick={onClose} />

      <div className="absolute right-0 top-0 h-full w-80 overflow-y-auto bg-white shadow-2xl">
        <div className="p-6">
          <div className="mb-6 flex justify-end">
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-navy-400 transition-colors hover:bg-soft hover:text-primary-600"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="mb-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={onClose}
                className={`block rounded-lg px-4 py-3 font-display text-base font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-navy-700 hover:bg-soft hover:text-primary-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/cart"
              onClick={onClose}
              className="flex items-center gap-2 rounded-lg px-4 py-3 font-display text-base font-medium text-navy-700 transition-colors hover:bg-soft hover:text-primary-600"
            >
              <ShoppingCart className="h-5 w-5" />
              Cart{hydrated && count > 0 ? ` (${count})` : ''}
            </Link>
          </nav>

          <div className="my-6 border-t border-border" />

          {isAdmin ? (
            <div className="space-y-3">
              <Link
                href="/admin/dashboard"
                onClick={onClose}
                className="flex items-center justify-center rounded-full border border-border px-4 py-3 font-display text-base font-semibold text-navy-700 transition-colors hover:bg-soft"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onLogout?.();
                }}
                className="flex w-full items-center justify-center rounded-full bg-navy-800 px-4 py-3 font-display text-base font-semibold text-white transition-colors hover:bg-navy-700"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/admin/login"
              onClick={onClose}
              className="flex items-center justify-center rounded-full px-4 py-3 font-display text-base font-semibold text-primary-600 transition-colors hover:bg-primary-50"
            >
              Log In
            </Link>
          )}

          <div className="mt-6">
            <button
              type="button"
              onClick={() => {
                onHelpClick();
                onClose();
              }}
              className="block w-full rounded-full bg-primary-600 px-6 py-3 text-center font-display text-sm font-semibold text-white shadow-md transition-colors hover:bg-primary-700"
            >
              Get Exam Help
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
