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
} from 'lucide-react';
import { useUserAuth } from '../../context/UserAuthContext';
import { api } from '../../services/api';
import { UserReferralItem, UserReferralStats, UserPaymentDetails } from '../../types';
import { Spinner } from '../../components/common/Loader';

export const UserDashboardPage: React.FC = () => {
  const { user, logout, updateUser } = useUserAuth();

  const [stats, setStats] = useState<UserReferralStats>({
    totalReferrals: 0,
    registeredReferrals: 0,
    qualifiedReferrals: 0,
    convertedClients: 0,
    totalQualifyingPayments: 0,
    totalEarnedCommission: 0,
    pendingCommission: 0,
    approvedCommission: 0,
    paidCommission: 0,
    currency: 'USD',
  });

  const [referrals, setReferrals] = useState<UserReferralItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  // Payout Details Form State
  const [paymentForm, setPaymentForm] = useState<UserPaymentDetails>({
    method: 'Bank Transfer',
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
        method: user.paymentDetails?.method || 'Bank Transfer',
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

  return (
    <div className="pt-28 pb-20 min-h-screen bg-[#0B0B0F] px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <Helmet>
        <title>Referral Dashboard | SH Web Studio</title>
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
                <span>10% Referral Partner</span>
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
            className="p-2.5 rounded-xl bg-[#17181F] hover:bg-[#20222B] border border-[#262833] text-neutral-300 hover:text-white text-xs font-medium transition-colors"
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

      {/* Referral Link Box (Primary Hero Action) */}
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
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
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
            <span>Total Commission</span>
            <DollarSign className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white font-mono text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
            ${stats.totalEarnedCommission.toLocaleString()}
          </div>
          <div className="text-[10px] text-neutral-400 mt-1">10% earned revenue</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#121318] border border-[#20222B]">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
            <span>Pending Review</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-amber-400 font-mono">
            ${stats.pendingCommission.toLocaleString()}
          </div>
          <div className="text-[10px] text-neutral-400 mt-1">Awaiting client clear</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#121318] border border-[#20222B]">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
            <span>Approved</span>
            <ShieldCheck className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-blue-400 font-mono">
            ${stats.approvedCommission.toLocaleString()}
          </div>
          <div className="text-[10px] text-neutral-400 mt-1">Ready for payout</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#121318] border border-[#20222B]">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
            <span>Paid Out</span>
            <CreditCard className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-400 font-mono">
            ${stats.paidCommission.toLocaleString()}
          </div>
          <div className="text-[10px] text-neutral-400 mt-1">Direct deposited</div>
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
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold ${
                                isClient
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : 'bg-neutral-800 text-neutral-300 border border-neutral-700'
                              }`}
                            >
                              {item.status.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-white">
                            {item.qualifyingPayment > 0 ? `$${item.qualifyingPayment}` : '—'}
                          </td>
                          <td className="py-3.5 px-4 font-mono font-extrabold text-blue-400">
                            {item.commission > 0 ? `$${item.commission}` : '—'}
                          </td>
                          <td className="py-3.5 px-4">
                            {item.commissionsCount > 0 ? (
                              <div className="space-y-1">
                                {item.commissions.map((c) => (
                                  <span
                                    key={c.id}
                                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold ${
                                      c.status === 'paid'
                                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                        : c.status === 'approved'
                                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                        : c.status === 'rejected'
                                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                    }`}
                                  >
                                    {c.status}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-neutral-400 text-[11px] font-mono">Pending</span>
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

        {/* Right 1 Col: Payout Details & Profile Settings */}
        <div className="space-y-6">
          {/* Payout Details Card */}
          <div className="p-6 rounded-3xl bg-[#121318] border border-[#20222B] shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1C1D24]">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-blue-400" />
                <h4 className="text-sm font-bold text-white">Payout Method</h4>
              </div>
              <button
                type="button"
                onClick={() => setEditingPayment(!editingPayment)}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{editingPayment ? 'Cancel' : 'Edit'}</span>
              </button>
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
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span>{paymentMessage.text}</span>
              </div>
            )}

            {editingPayment ? (
              <form onSubmit={handleSavePaymentDetails} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 mb-1 uppercase">
                    Payout Method
                  </label>
                  <select
                    value={paymentForm.method}
                    onChange={(e) =>
                      setPaymentForm({ ...paymentForm, method: e.target.value as any })
                    }
                    className="w-full px-3 py-2 bg-[#0B0B0F] border border-[#262833] rounded-xl text-xs text-white outline-none"
                  >
                    <option value="Bank Transfer">Bank Transfer (Pakistan & International)</option>
                    <option value="Easypaisa">Easypaisa</option>
                    <option value="JazzCash">JazzCash</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Other">Other Payout Channel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 mb-1 uppercase">
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    required
                    value={paymentForm.accountHolderName}
                    onChange={(e) =>
                      setPaymentForm({ ...paymentForm, accountHolderName: e.target.value })
                    }
                    placeholder="e.g. Muhammad Humayoon"
                    className="w-full px-3 py-2 bg-[#0B0B0F] border border-[#262833] rounded-xl text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 mb-1 uppercase">
                    Bank / Service Name
                  </label>
                  <input
                    type="text"
                    value={paymentForm.bankName}
                    onChange={(e) =>
                      setPaymentForm({ ...paymentForm, bankName: e.target.value })
                    }
                    placeholder="e.g. Meezan Bank / HBL / Easypaisa"
                    className="w-full px-3 py-2 bg-[#0B0B0F] border border-[#262833] rounded-xl text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 mb-1 uppercase">
                    Account Number / IBAN / Wallet Number
                  </label>
                  <input
                    type="text"
                    required
                    value={paymentForm.accountNumber}
                    onChange={(e) =>
                      setPaymentForm({ ...paymentForm, accountNumber: e.target.value })
                    }
                    placeholder="e.g. PK00MEZN0000000000000000"
                    className="w-full px-3 py-2 bg-[#0B0B0F] border border-[#262833] rounded-xl text-xs text-white outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 mb-1 uppercase">
                    Additional Payout Notes
                  </label>
                  <input
                    type="text"
                    value={paymentForm.notes}
                    onChange={(e) =>
                      setPaymentForm({ ...paymentForm, notes: e.target.value })
                    }
                    placeholder="Optional SWIFT or Branch details"
                    className="w-full px-3 py-2 bg-[#0B0B0F] border border-[#262833] rounded-xl text-xs text-white outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={savingPayment}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {savingPayment ? <Spinner size="sm" /> : <Save className="w-3.5 h-3.5" />}
                  <span>Save Payout Details</span>
                </button>
              </form>
            ) : (
              <div className="space-y-3 text-xs">
                {user?.paymentDetails?.accountNumber ? (
                  <div className="space-y-2">
                    <div className="flex justify-between py-1 border-b border-[#1A1B22]">
                      <span className="text-neutral-400">Method:</span>
                      <strong className="text-white">{user.paymentDetails.method || 'Bank Transfer'}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#1A1B22]">
                      <span className="text-neutral-400">Account Name:</span>
                      <strong className="text-white">{user.paymentDetails.accountHolderName}</strong>
                    </div>
                    {user.paymentDetails.bankName && (
                      <div className="flex justify-between py-1 border-b border-[#1A1B22]">
                        <span className="text-neutral-400">Bank / Provider:</span>
                        <span className="text-white">{user.paymentDetails.bankName}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-1 border-b border-[#1A1B22]">
                      <span className="text-neutral-400">Account / IBAN:</span>
                      <span className="font-mono text-neutral-300">
                        {user.paymentDetails.accountNumber.length > 8
                          ? `•••• •••• ${user.paymentDetails.accountNumber.slice(-4)}`
                          : user.paymentDetails.accountNumber}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-[#0B0B0F] border border-dashed border-[#262833] text-center space-y-2">
                    <p className="text-neutral-400 text-[11px]">
                      No payout method added yet. Add your bank or mobile wallet details to receive commission payouts.
                    </p>
                    <button
                      type="button"
                      onClick={() => setEditingPayment(true)}
                      className="px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 text-xs font-semibold"
                    >
                      + Add Payout Method
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Profile Information Card */}
          <div className="p-6 rounded-3xl bg-[#121318] border border-[#20222B] shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1C1D24]">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-blue-400" />
                <h4 className="text-sm font-bold text-white">Profile Details</h4>
              </div>
              <button
                type="button"
                onClick={() => setEditingProfile(!editingProfile)}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{editingProfile ? 'Cancel' : 'Edit'}</span>
              </button>
            </div>

            {profileMessage && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  profileMessage.type === 'success'
                    ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{profileMessage.text}</span>
              </div>
            )}

            {editingProfile ? (
              <form onSubmit={handleSaveProfile} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 mb-1 uppercase">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0B0B0F] border border-[#262833] rounded-xl text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 mb-1 uppercase">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    placeholder="+92 300 0000000"
                    className="w-full px-3 py-2 bg-[#0B0B0F] border border-[#262833] rounded-xl text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 mb-1 uppercase">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    value={profileForm.company}
                    onChange={(e) => setProfileForm({ ...profileForm, company: e.target.value })}
                    placeholder="Optional"
                    className="w-full px-3 py-2 bg-[#0B0B0F] border border-[#262833] rounded-xl text-xs text-white outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={savingProfile}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {savingProfile ? <Spinner size="sm" /> : <Save className="w-3.5 h-3.5" />}
                  <span>Save Profile</span>
                </button>
              </form>
            ) : (
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-[#1A1B22]">
                  <span className="text-neutral-400">Email:</span>
                  <span className="font-mono text-white">{user?.email}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1A1B22]">
                  <span className="text-neutral-400">Phone:</span>
                  <span className="text-white">{user?.phone || 'Not set'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1A1B22]">
                  <span className="text-neutral-400">Company:</span>
                  <span className="text-white">{user?.company || 'None'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1A1B22]">
                  <span className="text-neutral-400">Referral Code:</span>
                  <span className="font-mono text-blue-400 font-bold">{user?.referralCode}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
