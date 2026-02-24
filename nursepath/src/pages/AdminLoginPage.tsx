import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { Mail, Lock, ShieldCheck, ArrowRight, BookOpen, Star } from 'lucide-react';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // ── Login logic untouched ──────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      const res = await api.post('/admin/login', { email, password });

      if (res.success && res.data?.token) {
        api.setAuthToken(res.data.token);
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };
  // ──────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">

      {/* ── Visual / Branding Side ── */}
      <div className="hidden md:flex flex-1 bg-slate-900 relative p-12 flex-col justify-between overflow-hidden">
        {/* Background blobs */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600 rounded-full blur-[100px] -mr-64 -mt-64" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-500 rounded-full blur-[100px] -ml-64 -mb-64" />
        </div>

        {/* Logo + Headline */}
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

        {/* Trust badge + Testimonial */}
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

          <div className="bg-white/5 backdrop-blur-md p-6 rounded-[2rem] border border-white/10">
            <p className="text-slate-300 italic text-sm mb-4">
              "The pharmacology guide saved me! I went from a C to an A in one semester. Best investment of my nursing school career."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full" />
              <div>
                <p className="text-xs font-bold text-white uppercase">Sarah Jenkins</p>
                <p className="text-[10px] text-slate-500 font-bold">RN-BSN CANDIDATE</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Form Side ── */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50 md:bg-white">
        <div className="w-full max-w-md space-y-10">

          {/* Heading */}
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-black text-slate-900 mb-3">Admin Access</h1>
            <p className="text-slate-500 font-medium">
              Enter your admin credentials to manage guides and content.
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl text-sm font-medium">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Email */}
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

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-bold text-slate-700">Password</label>
                <p className="text-xs text-slate-400 font-medium">
                  Contact your administrator if you forgot your password.
                </p>
              </div>
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

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-700 transition shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Signing In...
                </>
              ) : (
                <>
                  Access Admin Dashboard
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                </>
              )}
            </button>
          </form>

          {/* Security badge */}
          <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest pt-8">
            <ShieldCheck className="w-3 h-3 text-green-500" />
            SSL Encrypted &amp; 100% Secure
          </div>

        </div>
      </div>
    </div>
  );
}