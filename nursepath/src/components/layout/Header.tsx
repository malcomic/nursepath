import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BookOpen,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Phone,
  MessageSquare,
  X,
  Menu,
  ShieldCheck,
} from 'lucide-react';
import { api } from '../../api';
import MobileMenu from './MobileMenu';

const PHONE_NUMBER = '+12135744133';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const location = useLocation();
  const isAdmin = !!api.getAuthToken();

  const handleLogout = () => {
    api.setAuthToken(null);
    window.location.href = '/';
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/services', label: 'Study Guides' },
    { path: '/reviews', label: 'Student Reviews' },
    { path: '/contact', label: 'Contact' }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="bg-blue-600 p-1.5 rounded-lg group-hover:bg-blue-700 transition-colors duration-200">
                <BookOpen className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">
                NursePath
              </span>
            </Link>

            {/* Center Nav */}
            <nav className="hidden lg:flex flex-1 justify-center items-center">
              <div className="flex items-center gap-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
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

            {/* Right Side */}
            <div className="hidden lg:flex items-center gap-3">
              {isAdmin ? (
                <>
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors duration-150"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <Link
                    to="/admin"
                    className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors duration-150 border-l border-slate-200 pl-4"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Admin
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-red-500 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors duration-150"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
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
                  <Link
                    to="/admin/login"
                    className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 transition-colors duration-150"
                  >
                    Log In
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors duration-150"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          navLinks={navLinks}
          isAdmin={isAdmin}
          onLogout={handleLogout}
          isActive={isActive}
        />
      </header>

      {/* Help Modal */}
      {showHelpModal && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={() => setShowHelpModal(false)}
        >
          <div
            className="bg-white rounded-3xl p-8 max-w-sm w-full relative shadow-2xl"
            style={{ animation: 'modal-in 180ms cubic-bezier(0.34, 1.56, 0.64, 1) both' }}
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

      <style>{`
        @keyframes modal-in {
          from { opacity: 0; transform: scale(0.95) translateY(6px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </>
  );
}