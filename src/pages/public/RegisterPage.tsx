import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { SEO } from '../../components/common/SEO';
import {
  User,
  Mail,
  Lock,
  Phone,
  Building,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Gift,
} from 'lucide-react';
import { useUserAuth } from '../../context/UserAuthContext';
import { api } from '../../services/api';
import { Spinner } from '../../components/common/Loader';

const REF_STORAGE_KEY = 'sh_referral_attribution_code';

export const RegisterPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { register, isAuthenticated } = useUserAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Referral Attribution State
  const [referrerInfo, setReferrerInfo] = useState<{
    valid: boolean;
    referrerName?: string;
    code?: string;
  } | null>(null);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Capture referral code from URL or persistent storage
  useEffect(() => {
    const urlRef = searchParams.get('ref') || searchParams.get('referral');
    const storedRef = sessionStorage.getItem(REF_STORAGE_KEY) || localStorage.getItem(REF_STORAGE_KEY);
    const codeToUse = (urlRef || storedRef || '').trim().toUpperCase();

    if (codeToUse) {
      setFormData((prev) => ({ ...prev, referralCode: codeToUse }));
      sessionStorage.setItem(REF_STORAGE_KEY, codeToUse);
      localStorage.setItem(REF_STORAGE_KEY, codeToUse);

      // Validate against server
      api.referrals
        .validate(codeToUse)
        .then((res) => {
          if (res.success && res.data) {
            setReferrerInfo({
              valid: true,
              referrerName: res.data.referrerName,
              code: res.data.code,
            });
          }
        })
        .catch(() => {
          setReferrerInfo({ valid: false });
        });
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please check and try again.');
      return;
    }

    setLoading(true);
    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone.trim(),
        company: formData.company.trim(),
        referralCode: formData.referralCode.trim() || undefined,
      });

      // Clear attribution storage once registered
      sessionStorage.removeItem(REF_STORAGE_KEY);
      localStorage.removeItem(REF_STORAGE_KEY);

      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-12 pb-20 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <SEO 
        title="Create Your Account"
        description="Register an account with SH Web Studio to access your client projects and earn 10% on client referrals."
      />

      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-block mb-4">
            <span className="text-xl font-extrabold tracking-tight text-white font-mono">
              SH <span className="text-blue-500">WEB STUDIO</span>
            </span>
          </Link>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Create Your Account
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-neutral-400">
            Join SH Web Studio to manage client inquiries and earn 10% referral commissions.
          </p>
        </div>

        {/* Verified Referral Attribution Banner */}
        {referrerInfo?.valid && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900/30 via-indigo-900/20 to-blue-900/30 border border-blue-500/40 flex items-center gap-3 animate-in fade-in">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <Gift className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <span className="text-neutral-300">Invited by Partner: </span>
              <strong className="text-white font-semibold">{referrerInfo.referrerName}</strong>
              <div className="text-[10px] text-blue-400 font-mono">
                Code: {referrerInfo.code} (10% Referral Attribution Active)
              </div>
            </div>
          </div>
        )}

        {/* Registration Form Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#121318] border border-[#22242E] shadow-2xl">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5 uppercase tracking-wider">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Muhammad Humayoon"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0B0B0F] border border-[#262833] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-sm text-white placeholder-neutral-400 outline-none transition-all"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5 uppercase tracking-wider">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@company.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0B0B0F] border border-[#262833] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-sm text-white placeholder-neutral-400 outline-none transition-all"
                />
              </div>
            </div>

            {/* Phone & Company */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5 uppercase tracking-wider">
                  Phone / WhatsApp
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+92 300 0000000"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#0B0B0F] border border-[#262833] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-sm text-white placeholder-neutral-400 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5 uppercase tracking-wider">
                  Company / Agency
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <Building className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Optional"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#0B0B0F] border border-[#262833] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-sm text-white placeholder-neutral-400 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5 uppercase tracking-wider">
                Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  className="w-full pl-10 pr-10 py-2.5 bg-[#0B0B0F] border border-[#262833] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-sm text-white placeholder-neutral-400 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5 uppercase tracking-wider">
                Confirm Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat your password"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0B0B0F] border border-[#262833] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-sm text-white placeholder-neutral-400 outline-none transition-all"
                />
              </div>
            </div>

            {/* Referral Code (Optional / Readonly if prefilled) */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5 uppercase tracking-wider">
                Referral Code (Optional)
              </label>
              <input
                type="text"
                name="referralCode"
                value={formData.referralCode}
                onChange={handleChange}
                placeholder="e.g. SH-HUMAYOON8K2"
                className="w-full px-4 py-2 bg-[#0B0B0F] border border-[#262833] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-xs font-mono uppercase text-blue-300 placeholder-neutral-400 outline-none transition-all"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-600/20 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Spinner size="sm" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account & Get Referral Link</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer Note */}
          <div className="mt-6 pt-6 border-t border-[#1C1D24] text-center text-xs text-neutral-400">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold underline">
              Sign In here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
