import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSite } from '../../context/SiteContext';
import { BrandLogo } from '../../components/common/BrandLogo';

export const AdminLoginPage: React.FC = () => {
  const { login, logout, isAuthenticated, admin } = useAuth();
  const { settings } = useSite();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);

    try {
      await login({ email: email.trim(), password, remember });
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutAndSwitch = async () => {
    await logout();
    setEmail('');
    setPassword('');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#050507] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background Architectural Accent */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/5 blur-[120px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-block transform hover:scale-105 transition-transform duration-300">
            <BrandLogo variant="full" size="lg" />
          </Link>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-blue-500/30" />
            <div className="flex items-center gap-1.5 text-[10px] tracking-[0.2em] text-blue-400 uppercase font-bold">
              <ShieldCheck className="w-3 h-3" />
              <span>Identity Verification</span>
            </div>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-blue-500/30" />
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-[#0D0E12]/80 backdrop-blur-xl border border-white/5 rounded-[32px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] space-y-8">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-white font-heading tracking-tight">
              Access Control
            </h2>
            <p className="text-xs text-neutral-500">
              Please authenticate to access the SH Web Studio administrative ecosystem.
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {isAuthenticated && admin ? (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-neutral-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Active Session Detected</span>
                </div>
                <p className="text-xs text-neutral-300">
                  You are currently logged in as <strong className="text-white font-mono">{admin.email}</strong> ({admin.name}).
                </p>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => navigate('/admin', { replace: true })}
                  className="w-full py-3.5 px-4 rounded-2xl text-xs font-bold uppercase tracking-widest text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-[0_10px_20px_rgba(37,99,235,0.2)]"
                >
                  Enter Admin Dashboard →
                </button>

                <button
                  type="button"
                  onClick={handleLogoutAndSwitch}
                  className="w-full py-3 px-4 rounded-2xl text-xs font-medium text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                >
                  Sign Out & Log In With Another Account
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-500 ml-1">
                  Identity (Email)
                </label>
                <div className="relative group">
                  <input
                    type="email"
                    required
                    autoFocus
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@shwebstudio.com"
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all placeholder:text-neutral-600"
                  />
                  <Mail className="w-4 h-4 text-neutral-600 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-500 ml-1">
                  Access Key (Password)
                </label>
                <div className="relative group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all placeholder:text-neutral-600"
                  />
                  <Lock className="w-4 h-4 text-neutral-600 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-2 text-neutral-600 hover:text-white absolute right-2 top-1/2 -translate-y-1/2 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Option */}
              <div className="flex items-center justify-between px-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-neutral-400 hover:text-neutral-300">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="rounded border-white/20 bg-white/5 text-blue-600 focus:ring-0 w-3.5 h-3.5"
                  />
                  <span>Keep me signed in on this device</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 flex items-center justify-center gap-2 py-4 px-4 rounded-2xl text-xs font-bold uppercase tracking-widest text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 transition-all shadow-[0_10px_20px_rgba(37,99,235,0.2)]"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <ShieldCheck className="w-4 h-4" />
                )}
                <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              </button>
            </form>
          )}

          <div className="pt-4 border-t border-[#1C1D24] text-center">
            <Link
              to="/"
              className="text-xs text-neutral-400 hover:text-neutral-200 transition-colors"
            >
              ← Back to SH Web Studio Public Site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
