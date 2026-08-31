'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ShieldCheck, ArrowRight, BookOpen, Star } from 'lucide-react';
import { adminJson } from '@/lib/admin/api-client';

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
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      <div className="hidden md:flex flex-1 bg-slate-900 relative p-12 flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600 rounded-full blur-[100px] -mr-64 -mt-64" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-500 rounded-full blur-[100px] -ml-64 -mb-64" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="bg-blue-600 p-2 rounded-xl">
              <BookOpen className="text-white w-8 h-8" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">NursePath</span>
          </div>
          <h2 className="text-5xl font-black text-white leading-tight mb-8">
            Manage The Best <br />
            Nursing Resources <br />
            <span className="text-blue-400">From One Place.</span>
          </h2>
        </div>

        <div className="relative z-10 space-y-8">
          <div className="flex items-start gap-4">
            <div className="bg-white/10 p-2 rounded-lg mt-1">
              <Star className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-white font-bold">Trusted by 10,000+ Students</p>
              <p className="text-slate-400 text-sm">Join the community of successful future nurses.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50 md:bg-white">
        <div className="w-full max-w-md space-y-10">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-black text-slate-900 mb-3">Admin Access</h1>
            <p className="text-slate-500 font-medium">
              Enter your admin credentials to manage guides and content.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition" />
                <input
                  type="email"
                  required
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full bg-slate-50 border border-slate-200 px-12 py-4 rounded-2xl font-medium text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition disabled:opacity-50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full bg-slate-50 border border-slate-200 px-12 py-4 rounded-2xl font-medium text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition disabled:opacity-50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-700 transition shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing In...' : 'Access Admin Dashboard'}
              {!loading && (
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
              )}
            </button>
          </form>

          <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest pt-8">
            <ShieldCheck className="w-3 h-3 text-green-500" />
            SSL Encrypted &amp; 100% Secure
          </div>
        </div>
      </div>
    </div>
  );
}
