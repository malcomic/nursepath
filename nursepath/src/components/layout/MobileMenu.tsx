import { Link } from 'react-router-dom';
import { X, LayoutDashboard, LogOut } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: Array<{ path: string; label: string }>;
  isAdmin: boolean;
  onLogout: () => void;
  isActive: (path: string) => boolean;
}

export default function MobileMenu({
  isOpen,
  onClose,
  navLinks,
  isAdmin,
  onLogout,
  isActive,
}: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl overflow-y-auto">
        <div className="p-6">
          {/* Close Button */}
          <div className="flex justify-end mb-6">
            <button
              onClick={onClose}
              className="p-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2 mb-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
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

          {/* Divider */}
          <div className="border-t border-gray-200 my-6" />

          {/* Admin Section */}
          {isAdmin ? (
            <div className="space-y-2">
              <Link
                to="/admin/dashboard"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors"
              >
                <LayoutDashboard className="w-5 h-5" />
                Dashboard
              </Link>
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/admin/login"
              onClick={onClose}
              className="flex items-center justify-center px-4 py-3 rounded-lg text-base font-semibold text-white bg-slate-900 hover:bg-black transition-colors"
            >
              Log In
            </Link>
          )}

          {/* CTA Button */}
          <div className="mt-6">
            <button
              type="button"
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
