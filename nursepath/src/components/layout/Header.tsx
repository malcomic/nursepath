import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, BookOpen, LayoutDashboard, LogOut } from 'lucide-react';
import { api } from '../../api';
import MobileMenu from './MobileMenu';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isAdmin = !!api.getAuthToken();

  const handleLogout = () => {
    api.setAuthToken(null);
    window.location.href = '/';
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/blog', label: 'Student Reviews' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-[#f4f4f5] border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-blue-600 p-1.5 rounded-md group-hover:bg-blue-700 transition-colors">
              <BookOpen className="text-white w-4 h-4" />
            </div>
            <span className="text-[30px] font-semibold text-slate-900 tracking-tight">NursePath</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-[13px] font-semibold transition-colors ${
                  isActive(link.path)
                    ? 'text-slate-900'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {isAdmin ? (
              <>
                <Link
                  to="/admin/dashboard"
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-primary-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="bg-blue-600 text-white px-5 py-2 rounded-full text-xs font-extrabold tracking-wide uppercase shadow-md hover:bg-blue-700 transition-colors"
                >
                  Get Exam Help
                </button>
                <Link
                  to="/admin/login"
                  className="bg-slate-900 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-black transition-colors"
                >
                  Log In
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
  );
}
