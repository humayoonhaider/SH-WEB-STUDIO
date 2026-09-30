import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../../components/common/SEO';
import {
  DollarSign,
  Share2,
  Users,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Zap,
  TrendingUp,
  CreditCard,
  Building2,
  Lock,
} from 'lucide-react';
import { useUserAuth } from '../../context/UserAuthContext';

export const ReferralProgramPage: React.FC = () => {
  const { isAuthenticated } = useUserAuth();
  const [calcAmount, setCalcAmount] = useState<number>(1000);
  const commissionRate = 10;
  const calculatedCut = ((calcAmount * commissionRate) / 100).toFixed(0);

  const steps = [
    {
      step: '01',
      title: 'Create Your Account',
      description: 'Sign up in under 30 seconds to instantly receive your unique SH Web Studio referral code and custom tracking link.',
      icon: Users,
    },
    {
      step: '02',
      title: 'Share with Businesses',
      description: 'Send your link to founders, businesses, or colleagues looking for high-performance websites, custom web apps, or SaaS development.',
      icon: Share2,
    },
    {
      step: '03',
      title: 'Project Kickoff & Payment',
      description: 'Our engineering team consults, plans, and delivers the client project. When the client makes a qualifying payment, it is recorded in your dashboard.',
      icon: DollarSign,
    },
    {
      step: '04',
      title: 'Receive 10% Payout',
      description: 'Your 10% commission is verified and sent directly to your preferred payout method: Bank Transfer, Easypaisa, JazzCash, or PayPal.',
      icon: CheckCircle2,
    },
  ];

  const faqs = [
    {
      q: 'How much commission do I earn per referral?',
      a: 'You earn a flat 10% commission on the total qualifying payment made by the client you referred. For example, on a $1,500 web application project, your referral commission is $150.',
    },
    {
      q: 'When and how do I receive my commission payout?',
      a: 'Commissions are processed once the referred client’s payment clears. You can receive your payout via direct Bank Transfer (Pakistan & International), Easypaisa, JazzCash, or PayPal.',
    },
    {
      q: 'Can I track the status of my referrals in real-time?',
      a: 'Yes! Your personal Referral Dashboard shows every person who registered via your link, their project status, qualifying payment amounts, and verified commission balances.',
    },
    {
      q: 'Is there a limit on how many clients I can refer?',
      a: 'No limit! You can refer as many businesses as you want and continue earning 10% on every qualified client payment.',
    },
    {
      q: 'Can I refer my own company or myself?',
      a: 'Self-referrals are strictly disallowed to maintain integrity. Commissions are only granted for genuine third-party client referrals.',
    },
  ];

  return (
    <div className="pt-12 pb-20 overflow-hidden">
      <SEO 
        title="Refer & Earn 10% Commission"
        description="Join the SH Web Studio Referral Program. Refer businesses for custom web development and earn 10% of qualifying client payments."
      />

      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Official SH Web Studio Referral Program</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
          Refer Businesses. Earn{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-blue-500">
            10% Direct Commission
          </span>
          .
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          Invite founders, startups, and companies to build custom web applications, modern websites, and digital systems with SH Web Studio. Get paid 10% on every qualifying payment.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/30"
            >
              <span>Go to My Referral Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/30"
              >
                <span>Create Your Referral Account</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-medium text-neutral-300 hover:text-white bg-[#17181D] hover:bg-[#20222B] border border-[#262833] transition-all"
              >
                <span>Partner Sign In</span>
              </Link>
            </>
          )}
        </div>

        {/* Quick Highlights Badge Bar */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
          <div className="p-4 rounded-2xl bg-[#121318] border border-[#22242E] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-neutral-400">Commission Rate</div>
              <div className="text-base font-bold text-white">10% Flat Cut</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#121318] border border-[#22242E] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-neutral-400">Payout Channels</div>
              <div className="text-base font-bold text-white">Bank, JazzCash, EP</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#121318] border border-[#22242E] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-neutral-400">Attribution</div>
              <div className="text-base font-bold text-white">Real-Time Tracking</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#121318] border border-[#22242E] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-neutral-400">Security</div>
              <div className="text-base font-bold text-white">Guaranteed Payout</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Earnings Calculator */}
      <section className="mt-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-[#14161F] to-[#0E0F14] border border-[#262838] shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-mono uppercase tracking-widest text-blue-400 font-semibold">
              Earnings Calculator
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              Estimate Your Referral Reward
            </h2>
            <p className="text-sm text-neutral-400 mt-2">
              Move the slider to see how much you earn when your referred client starts their project.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="calcAmount" className="text-xs uppercase font-semibold text-neutral-400 tracking-wider">
                    Client Project Value (USD)
                  </label>
                  <span className="text-xl font-bold text-white font-mono">
                    ${calcAmount.toLocaleString()}
                  </span>
                </div>
                <input
                  id="calcAmount"
                  type="range"
                  min="300"
                  max="10000"
                  step="100"
                  value={calcAmount}
                  onChange={(e) => setCalcAmount(Number(e.target.value))}
                  className="w-full h-2 bg-[#222430] rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-[11px] text-neutral-400 mt-1 font-mono">
                  <span>$300 (Starter)</span>
                  <span>$5,000 (Full-Stack App)</span>
                  <span>$10,000 (Enterprise)</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0B0B0F] border border-[#1E202A] space-y-2 text-xs text-neutral-400">
                <div className="flex justify-between">
                  <span>Commission Rate:</span>
                  <span className="font-bold text-white">10% Flat</span>
                </div>
                <div className="flex justify-between">
                  <span>Payout Verification:</span>
                  <span className="text-emerald-400 font-medium">Cleared Client Funds</span>
                </div>
                <div className="flex justify-between">
                  <span>Supported Currency:</span>
                  <span className="font-mono text-neutral-300">USD / PKR Equivalent</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-blue-600/10 border border-blue-500/30 text-center flex flex-col items-center justify-center">
              <div className="text-xs uppercase font-semibold tracking-wider text-blue-300">
                Your Referral Commission
              </div>
              <div className="text-4xl sm:text-5xl font-extrabold text-white font-mono mt-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-white">
                ${calculatedCut}
              </div>
              <p className="text-xs text-blue-200/80 mt-2 max-w-xs">
                Direct payout credited to your account upon qualifying client payment.
              </p>
              <Link
                to="/register"
                className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-md shadow-blue-600/20"
              >
                <span>Get Your Referral Link</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Step Process Section */}
      <section className="mt-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-blue-400 font-semibold">
            Simple 4-Step Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
            How The Referral System Works
          </h2>
          <p className="text-neutral-400 mt-3 text-sm sm:text-base">
            Transparent, automated tracking from link click to payout deposit.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="p-6 rounded-2xl bg-[#121318] border border-[#20222B] hover:border-blue-500/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-extrabold font-mono text-neutral-400">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Transparency & Rules Section */}
      <section className="mt-28 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="p-8 sm:p-10 rounded-3xl bg-[#101117] border border-[#22242F]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Referral Program Terms & Guidelines</h3>
              <p className="text-xs text-neutral-400">Fair, honest, and reliable partnerships.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-neutral-300">
            <div className="p-4 rounded-xl bg-[#0B0B0F] border border-[#1A1B22] flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">Qualifying Payment Rule</strong>
                Commission is paid only on actual, verified payments made by the referred client for web development projects.
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0B0B0F] border border-[#1A1B22] flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">Permanent Attribution</strong>
                When a user registers with your referral link, their account is permanently attributed to your partner profile.
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0B0B0F] border border-[#1A1B22] flex items-start gap-3">
              <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">No Self-Referrals</strong>
                Creating multiple accounts to refer your own business is strictly prohibited and disqualified.
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0B0B0F] border border-[#1A1B22] flex items-start gap-3">
              <Building2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">Prompt Direct Payouts</strong>
                Funds are transferred promptly via Bank Transfer, Easypaisa, or JazzCash upon admin verification.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mt-28 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-blue-400 font-semibold">
            Got Questions?
          </span>
          <h2 className="text-3xl font-extrabold text-white mt-1">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#121318] border border-[#20222B] space-y-2 text-left"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="w-4 h-4 text-blue-400 shrink-0" />
                <h4 className="text-sm sm:text-base font-bold text-white">{faq.q}</h4>
              </div>
              <p className="text-xs sm:text-sm text-neutral-400 pl-7 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="mt-28 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-r from-blue-900/30 via-blue-600/20 to-indigo-900/30 border border-blue-500/30 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white max-w-2xl mx-auto">
            Ready To Start Earning 10% With SH Web Studio?
          </h2>
          <p className="text-neutral-300 text-sm sm:text-base max-w-xl mx-auto">
            Sign up now, grab your unique referral link, and start sharing with your network today.
          </p>
          <div className="pt-2">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-sm sm:text-base font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/30"
            >
              <span>Create Referral Account</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
