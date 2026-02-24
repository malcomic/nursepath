// import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, LayoutDashboard, LogOut, ShieldCheck } from 'lucide-react';
import { api } from '../api';

export default function Navigation() {
  const isAdmin = !!api.getAuthToken();

  const handleLogout = () => {
    api.setAuthToken(null);
    window.location.href = '/';
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <BookOpen className="text-white w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-slate-900 tracking-tight">ScholarWriters</span>
          </Link>

          {/* Nav */}
          <nav className="flex items-center gap-2">
            <Link
              to="/catalog"
              className="text-sm font-medium text-slate-600 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors duration-150"
            >
              Catalog
            </Link>

            {isAdmin ? (
              <>
                <Link
                  to="/admin/dashboard"
                  className="text-sm font-medium text-slate-600 hover:text-blue-600 flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors duration-150"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-red-500 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors duration-150"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/admin/login"
                className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-blue-600 border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors duration-150"
              >
                <ShieldCheck className="w-4 h-4" />
                Admin
              </Link>
            )}
          </nav>

        </div>
      </div>
    </header>
  );
}