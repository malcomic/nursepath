'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  MessageCircle,
  Phone,
  MessageSquare,
  X,
  Menu,
} from 'lucide-react';
import MobileMenu from './MobileMenu';
import { adminFetch } from '@/lib/admin/api-client';

const PHONE_NUMBER = '+12135744133';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();

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
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="bg-blue-600 p-1.5 rounded-lg group-hover:bg-blue-700 transition-colors duration-200">
                <BookOpen className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">NursePath</span>
            </Link>

            <nav className="hidden lg:flex flex-1 justify-center items-center">
              <div className="flex items-center gap-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={`text-sm font-medium transition-colors duration-150 ${
                      isActive(link.path)
                        ? 'text-slate-900'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </nav>

            <div className="hidden lg:flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowHelpModal(true)}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors duration-150 shadow-md shadow-blue-100"
              >
                <MessageCircle className="w-4 h-4" />
                Get Exam Help
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-200 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                </span>
              </button>
              {isAdmin ? (
                <>
                  <Link
                    href="/admin/dashboard"
                    className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors duration-150"
                  >
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 transition-colors duration-150"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/admin/login"
                  className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 transition-colors duration-150"
                >
                  Log In
                </Link>
              )}
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors duration-150"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
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
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={() => setShowHelpModal(false)}
        >
          <div
            className="bg-white rounded-3xl p-8 max-w-sm w-full relative shadow-2xl animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowHelpModal(false)}
              className="absolute top-5 right-5 p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 transition-colors duration-150"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <MessageCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Need Exam Help?</h3>
              <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                Our nursing experts are standing by to help you ace your next assessment.
              </p>
            </div>

            <div className="space-y-3">
              <a
                href={`https://wa.me/${PHONE_NUMBER.replace('+', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between bg-green-500 text-white px-5 py-4 rounded-xl hover:bg-green-600 transition-colors duration-150 font-semibold text-sm shadow-lg shadow-green-100"
              >
                WhatsApp Us
                <Phone className="w-5 h-5" />
              </a>
              <a
                href={`sms:${PHONE_NUMBER}`}
                className="flex items-center justify-between bg-blue-600 text-white px-5 py-4 rounded-xl hover:bg-blue-700 transition-colors duration-150 font-semibold text-sm shadow-lg shadow-blue-100"
              >
                Text (SMS)
                <MessageSquare className="w-5 h-5" />
              </a>

              <button
                onClick={() => setShowHelpModal(false)}
                className="w-full pt-2 text-slate-400 text-sm font-medium hover:text-slate-700 transition-colors duration-150"
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
