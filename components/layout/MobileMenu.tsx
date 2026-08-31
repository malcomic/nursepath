'use client';

import Link from 'next/link';
import { X } from 'lucide-react';

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
  if (!isOpen) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-end mb-6">
            <button
              onClick={onClose}
              className="p-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="space-y-2 mb-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={onClose}
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="border-t border-gray-200 my-6" />

          {isAdmin ? (
            <div className="space-y-3">
              <Link
                href="/admin/dashboard"
                onClick={onClose}
                className="flex items-center justify-center px-4 py-3 rounded-lg text-base font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onLogout?.();
                }}
                className="flex w-full items-center justify-center px-4 py-3 rounded-lg text-base font-semibold text-white bg-slate-900 hover:bg-black transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/admin/login"
              onClick={onClose}
              className="flex items-center justify-center px-4 py-3 rounded-lg text-base font-semibold text-white bg-slate-900 hover:bg-black transition-colors"
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
              className="block w-full bg-blue-600 text-white px-6 py-3 rounded-full font-extrabold text-xs tracking-wide uppercase text-center hover:bg-blue-700 transition-colors shadow-md"
            >
              Get Exam Help
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
