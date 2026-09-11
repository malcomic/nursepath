'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ShieldCheck, ArrowRight } from 'lucide-react';
import { adminJson } from '@/lib/admin/api-client';
import Logo from '@/components/layout/Logo';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      await adminJson('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      router.push('/admin/dashboard');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-soft flex flex-col md:flex-row">
      <div className="hidden md:flex flex-1 bg-navy-800 relative p-12 flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-0 right-0 w-[480px] h-[480px] bg-primary-600 rounded-full blur-[110px] -mr-40 -mt-40" />
          <div className="absolute bottom-0 left-0 w-[420px] h-[420px] bg-accent-500 rounded-full blur-[110px] -ml-40 -mb-40 opacity-40" />
        </div>

        <div className="relative z-10">
          <div className="mb-12">
            <Logo href="/" size={72} />
          </div>
          <h2 className="font-display text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6">
            Manage nursing
            <br />
            study resources
            <br />
            <span className="text-primary-300">from one place.</span>
          </h2>
          <p className="text-navy-200 max-w-md text-base leading-relaxed">
            Guides, orders, reviews, and settings — styled for NursePath, built for daily ops.
          </p>
        </div>

        <div className="relative z-10">
          <p className="text-sm text-navy-300 font-medium">
            Tip: use strong credentials and sign out on shared devices.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-soft md:bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="md:hidden mb-2">
            <Logo href="/" size={56} />
          </div>
          <div className="text-center md:text-left">
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-navy-800 mb-3">
              Admin Access
            </h1>
            <p className="text-navy-400 font-medium">
              Enter your credentials to manage guides and content.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-navy-700 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-300 group-focus-within:text-primary-600 transition" />
                <input
                  type="email"
                  required
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full bg-soft border border-border px-12 py-4 rounded-2xl font-medium text-navy-800 focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-600 transition disabled:opacity-50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-navy-700 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-300 group-focus-within:text-primary-600 transition" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full bg-soft border border-border px-12 py-4 rounded-2xl font-medium text-navy-800 focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-600 transition disabled:opacity-50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent-500 text-white py-4 rounded-full font-display font-bold text-lg hover:bg-accent-600 transition shadow-md hover:shadow-lg flex items-center justify-center gap-3 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing In...' : 'Access Dashboard'}
              {!loading && (
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
              )}
            </button>
          </form>

          <div className="flex items-center justify-center gap-2 text-[10px] text-navy-300 font-bold uppercase tracking-widest pt-4">
            <ShieldCheck className="w-3 h-3 text-primary-600" />
            Secure admin session
          </div>
        </div>
      </div>
    </div>
  );
}
