import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, BookOpen, LayoutDashboard, LogOut, ShieldCheck } from 'lucide-react';
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
    { path: '/services', label: 'Services' },
    { path: '/pricing', label: 'Pricing' },
    { path: '/about', label: 'About' },
    { path: '/blog', label: 'Blog' },
    { path: '/contact', label: 'Contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-primary-600 p-2 rounded-lg group-hover:bg-primary-700 transition-colors">
              <BookOpen className="text-white w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-bold text-gray-900 tracking-tight">ScholarWriters</span>
              <p className="text-xs text-gray-500 -mt-1">Academic Excellence</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
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
              <Link
                to="/admin/login"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-primary-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
                Admin
              </Link>
            )}
            <Link
              to="/services"
              className="bg-primary-600 text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg"
            >
              Get Started
            </Link>
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
