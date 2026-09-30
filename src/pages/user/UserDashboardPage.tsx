import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Users,
  DollarSign,
  Share2,
  Copy,
  Check,
  CreditCard,
  Building,
  User,
  LogOut,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Edit3,
  Save,
  ShieldCheck,
  RefreshCw,
  Wallet,
  ArrowDownCircle,
  X,
  Receipt,
  Download,
} from 'lucide-react';
import { useUserAuth } from '../../context/UserAuthContext';
import { api } from '../../services/api';
import { UserReferralItem, UserReferralStats, UserPaymentDetails } from '../../types';
import { Spinner } from '../../components/common/Loader';

export const UserDashboardPage: React.FC = () => {
  const { user, logout, updateUser } = useUserAuth();

  const [stats, setStats] = useState<UserReferralStats & { availableBalance?: number }>({
    totalReferrals: 0,
    registeredReferrals: 0,
    qualifiedReferrals: 0,
    convertedClients: 0,
    totalQualifyingPayments: 0,
    totalEarnedCommission: 0,
    pendingCommission: 0,
    approvedCommission: 0,
    paidCommission: 0,
    availableBalance: 0,
    currency: 'USD',
  });

  const [referrals, setReferrals] = useState<UserReferralItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  // Self-Withdrawal Modal State
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState<'JazzCash' | 'Easypaisa' | 'Bank Transfer' | 'SadaPay' | 'PayPal' | 'Crypto'>('JazzCash');
  const [withdrawAccount, setWithdrawAccount] = useState('');
  const [withdrawAccountTitle, setWithdrawAccountTitle] = useState('');
  const [withdrawBankName, setWithdrawBankName] = useState('');
  const [withdrawNotes, setWithdrawNotes] = useState('');
  const [submittingWithdraw, setSubmittingWithdraw] = useState(false);
  const [withdrawSuccessReceipt, setWithdrawSuccessReceipt] = useState<{
    transactionId: string;
    amount: number;
    payoutMethod: string;
    payoutDetails: string;
    status: string;
    processedAt: string;
  } | null>(null);

  // Payout Details Form State
  const [paymentForm, setPaymentForm] = useState<UserPaymentDetails>({
    method: 'JazzCash',
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    routingOrSwift: '',
    notes: '',
  });
  const [editingPayment, setEditingPayment] = useState(false);
  const [savingPayment, setSavingPayment] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Profile Edit State
  const [profileForm, setProfileForm] = useState({
    name: '',
    phone: '',
    company: '',
  });
  const [editingProfile, setEditingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, referralsRes] = await Promise.all([
        api.referrals.getMyStats(),
        api.referrals.getMyReferrals(),
      ]);

      if (statsRes.success && statsRes.data) {
        setStats(statsRes.data);
      }
      if (referralsRes.success && referralsRes.data) {
        setReferrals(referralsRes.data);
      }
    } catch (err) {
      console.error('Failed to load user dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (user) {
      setPaymentForm({
        method: user.paymentDetails?.method || 'JazzCash',
        accountHolderName: user.paymentDetails?.accountHolderName || user.name || '',
        bankName: user.paymentDetails?.bankName || '',
        accountNumber: user.paymentDetails?.accountNumber || '',
        routingOrSwift: user.paymentDetails?.routingOrSwift || '',
        notes: user.paymentDetails?.notes || '',
      });

      setProfileForm({
        name: user.name || '',
        phone: user.phone || '',
        company: user.company || '',
      });

      // Pre-fill withdrawal form if user has saved details
      setWithdrawAccount(user.paymentDetails?.accountNumber || '');
      setWithdrawAccountTitle(user.paymentDetails?.accountHolderName || user.name || '');
      setWithdrawBankName(user.paymentDetails?.bankName || '');
      if (user.paymentDetails?.method) {
        setWithdrawMethod(user.paymentDetails.method as any);
      }
    }
  }, [user]);

  const referralLink =
    user?.referralLink ||
    `https://shwebstudio.up.railway.app/register?ref=${user?.referralCode || ''}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SH Web Studio | High-Performance Digital Solutions',
          text: `Join SH Web Studio or build your next web application through my partner invitation:`,
          url: referralLink,
        });
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2500);
      } catch {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  const handleSavePaymentDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPayment(true);
    setPaymentMessage(null);

    try {
      const res = await api.userAuth.updatePaymentDetails(paymentForm);
      if (res.success && res.data) {
        if (user) {
          updateUser({ ...user, paymentDetails: res.data });
        }
        setPaymentMessage({ type: 'success', text: 'Payout details saved securely.' });
        setEditingPayment(false);
        setTimeout(() => setPaymentMessage(null), 4000);
      } else {
        setPaymentMessage({ type: 'error', text: res.message || 'Failed to save payout details.' });
      }
    } catch (err: any) {
      setPaymentMessage({ type: 'error', text: err.message || 'Error saving payout details.' });
    } finally {
      setSavingPayment(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMessage(null);

    try {
      const res = await api.userAuth.updateProfile(profileForm);
      if (res.success && res.data) {
        if (user) {
          updateUser({ ...user, ...res.data });
        }
        setProfileMessage({ type: 'success', text: 'Profile updated successfully.' });
        setEditingProfile(false);
        setTimeout(() => setProfileMessage(null), 4000);
      } else {
        setProfileMessage({ type: 'error', text: res.message || 'Failed to update profile.' });
      }
    } catch (err: any) {
      setProfileMessage({ type: 'error', text: err.message || 'Error updating profile.' });
    } finally {
      setSavingProfile(false);
    }
  };

  // Self-Withdrawal Handler
  const handleExecuteWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = Number(withdrawAmount);

    const available = Number(stats.availableBalance ?? (stats.approvedCommission + stats.pendingCommission));

    if (!amountNum || amountNum <= 0) {
      alert('Please enter a valid withdrawal amount.');
      return;
    }

    if (amountNum > available) {
      alert(`Withdrawal amount cannot exceed your available balance ($${available}).`);
      return;
    }

    if (!withdrawAccount.trim()) {
      alert('Please provide your account / phone / wallet number.');
      return;
    }

    setSubmittingWithdraw(true);
    try {
      const res = await api.referrals.requestWithdrawal({
        amount: amountNum,
        payoutMethod: withdrawMethod,
        accountNumber: withdrawAccount,
        accountHolderName: withdrawAccountTitle,
        bankName: withdrawBankName,
        notes: withdrawNotes,
      });

      if (res.success && res.data) {
        setWithdrawSuccessReceipt(res.data);
        setWithdrawModalOpen(false);
        setWithdrawAmount('');
        fetchDashboardData();
      } else {
        alert(res.message || 'Failed to process withdrawal.');
      }
    } catch (err: any) {
      alert(err.message || 'Error during withdrawal processing.');
    } finally {
      setSubmittingWithdraw(false);
    }
  };

  const currentAvailableBalance = Number(
    stats.availableBalance ?? (stats.approvedCommission + stats.pendingCommission)
  );

  return (
    <div className="pt-12 pb-20 min-h-screen bg-[#0B0B0F] px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <Helmet>
        <title>Referral Dashboard & Wallet | SH Web Studio</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Top Welcome Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#12141C] via-[#101218] to-[#141622] border border-[#222533] shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-extrabold text-xl font-mono shadow-lg shadow-blue-600/30 shrink-0">
            {(user?.name || 'U').charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-white">{user?.name}</h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Sparkles className="w-3 h-3" />
                <span>10% Partner Wallet</span>
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              {user?.email} {user?.company ? `• ${user?.company}` : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="p-2.5 rounded-xl bg-[#17181F] hover:bg-[#20222B] border border-[#262833] text-neutral-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={logout}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 hover:text-rose-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Digital Wallet & Self-Withdrawal Card (Hero Action) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-[#101917] to-blue-950/40 border border-emerald-500/30 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-semibold flex items-center gap-1.5">
              <Wallet className="w-4 h-4" />
              <span>Digital Commission Wallet</span>
            </span>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-5xl font-extrabold text-white font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
                ${currentAvailableBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-xs sm:text-sm text-neutral-400 font-mono">Available Balance</span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Aapka kamaya hua 10% commission yahan save rehta hai. Aap kisi bhi waqt direct apne **JazzCash, Easypaisa, ya Bank Account** mein khud withdraw kar sakte hain.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setWithdrawAmount(currentAvailableBalance > 0 ? String(currentAvailableBalance) : '');
                setWithdrawModalOpen(true);
              }}
              disabled={currentAvailableBalance <= 0}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-40 disabled:hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-600/30 cursor-pointer"
            >
              <ArrowDownCircle className="w-5 h-5" />
              <span>Withdraw Money (Raqam Nikalwayen)</span>
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-xs font-semibold text-neutral-300 bg-[#161922] hover:bg-[#1E2230] border border-[#2B3044] transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-blue-400" />
              <span>{copied ? 'Link Copied!' : 'Referral Link'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Referral Link Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-blue-900/30 border border-blue-500/30 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-[11px] font-mono uppercase tracking-widest text-blue-400 font-semibold flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5" />
              <span>Your Unique Referral Link</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Share With Businesses & Earn 10%
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              When anyone registers or orders a project via your link, you automatically receive 10% of their qualifying payment.
            </p>
          </div>

          <div className="space-y-3 w-full lg:max-w-md">
            <div className="flex items-center gap-2 p-2 bg-[#0B0B0F]/90 border border-[#2A2D3D] rounded-2xl">
              <input
                type="text"
                readOnly
                value={referralLink}
                className="bg-transparent border-none outline-none text-xs sm:text-sm font-mono text-blue-300 px-3 w-full select-all"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  copied
                    ? 'bg-emerald-500 text-white'
                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
              <span>
                Code:{' '}
                <strong className="font-mono text-white font-bold tracking-wider">
                  {user?.referralCode}
                </strong>
              </span>

              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-medium cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{shareSuccess ? 'Shared!' : 'Share via App'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics & Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-[#121318] border border-[#20222B]">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
            <span>Total Referrals</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white font-mono">
            {stats.totalReferrals}
          </div>
          <div className="text-[10px] text-neutral-400 mt-1">Invited accounts</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#121318] border border-[#20222B]">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
            <span>Converted Clients</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white font-mono">
            {stats.convertedClients}
          </div>
          <div className="text-[10px] text-emerald-400/80 mt-1">Paying clients</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#121318] border border-[#20222B]">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
            <span>Total Earned</span>
            <DollarSign className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white font-mono text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
            ${stats.totalEarnedCommission.toLocaleString()}
          </div>
          <div className="text-[10px] text-neutral-400 mt-1">All-time 10%</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#121318] border border-[#20222B]">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
            <span>Ready / Available</span>
            <Wallet className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-400 font-mono">
            ${currentAvailableBalance.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-400 mt-1">Ready to withdraw</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#121318] border border-[#20222B]">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
            <span>Approved</span>
            <ShieldCheck className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-blue-400 font-mono">
            ${stats.approvedCommission.toLocaleString()}
          </div>
          <div className="text-[10px] text-neutral-400 mt-1">Verified deals</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#121318] border border-[#20222B]">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
            <span>Withdrawn / Paid</span>
            <CreditCard className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-teal-400 font-mono">
            ${stats.paidCommission.toLocaleString()}
          </div>
          <div className="text-[10px] text-neutral-400 mt-1">Transferred funds</div>
        </div>
      </div>

      {/* Main 2-Column Split: Referral Activity vs Payout & Profile Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Referrals Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <span>Referral History & Commission Status</span>
            </h3>
            <span className="text-xs font-mono text-neutral-400">
              {referrals.length} {referrals.length === 1 ? 'Record' : 'Records'}
            </span>
          </div>

          <div className="rounded-3xl bg-[#121318] border border-[#20222B] overflow-hidden shadow-xl">
            {loading ? (
              <div className="p-12 text-center">
                <Spinner size="md" />
                <p className="text-xs text-neutral-400 mt-2">Loading referral records...</p>
              </div>
            ) : referrals.length === 0 ? (
              <div className="p-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">No Referrals Recorded Yet</h4>
                  <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
                    Share your unique referral link with your network to start tracking client conversions and 10% commission.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Your Referral Link</span>
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#20222B] bg-[#0E0F14] text-neutral-400 font-semibold uppercase tracking-wider text-[10px]">
                      <th className="py-3.5 px-4">Referred Partner</th>
                      <th className="py-3.5 px-4">Registration</th>
                      <th className="py-3.5 px-4">Client Status</th>
                      <th className="py-3.5 px-4">Qualifying Payment</th>
                      <th className="py-3.5 px-4">10% Commission</th>
                      <th className="py-3.5 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1A1B24]">
                    {referrals.map((item) => {
                      const isClient = [
                        'CLIENT',
                        'PAYMENT_PENDING',
                        'COMMISSION_PENDING',
                        'COMMISSION_APPROVED',
                        'COMMISSION_PAID',
                      ].includes(item.status);

                      return (
                        <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-white">{item.referredUserName}</div>
                            {item.referredUserCompany && (
                              <div className="text-[10px] text-neutral-400">
                                {item.referredUserCompany}
                              </div>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-neutral-400 font-mono text-[11px]">
                            {new Date(item.registeredAt).toLocaleDateString()}
                          </td>
                          <td className="py-3.5 px-4">
                            {isClient ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Paying Client</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-neutral-800 text-neutral-400">
                                <User className="w-3 h-3" />
                                <span>Registered Lead</span>
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 font-mono font-medium text-neutral-300">
                            {item.qualifyingPayment > 0 ? `$${item.qualifyingPayment.toLocaleString()}` : '—'}
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-white">
                            {item.commission > 0 ? (
                              <span className="text-emerald-400">${item.commission.toLocaleString()}</span>
                            ) : (
                              '—'
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            {item.commissions && item.commissions.length > 0 ? (
                              <div className="space-y-1">
                                {item.commissions.map((comm) => (
                                  <span
                                    key={comm.id}
                                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold border ${
                                      comm.status === 'paid'
                                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                        : comm.status === 'approved'
                                        ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                                        : comm.status === 'rejected'
                                        ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                                        : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                                    }`}
                                  >
                                    {comm.status === 'paid' ? 'PAID / WITHDRAWN' : comm.status.toUpperCase()}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-[11px] text-neutral-400 italic">
                                {isClient ? 'Processing Deal' : 'Pending Order'}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Payout Details & Settings */}
        <div className="space-y-6">
          {/* Payout Details Card */}
          <div className="p-6 rounded-3xl bg-[#121318] border border-[#20222B] shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <span>Saved Withdrawal Details</span>
              </h3>
              {!editingPayment && (
                <button
                  type="button"
                  onClick={() => setEditingPayment(true)}
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              )}
            </div>

            {paymentMessage && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  paymentMessage.type === 'success'
                    ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                }`}
              >
                {paymentMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{paymentMessage.text}</span>
              </div>
            )}

            {editingPayment ? (
              <form onSubmit={handleSavePaymentDetails} className="space-y-3">
                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1 font-medium">
                    Payment Method
                  </label>
                  <select
                    value={paymentForm.method}
                    onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-[#17181F] border border-[#2B2E3D] text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="JazzCash">JazzCash</option>
                    <option value="Easypaisa">Easypaisa</option>
                    <option value="Bank Transfer">Bank Transfer (All Pakistani & Global Banks)</option>
                    <option value="SadaPay">SadaPay / NayaPay</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Other">Crypto / USDT / Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1 font-medium">
                    Account Holder Name / Title
                  </label>
                  <input
                    type="text"
                    required
                    value={paymentForm.accountHolderName}
                    onChange={(e) => setPaymentForm({ ...paymentForm, accountHolderName: e.target.value })}
                    placeholder="e.g. Muhammad Ali"
                    className="w-full px-3 py-2 rounded-xl bg-[#17181F] border border-[#2B2E3D] text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1 font-medium">
                    Account / Mobile / Wallet Number
                  </label>
                  <input
                    type="text"
                    required
                    value={paymentForm.accountNumber}
                    onChange={(e) => setPaymentForm({ ...paymentForm, accountNumber: e.target.value })}
                    placeholder="03001234567 or IBAN"
                    className="w-full px-3 py-2 rounded-xl bg-[#17181F] border border-[#2B2E3D] text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1 font-medium">
                    Bank Name (if applicable)
                  </label>
                  <input
                    type="text"
                    value={paymentForm.bankName}
                    onChange={(e) => setPaymentForm({ ...paymentForm, bankName: e.target.value })}
                    placeholder="e.g. Meezan Bank, HBL, SadaPay"
                    className="w-full px-3 py-2 rounded-xl bg-[#17181F] border border-[#2B2E3D] text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={savingPayment}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors cursor-pointer"
                  >
                    {savingPayment ? <Spinner size="sm" /> : <Save className="w-3.5 h-3.5" />}
                    <span>Save Details</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingPayment(false)}
                    className="px-3 py-2 rounded-xl text-xs text-neutral-400 hover:text-white bg-white/5 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-2.5 text-xs text-neutral-300 bg-[#0E0F14] p-3.5 rounded-2xl border border-[#1E202B]">
                <div className="flex justify-between py-1 border-b border-[#1A1B24]">
                  <span className="text-neutral-400">Method:</span>
                  <span className="font-semibold text-white">{paymentForm.method || 'Not Configured'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1A1B24]">
                  <span className="text-neutral-400">Account Title:</span>
                  <span className="font-semibold text-white">{paymentForm.accountHolderName || '—'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1A1B24]">
                  <span className="text-neutral-400">Account / Phone:</span>
                  <span className="font-mono text-emerald-400">{paymentForm.accountNumber || '—'}</span>
                </div>
                {paymentForm.bankName && (
                  <div className="flex justify-between py-1">
                    <span className="text-neutral-400">Bank Name:</span>
                    <span className="text-white">{paymentForm.bankName}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Profile Settings Card */}
          <div className="p-6 rounded-3xl bg-[#121318] border border-[#20222B] shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <User className="w-4 h-4 text-blue-400" />
                <span>Account Profile</span>
              </h3>
              {!editingProfile && (
                <button
                  type="button"
                  onClick={() => setEditingProfile(true)}
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              )}
            </div>

            {profileMessage && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  profileMessage.type === 'success'
                    ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                }`}
              >
                {profileMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{profileMessage.text}</span>
              </div>
            )}

            {editingProfile ? (
              <form onSubmit={handleSaveProfile} className="space-y-3">
                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1 font-medium">Full Name</label>
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#17181F] border border-[#2B2E3D] text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1 font-medium">Phone Number</label>
                  <input
                    type="text"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    placeholder="+92 300 1234567"
                    className="w-full px-3 py-2 rounded-xl bg-[#17181F] border border-[#2B2E3D] text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1 font-medium">Company / Agency</label>
                  <input
                    type="text"
                    value={profileForm.company}
                    onChange={(e) => setProfileForm({ ...profileForm, company: e.target.value })}
                    placeholder="Optional"
                    className="w-full px-3 py-2 rounded-xl bg-[#17181F] border border-[#2B2E3D] text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors cursor-pointer"
                  >
                    {savingProfile ? <Spinner size="sm" /> : <Save className="w-3.5 h-3.5" />}
                    <span>Save Profile</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingProfile(false)}
                    className="px-3 py-2 rounded-xl text-xs text-neutral-400 hover:text-white bg-white/5 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-2.5 text-xs text-neutral-300 bg-[#0E0F14] p-3.5 rounded-2xl border border-[#1E202B]">
                <div className="flex justify-between py-1 border-b border-[#1A1B24]">
                  <span className="text-neutral-400">Name:</span>
                  <span className="font-semibold text-white">{user?.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1A1B24]">
                  <span className="text-neutral-400">Email:</span>
                  <span className="font-mono text-white">{user?.email}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1A1B24]">
                  <span className="text-neutral-400">Phone:</span>
                  <span className="text-white">{user?.phone || 'Not set'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-neutral-400">Company:</span>
                  <span className="text-white">{user?.company || 'Independent'}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Self-Withdrawal Modal */}
      {withdrawModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-[#12131C] border border-[#2B3045] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#202436] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <ArrowDownCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Direct Self-Withdrawal</h3>
                  <p className="text-xs text-neutral-400">Withdraw your earned 10% commission instantly</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setWithdrawModalOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExecuteWithdrawal} className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 flex items-center justify-between">
                <div>
                  <span className="text-xs text-emerald-300 font-medium">Available Wallet Balance:</span>
                  <div className="text-2xl font-bold font-mono text-emerald-400">
                    ${currentAvailableBalance.toFixed(2)}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setWithdrawAmount(String(currentAvailableBalance))}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-colors cursor-pointer"
                >
                  Withdraw All
                </button>
              </div>

              <div>
                <label className="block text-xs text-neutral-300 font-medium mb-1.5">
                  Amount to Withdraw (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 font-bold">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    max={currentAvailableBalance}
                    required
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Enter amount (e.g. 50)"
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-[#171924] border border-[#2B3045] text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-neutral-300 font-medium mb-1.5">
                  Withdrawal Method
                </label>
                <select
                  value={withdrawMethod}
                  onChange={(e) => setWithdrawMethod(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#171924] border border-[#2B3045] text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="JazzCash">JazzCash (Instant Mobile Payout)</option>
                  <option value="Easypaisa">Easypaisa (Instant Mobile Payout)</option>
                  <option value="SadaPay">SadaPay / NayaPay</option>
                  <option value="Bank Transfer">Bank Transfer (Direct Account)</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Crypto">Crypto (USDT / TRC20)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-neutral-300 font-medium mb-1.5">
                    Account / Mobile Number
                  </label>
                  <input
                    type="text"
                    required
                    value={withdrawAccount}
                    onChange={(e) => setWithdrawAccount(e.target.value)}
                    placeholder="03001234567 or IBAN"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171924] border border-[#2B3045] text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-neutral-300 font-medium mb-1.5">
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    required
                    value={withdrawAccountTitle}
                    onChange={(e) => setWithdrawAccountTitle(e.target.value)}
                    placeholder="Full Account Title"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171924] border border-[#2B3045] text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {withdrawMethod === 'Bank Transfer' && (
                <div>
                  <label className="block text-xs text-neutral-300 font-medium mb-1.5">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={withdrawBankName}
                    onChange={(e) => setWithdrawBankName(e.target.value)}
                    placeholder="Meezan Bank, HBL, Bank Alfalah, etc."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171924] border border-[#2B3045] text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs text-neutral-300 font-medium mb-1.5">
                  Optional Note
                </label>
                <input
                  type="text"
                  value={withdrawNotes}
                  onChange={(e) => setWithdrawNotes(e.target.value)}
                  placeholder="e.g. Urgently needed for personal wallet"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#171924] border border-[#2B3045] text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#202436]">
                <button
                  type="button"
                  onClick={() => setWithdrawModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white bg-white/5 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingWithdraw || currentAvailableBalance <= 0}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/30 cursor-pointer disabled:opacity-50"
                >
                  {submittingWithdraw ? <Spinner size="sm" /> : <ArrowDownCircle className="w-4 h-4" />}
                  <span>Confirm & Withdraw Now</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Withdrawal Success Receipt Modal */}
      {withdrawSuccessReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#121420] border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-white">Withdrawal Processed!</h3>
              <p className="text-xs text-emerald-300">Aapki raqam successfully process ho chuki hai.</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#0B0D16] border border-[#22273A] text-left text-xs space-y-2.5 font-mono">
              <div className="flex justify-between border-b border-[#1C2030] pb-2">
                <span className="text-neutral-400">Transaction ID:</span>
                <span className="font-bold text-emerald-400">{withdrawSuccessReceipt.transactionId}</span>
              </div>
              <div className="flex justify-between border-b border-[#1C2030] pb-2">
                <span className="text-neutral-400">Amount:</span>
                <span className="font-bold text-white">${withdrawSuccessReceipt.amount.toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between border-b border-[#1C2030] pb-2">
                <span className="text-neutral-400">Method:</span>
                <span className="text-white">{withdrawSuccessReceipt.payoutMethod}</span>
              </div>
              <div className="flex justify-between border-b border-[#1C2030] pb-2">
                <span className="text-neutral-400">Destination:</span>
                <span className="text-neutral-200 truncate max-w-[180px]">{withdrawSuccessReceipt.payoutDetails}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Status:</span>
                <span className="font-bold text-emerald-400 uppercase">COMPLETED ✅</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setWithdrawSuccessReceipt(null)}
              className="w-full py-3 rounded-2xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-all shadow-md shadow-emerald-600/30 cursor-pointer"
            >
              Done & View Updated Wallet
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
